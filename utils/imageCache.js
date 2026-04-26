const fs = require('fs');
const path = require('path');
const Image = require('../models/image');

const cacheDir = path.join(__dirname, '..', '.temp-cache', 'images');
let imagesCached = false;
const map = new Map(); // slug -> { path, contentType }

function extensionFromContentType(ct) {
    if (!ct) return '.bin';
    ct = ct.toLowerCase();
    if (ct.includes('png')) return '.png';
    if (ct.includes('jpeg') || ct.includes('jpg')) return '.jpg';
    if (ct.includes('gif')) return '.gif';
    if (ct.includes('webp')) return '.webp';
    if (ct.includes('svg')) return '.svg';
    return '.bin';
}

async function ensureDir() {
    try {
        await fs.promises.mkdir(cacheDir, { recursive: true });
    } catch (e) {
        // ignore
    }
}

async function init() {
    imagesCached = false;
    await ensureDir();
    try {
        const imgs = await Image.find({}, 'slug contentType data');
        for (const img of imgs) {
            try {
                const ext = extensionFromContentType(img.contentType);
                const filename = img.slug + ext;
                const dest = path.join(cacheDir, filename);
                await fs.promises.writeFile(dest, img.data);
                map.set(img.slug, { path: dest, contentType: img.contentType });
            } catch (e) {
                console.error('Failed caching image', img.slug, e && e.message);
            }
        }
    } catch (e) {
        console.error('Image cache init failed', e && e.message);
    }
    imagesCached = true;
    return imagesCached;
}

async function writeImageToCache(img) {
    if (!img || !img.slug) return null;
    await ensureDir();
    const ext = extensionFromContentType(img.contentType);
    const filename = img.slug + ext;
    const dest = path.join(cacheDir, filename);
    try {
        // if img.data is a Mongoose buffer, it can be written directly
        await fs.promises.writeFile(dest, img.data);
        map.set(img.slug, { path: dest, contentType: img.contentType });
        return dest;
    } catch (e) {
        console.error('Failed to write image to cache', e && e.message);
        return null;
    }
}

async function removeImageFromCache(slug) {
    if (!slug) return;
    const info = map.get(slug);
    if (info && info.path) {
        try {
            await fs.promises.unlink(info.path);
        } catch (e) {
            // ignore
        }
    } else {
        // try to find matching files in cache directory
        try {
            const files = await fs.promises.readdir(cacheDir);
            for (const f of files) {
                if (f.startsWith(slug)) {
                    try { await fs.promises.unlink(path.join(cacheDir, f)); } catch(e){}
                }
            }
        } catch (e) { }
    }
    map.delete(slug);
}

function getCachedInfo(slug) {
    return map.get(slug) || null;
}

function getImagesCached() {
    return imagesCached;
}

module.exports = { init, writeImageToCache, removeImageFromCache, getCachedInfo, getImagesCached };
