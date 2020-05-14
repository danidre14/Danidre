const MarkDownToUp = function () {
    const smileys = [
        [':grinning:', '😀'],
        [':smiley:', '😃'],
        [':smile:', '😄'],
        [':grin:', '😁'],
        [':laughing:', '😆'],
        [':sweat_smile:', '😅'],
        [':rofl:', '🤣'],
        [':joy:', '😂'],
        [':slight_smile:', '🙂'],
        [':upside_down:', '🙃'],
        [':wink:', '😉'],
        [':blush:', '😊'],
        [':innocent:', '😇'],
        [':feel_loved:', '🥰'],
        [':heart_eyes:', '😍'],
        [':star_eyes:', '🤩'],
        [':kissing_heart:', '😘'],
        [':kissing:', '😗'],
        [':relaxed:', '☺'],
        [':kissing_closed_eyes:', '😚'],
        [':kissing_smiling_eyes:', '😙'],
        [':yum:', '😋'],
        [':stuck_out_tongue:', '😛'],
        [':stuck_out_tongue_winking_eye:', '😜'],
        [':stuck_out_tongue_googly:', '🤪'],
        [':stuck_out_tongue_closed_eyes:', '😝'],
        [':money_mouth:', '🤑'],
        [':hugging:', '🤗'],
        [':hand_over_mouth:', '🤭'],
        [':shush:', '🤫'],
        [':thinking:', '🤔'],
        [':zipper_mouth:', '🤐'],
        [':raised_eyebrow:', '🤨'],
        [':neutral_face:', '😐'],
        [':expressionless:', '😑'],
        [':no_mouth:', '😶'],
        [':smirk:', '😏'],
        [':unamused:', '😒'],
        [':rolling_eyes:', '🙄'],
        [':grimacing:', '😬'],
        [':lying_face:', '🤥'],
        [':relieved:', '😌'],
        [':pensive:', '😔'],
        [':sleepy:', '😪'],
        [':drooling_face:', '🤤'],
        [':sleeping:', '😴'],
        [':eyes:', '👀']
    ];

    const getHeadingId = function (string) {
        return string.replace(/[^ \w]/gi, "").replace(/  +/g, " ").replace(/ /g, "-").toLowerCase();
    }

    const convert = function (string) {
        string = string.replace(/&/g, '&amp;');
        string = string.replace(/</g, '&lt;');
        string = string.replace(/>/g, '&gt;');
        const checkType = function (string) {
            const key = string.split(' ')[0] || '';
            if (key === '###') {
                const heading = checkInline(string.substring(3));
                string = `<h3 id="${getHeadingId(heading)}">${heading}</h3>`;
            } else if (key === '##') {
                const heading = checkInline(string.substring(2));
                string = `<h2 id="${getHeadingId(heading)}">${heading}</h2>`;
            } else if (key === '#') {
                const heading = checkInline(string.substring(1));
                string = `<h1 id="${getHeadingId(heading)}">${heading}</h1>`;
            } else if (key.substr(0, 5) === '*****') {
                string = `<div class="hr"></div>`;
            } else if (key.substr(0, 5) === '-----') {
                string = `<div class="br"></div>`;
            } else if (key === '-&gt;&gt;' || key === '--&gt;') {
                string = `</ul>`;
            } else if (key === '-&gt;') {
                string = `<ul>`;
            } else if (key === '=&gt;&gt;' || key === '==&gt;') {
                string = `</ol>`;
            } else if (key === '=&gt;') {
                string = `<ol>`;
            } else if (key === '-' || key === '+') {
                string = `<li>${checkInline(string.substring(1))}</li>`;
            } else if (key === '&gt;') {
                string = `<blockquote>${checkInline(string.substring(4))}</blockquote>`;
            } else if (key.substr(0, 2) === '//') {
                string = '';
            } else {
                string = `<p>${checkInline(string)}</p>`;
            }
            return string;
        }

        const inRange = function (num, ranges) {
            for (const i in ranges) {
                if (num > ranges[i][0] && num < ranges[i][1])
                    return true;
            }
            return false;
        }

        const getVidLink = function (string) {
            if (/https:\/\/www.youtube.com\/embed\//.test(string)) {
                string = string;
            } else if (/https:\/\/www.youtube.com\/watch\?v=/.test(string)) {
                string = string.replace(/watch\?v=/, 'embed/');
            } else if ((/https:\/\/www.youtu.be\//.test(string)) || (/https:\/\/youtu.be\//.test(string))) {
                string = string.replace(/.be\//, 'be.com/embed/');
            }
            if (string.indexOf('&') !== -1) {
                string = string.substring(0, string.indexOf('&'));
            }
            return string;
        }

        const checkInline = function (string) {
            string = string || '';
            const inline = [];
            const links = [];
            const ranges = [];
            const codes = [];
            let bStart = -1, bEnd = -1; //bold/strong
            let emStart = -1, emEnd = -1; //emphasis
            let iStart = -1, iEnd = -1; //italic
            let cStart = -1, cEnd = -1; //code
            let lStart = -1, lEnd = -1; //linktext
            let aStart = -1, aEnd = -1; //hreftext



            for (const i in string) {
                const char = string[i];
                const ind = parseInt(i);
                if (char === "`" /*&& !inRange(ind, ranges)*/) {
                    if (cStart === -1) {
                        cStart = ind;
                    } else /*if(cStart !== ind-1)*/ {
                        cEnd = ind;
                        if (cStart !== ind - 1) {
                            codes.push([cStart, cEnd]);
                        } else {
                            inline.push([cStart, '', 2]);
                            ranges.push([cStart, cEnd + 1]);
                        }
                        cStart = -1;
                        cEnd = -1;
                    }
                }
            }
            for (let i = codes.length - 1; i >= 0; i--) {
                const j = codes[i];
                const pulledCodeBar = string.slice(j[0], j[1] + 1);
                let pulledCode = pulledCodeBar.slice(1, -1);
                pulledCode = pulledCode.replace(/\*/g, '&ast;').replace(/`/g, '&grave;').replace(/:/g, '&colon;');

                const basecode = `${pulledCodeBar}`;
                const bLength = basecode.length;

                let newTag = '';
                newTag = `<code>${pulledCode}</code>`;

                inline.push([j[0], newTag, bLength]);
                ranges.push([j[0], j[0] + bLength]);
            }

            for (const i in string) {
                const char = string[i];
                const ind = parseInt(i);
                if (inRange(ind, ranges)) continue;
                if (char === "[") {
                    lStart = ind;
                } else if (char === "]" && lStart !== -1 && lEnd === -1) {
                    lEnd = ind;
                } else if (char === "(" && lEnd === ind - 1) {
                    aStart = ind;
                } else if (char === ")" && aStart !== -1 && aEnd === -1) {
                    aEnd = ind;
                    links.push([lStart, lEnd, aStart, aEnd]);
                    lStart = -1;
                    lEnd = -1;
                    aStart = -1;
                    aEnd = -1;
                }
            }
            /* [Twi*lol*](l*ol*) l**uol** [ki*lolk`8*](d*shtg*)
            [ho :smile: ](ds:smile:ds)
            [->](dsd)
            
            [d`sd`]() l**ol** [dsd]()
            `code` `:smile:`
            [li```:smile:nk](link)
            ```` */
            for (let i = links.length - 1; i >= 0; i--) {
                const j = links[i];
                const baselinkBar = string.slice(j[0], j[3] + 1);
                let hasCode = false;
                for (const k in baselinkBar) {
                    const ind = j[0] + parseInt(k);
                    if (inRange(ind, ranges)) {
                        hasCode = true;
                        break;
                    }
                }
                if (hasCode) continue;
                const pulledTextBar = string.slice(j[0], j[1] + 1);
                let pulledText = pulledTextBar.slice(1, -1);
                pulledText = pulledText.replace(/\*/g, '&ast;').replace(/\:/g, '&colon;');
                const pulledLinkBar = string.slice(j[2], j[3] + 1);
                let pulledLink = pulledLinkBar.slice(1, -1);
                const baselink = `${pulledTextBar}${pulledLinkBar}`;
                const bLength = baselink.length;
                const type = pulledLink.substr(-5).split('.')[1];
                let isVid = false;
                let vidLink = '';
                let newTag = '';
                if (/https:\/\/www.youtube.com\/embed\//.test(pulledLink) || /https:\/\/www.youtube.com\/watch\?v=/.test(pulledLink) || /https:\/\/www.youtu.be\//.test(pulledLink)) {
                    vidLink = getVidLink(pulledLink).replace(/\*/g, '&ast;').replace(/\:/g, '&colon;');
                    isVid = true;
                }
                pulledLink = pulledLink.replace(/\*/g, '&ast;').replace(/\:/g, '&colon;');
                if (isVid) {
                    newTag = `<div style="position:relative;height:0;padding-top:56.25%;width:100%;"><iframe style="position:absolute;top:0;left:0;border:0;width:100%;height:100%;" src="${vidLink}" frameborder="0" allow="accelerometer;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe></div>`;
                } else if (['png', 'jpeg', 'jpg', 'gif'].includes(type)) {
                    newTag = `<img style="display:block;margin:auto;" src="${pulledLink}" alt="${pulledText}" />`;
                } else {
                    newTag = `<a href="${pulledLink}" target="_blank" rel="noopener noreferrer">${pulledText}</a>`;
                }

                const hLength = newTag.length;

                inline.push([j[0], newTag, bLength]);
                // string = replaceAt(string, j[0], newTag, bLength);
                ranges.push([j[0], j[0] + bLength]);
            }
            /*
                if (cStart !== -1 && char === ":" && inRange(ind, codes)) {
                    string = replaceAt(string, ind, '&colon;', 0);
                }
            for(let i = string.length-1; i >= 0; i--) {
                const char = string[i];
                const ind = parseInt(i);
                if (char === ":" && inRange(ind, codes)) {
                    string = replaceAt(string, ind, '&colon;', 0);
                }
            }
            */

            for (const i in string) {
                const ind = parseInt(i);
                const charB = string[ind - 1];
                const char = string[ind];
                const charA = string[ind + 1];

                if (inRange(ind, ranges)) continue;
                if ((char === "*" && charA === "*" && charB !== "*")) {
                    if (emStart === -1) {
                        emStart = ind;
                    } else if (emStart !== ind - 1) {
                        emEnd = ind;
                        inline.push([emStart, '<strong>', 2]);
                        inline.push([emEnd, '</strong>', 2]);
                        ranges.push([emStart, emEnd]);
                        emStart = -1;
                        emEnd = -1;
                    }
                } else if (char === "*" && charA !== "*" && charB !== "*") {
                    if (bStart === -1) {
                        bStart = ind;
                    } else if (bStart !== ind - 1) {
                        bEnd = ind;
                        inline.push([bStart, '<em>']);
                        inline.push([bEnd, '</em>']);
                        bStart = -1;
                        bEnd = -1;
                    }
                }
            }
            inline.sort((a, b) => a[0] - b[0]);
            for (let i = inline.length - 1; i >= 0; i--) {
                const pos = inline[i];
                const length = pos[2] || 1;
                string = replaceAt(string, pos[0], pos[1], length);
            }
            smileys.forEach(smiley => {
                const val = new RegExp(smiley[0], 'ig');
                string = string.replace(val, smiley[1]);
            });
            return string.replace(/\*/g, '&ast;').replace(/`/g, '&grave;').replace(/\:/g, '&colon;').trim();
        }

        const replaceAt = function (string, index, replacement, length) {
            return string.substr(0, index) + replacement + string.substr(index + length);
        }

        let lines = string.split('\n');
        let markUp = [];
        for (const i in lines) {
            if (lines[i].trim() !== '')
                markUp.push(checkType(lines[i].trim()));
        }
        return markUp.join('');
    }
    return {
        convert
    };
}

module.exports = MarkDownToUp;