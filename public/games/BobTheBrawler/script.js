const gameVars = {};
const panel = new GamePanel("gameArea", { dimensions: { width: 500, height: 450 }, name: "Bob The Brawler" });
const WIDTH = panel.canvasWidth();
const HEIGHT = panel.canvasHeight();
const SCALE = WIDTH / HEIGHT;

let PAUSED = true;

const leftMouseBtn = 0;
const rightMouseBtn = 2;
const actionKey = leftMouseBtn;
const buildKey = rightMouseBtn;
let mouseClicked = false;
let leftClicked = false;
let rightClicked = false;

let musicStopped = false;

let init = true;

const lW = 10, lH = 9;

const stage = panel.getCanvas();
const screen = stage.getContext('2d');
screen.mozImageSmoothingEnabled = false;
screen.webkitImageSmoothingEnabled = false;
screen.msImageSmoothingEnabled = false;
screen.imageSmoothingEnabled = false;


const powerUpDuration = 180;
const defaultPlayerMaxHealth = 100;
const bounceDistance = 20;
const defaultPunchStrength = 24;
const defaultWallStrength = 55;
const defaultPlayerReach = 45;
const defaultStartledCount = 3;
const defaultGameMusicVolume = 75;


let playerMaxHealth = defaultPlayerMaxHealth;
let playerHealth = playerMaxHealth;
let playerX = 0;
let playerY = 0;
const playerW = 50;
const playerH = 50;
let playerBX = 0;
let playerBY = 0;
let playerDead = false;
let canRestart = false;
let punchStrength = defaultPunchStrength;
let wallStrength = defaultWallStrength;
let playerReach = defaultPlayerReach;

let playerStartled = false;
let playerStartledCount = defaultStartledCount;
let playerStartledCounter = 0;

const scoreEnemyDead = 69;
const scoreEnemyHit = 3;
const scorePotionPickup = 11;
const scorePackagePickup = 42;
const scorePowerUpPickup = 31;

const spawnDropTries = 10;
const crosshairSize = 30;

const adjuster = 1000;

let movingLeft = false;
let movingRight = false;
let movingUp = false;
let movingDown = false;
let doingAction = false;
let crosshairCord = { x: 0, y: 0 };
let mouseCords = { x: 0, y: 0 };
let punchBack = [];

let score = 0;
let potions = 0;
let walls = 0;

let canPunch = false;
let canUsePotion = false;

let Dani = {
    random: function (a, b) {
        let result;
        let random = Math.random();
        if (a !== null && typeof a === "object") {
            //treat as list
            if (b === 1)
                result = a[this.random(a.length - 1)];
            else
                result = this.cloneObject(a).sort(function () {
                    return random > .5 ? -1 : 1;
                });
        } else if (typeof a === "string") {
            //treat as string
            if (b === 1)
                result = a.split("")[this.random(a.length - 1)];
            else
                result = a.split("").sort(function () {
                    return random > .5 ? -1 : 1;
                }).join("");
        } else if (typeof a === "number") {
            //treat as number
            if (typeof b === "number") {
                //treat as range
                result = Math.round(random * (b - a)) + a;
            } else {
                //treat as number
                result = Math.round(random * a);
            }
        } else {
            //treat as val between 0 and 1
            result = random;
        }
        return result;
    },
    cloneObject: function (obj) {
        if (obj === null || typeof (obj) !== 'object')
            return obj;

        let temp = new obj.constructor();
        for (let key in obj)
            temp[key] = this.cloneObject(obj[key]);

        return temp;
    },
    lock: function (num, a, b) {
        if (num === undefined) return 0;
        if (b === undefined) b = a;
        if (num < a) num = a;
        else if (num > b) num = b;
        return num;
    },
    cycle: function (num, max, min) {
        if (num === undefined || max === undefined) return 0;
        min = min || 0;
        num = this.lock(num, min, max);
        if (num < max) num++;
        else num = min;
        return num;
    }
}

const Aim = function () {
    const size = gameVars.level.size;
    let x = 0;
    let y = 0;
    let bX = 0;
    let bY = 0;
    let range = 0;
    function tick() {

        let newX = mouseCords.x;
        let newY = mouseCords.y;
        let xx = newX - playerX;
        let yy = newY - (playerY - playerW / 2);
        let angleRad = Math.atan2(yy, xx);
        let angleDeg = angleRad / Math.PI * 180;
        let rotation = angleDeg;

        let distance = Math.sqrt((xx * xx) + (yy * yy));
        range = distance > playerReach ? playerReach : distance;

        let xMov = Math.cos(rotation * (Math.PI / 180));
        let yMov = Math.sin(rotation * (Math.PI / 180));
        x = playerX + xMov * range;
        y = (playerY - playerW / 2) + yMov * range;

        bX = (Math.floor(x / gameVars.level.size) * gameVars.level.size);
        bY = (Math.floor(y / gameVars.level.size) * gameVars.level.size);
    }
    function render() {
        drawImg('crosshair', x - size / 2, y - size / 2, size, size);
        drawImg('buildOptions', bX, bY, size, size);
    }
    function getCoords() {
        return { x: x, y: y, bX: bX, bY: bY };
    }
    return {
        tick,
        render,
        getCoords
    }
}

const Entity = function () {

    const entities = [];

    const Length = function () {
        return entities.length;
    }

    const reset = function () {
        while (entities.length) {
            entities.pop();
        }
    }

    const addEntity = function (type, x, y, w, h) {
        x = x || 0;
        y = y || 0;
        w = Dani.lock(w, 40) || 40;
        h = Dani.lock(h, 40) || 40;

        if (type === 'char') {
            entities.push(new Character(x, y, w, h, type));
        } else if (type === 'enem') {
            entities.push(new Enemy(x, y, w, h, type));
        }
    }

    function tick() {
        //sort entities based on their y
        entities.sort((a, b) => a.getY() - b.getY());
        for (const i in entities) {
            const entity = entities[i];
            entity.tick();

            if (!entity.getIsDead())
                testCollisions(entity);

            if (entity.getRemove()) {
                entities.splice(parseInt(i), 1);
                const rands = Dani.random(1000);
                if (rands > 650 + Dani.lock(Math.floor(score / adjuster) * 5, 0, 200)) {
                    gameVars.audios.audio.playOnce('PackageDrop');
                    gameVars.drops.drop('potion', entity.getBX(), entity.getBY());
                }

                if (rands > 985 - Dani.lock(Math.floor(score / adjuster) * 2, 0, 120))
                    gameVars.gui.addWall(1);

                if (rands > 950 - Math.floor(score / adjuster) * 2)
                    gameVars.gui.upMaxHealth(Dani.random(12));
            }
        }
    }

    function render() {
        for (const i in entities) {
            entities[i].render();
        }
    }

    function isFreeTile(tX, tY) {
        for (const i in entities) {
            const entity = entities[i];

            if (entity.getIsDead()) continue;

            const w = entity.getW();
            const h = entity.getH();
            const x = entity.getX();
            const y = entity.getY();

            const leftPoint = getBlockX(x - (w / 4));
            const rightPoint = getBlockX(x + (w / 4));
            const topPoint = getBlockY(y - (h * 3 / 4));
            const bottomPoint = getBlockY(y - (h / 4));

            if (pointsMatch(leftPoint, topPoint, tX, tY) || pointsMatch(rightPoint, topPoint, tX, tY) || pointsMatch(leftPoint, bottomPoint, tX, tY) || pointsMatch(rightPoint, bottomPoint, tX, tY)) {
                return false;
            }
        }
        return true;
    }
    function testOutBounds(x, y, w, h) {
        // colliding with borders
        if (x - (w / 2) < 0) return true;
        if (x + (w / 2) > WIDTH) return true;
        if (y - h < 0) return true;
        if (y > HEIGHT) return true;
        return false;
    }
    function testTouchingTileAxis(x, y, w, h, tiles) {
        let xAxis = false;
        let yAxis = false;
        if (x - (w / 2) < 0 || x + (w / 2) > WIDTH) xAxis = true;
        if (y - h < 0 || y > HEIGHT) yAxis = true;

        const rightX = getBlockX(x + (w / 2));
        const leftX = getBlockX(x - (w / 2));
        const topY = getBlockY(y - h);
        const bottomY = getBlockY(y);

        const xCenter = getBlockX(x);
        const yCenter = getBlockY(y - (h / 2));

        //touching wall
        if (isTouchingTile(leftX, yCenter, tiles) || isTouchingTile(rightX, yCenter, tiles)) xAxis = true;
        if (isTouchingTile(xCenter, topY, tiles) || isTouchingTile(xCenter, bottomY, tiles)) yAxis = true;

        return { x: xAxis, y: yAxis }
    }
    function testBurriedInTile(x, y, w, h, tiles) {
        const leftPoint = getBlockX(x - (w / 4));
        const rightPoint = getBlockX(x + (w / 4));
        const topPoint = getBlockY(y - (h * 3 / 4));
        const bottomPoint = getBlockY(y - (h * 3 / 8));

        if (isTouchingTile(leftPoint, topPoint, tiles) || isTouchingTile(rightPoint, topPoint, tiles) || isTouchingTile(leftPoint, bottomPoint, tiles) || isTouchingTile(rightPoint, bottomPoint, tiles)) {
            return true;
        }
        return false;
    }

    function testTouchingTile(x, y, w, h, tiles) {
        const rightX = getBlockX(x + (w / 2));
        const leftX = getBlockX(x - (w / 2));
        const topY = getBlockY(y - h);
        const bottomY = getBlockY(y);

        const xLeft = getBlockX(x - (w / 4))
        const xRight = getBlockX(x + (w / 4));
        const yTop = getBlockY(y - (h * 3 / 4));
        const yBottom = getBlockY(y - (h / 4));

        //touching wall
        if (isTouchingTile(leftX, yBottom, tiles) || isTouchingTile(leftX, yTop, tiles)) {
            return true
        }
        if (isTouchingTile(rightX, yBottom, tiles) || isTouchingTile(rightX, yTop, tiles)) {
            return true
        }
        if (isTouchingTile(xLeft, topY, tiles) || isTouchingTile(xRight, topY, tiles)) {
            return true
        }
        if (isTouchingTile(xLeft, bottomY, tiles) || isTouchingTile(xRight, bottomY, tiles)) {
            return true
        }
        return false;
    }
    function isTouchingTile(x, y, tiles) {
        try {
            for (const i in tiles) {
                if (gameVars.level.isBlock(x, y, tiles[i]))
                    return true;
            }
        } catch {
            return false;
        }
    }

    function testCollisions(self) {
        let collided = false;
        const w = self.getW();
        const h = self.getH();
        const x = self.getX();
        const y = self.getY();

        // colliding with walls
        //collisions
        const rightX = getBlockX(x + (w / 2));
        const leftX = getBlockX(x - (w / 2));
        const topY = getBlockY(y - h);
        const bottomY = getBlockY(y);

        const xLeft = getBlockX(x - (w / 4))
        const xRight = getBlockX(x + (w / 4));
        const yTop = getBlockY(y - (h * 3 / 4));
        const yBottom = getBlockY(y - (h / 4));

        // left collide
        if (collide(leftX, yTop)) {
            collided = true;
            let newX = leftX * gameVars.level.size + gameVars.level.size;
            let newY = yTop * gameVars.level.size + gameVars.level.size / 2;
            let xx = newX - (x - (w / 2));
            let yy = newY - (y - (h * 3 / 4));
            let angleRad = Math.atan2(yy, xx);
            let angleDeg = angleRad / Math.PI * 180;

            let rotation = angleDeg;
            let yMov = Math.sin(rotation * (Math.PI / 180));
            const newDD = Math.round(xx + 1);
            self.setX(x + newDD);
            self.setY(y - yMov);
        }
        if (collide(leftX, yBottom)) {
            collided = true;
            let newX = leftX * gameVars.level.size + gameVars.level.size;
            let newY = yBottom * gameVars.level.size + gameVars.level.size / 2;
            let xx = newX - (x - (w / 2));
            let yy = newY - (y - (h / 4));
            let angleRad = Math.atan2(yy, xx);
            let angleDeg = angleRad / Math.PI * 180;

            let rotation = angleDeg;
            let yMov = Math.sin(rotation * (Math.PI / 180));
            const newDD = Math.round(xx + 1);
            self.setX(x + newDD);
            self.setY(y - yMov);
        }

        // right collide
        if (collide(rightX, yTop)) {
            collided = true;
            let newX = rightX * gameVars.level.size;
            let newY = yTop * gameVars.level.size + gameVars.level.size / 2;
            let xx = newX - (x + (w / 2));
            let yy = newY - (y - (h * 3 / 4));
            let angleRad = Math.atan2(yy, xx);
            let angleDeg = angleRad / Math.PI * 180;

            let rotation = angleDeg;
            let yMov = Math.sin(rotation * (Math.PI / 180));
            const newDD = Math.round(xx - 1);
            self.setX(x + newDD);
            self.setY(y - yMov);
        }
        if (collide(rightX, yBottom)) {
            collided = true;
            let newX = rightX * gameVars.level.size;
            let newY = yBottom * gameVars.level.size + gameVars.level.size / 2;
            let xx = newX - (x + (w / 2));
            let yy = newY - (y - (h / 4));
            let angleRad = Math.atan2(yy, xx);
            let angleDeg = angleRad / Math.PI * 180;

            let rotation = angleDeg;
            let yMov = Math.sin(rotation * (Math.PI / 180));
            const newDD = Math.round(xx - 1);
            self.setX(x + newDD);
            self.setY(y - yMov);
        }

        // top collide
        if (collide(xLeft, topY)) {
            collided = true;
            let newX = xLeft * gameVars.level.size + gameVars.level.size / 2;
            let newY = topY * gameVars.level.size + gameVars.level.size;
            let xx = newX - (x - (w / 4));
            let yy = newY - (y - h);
            let angleRad = Math.atan2(yy, xx);
            let angleDeg = angleRad / Math.PI * 180;

            let rotation = angleDeg;
            let xMov = Math.cos(rotation * (Math.PI / 180));
            const newDD = Math.round(yy + 1);
            self.setX(x - xMov);
            self.setY(y + newDD);
        }
        if (collide(xRight, topY)) {
            collided = true;
            let newX = xRight * gameVars.level.size + gameVars.level.size / 2;
            let newY = topY * gameVars.level.size + gameVars.level.size;
            let xx = newX - (x + (w / 4));
            let yy = newY - (y - h);
            let angleRad = Math.atan2(yy, xx);
            let angleDeg = angleRad / Math.PI * 180;

            let rotation = angleDeg;
            let xMov = Math.cos(rotation * (Math.PI / 180));
            const newDD = Math.round(yy + 1);
            self.setX(x - xMov);
            self.setY(y + newDD);
        }

        // bottom collide
        if (collide(xLeft, bottomY)) {
            collided = true;
            let newX = xLeft * gameVars.level.size + gameVars.level.size / 2;
            let newY = bottomY * gameVars.level.size;
            let xx = newX - (x - (w / 4));
            let yy = newY - y;
            let angleRad = Math.atan2(yy, xx);
            let angleDeg = angleRad / Math.PI * 180;

            let rotation = angleDeg;
            let xMov = Math.cos(rotation * (Math.PI / 180));
            const newDD = Math.round(yy - 1);
            self.setX(x - xMov);
            self.setY(y + newDD);
        }
        if (collide(xRight, bottomY)) {
            collided = true;
            let newX = xRight * gameVars.level.size + gameVars.level.size / 2;
            let newY = bottomY * gameVars.level.size;
            let xx = newX - (x + (w / 4));
            let yy = newY - y;
            let angleRad = Math.atan2(yy, xx);
            let angleDeg = angleRad / Math.PI * 180;

            let rotation = angleDeg;
            let xMov = Math.cos(rotation * (Math.PI / 180));
            const newDD = Math.round(yy - 1);
            self.setX(x - xMov);
            self.setY(y + newDD);
        }

        //locks
        if (collide(leftX, yBottom) || collide(leftX, yTop)) {
            collided = true;
            self.setX(x + Math.abs(x - (w / 2) - ((leftX + 1) * gameVars.level.size) - 1));
        }
        if (collide(rightX, yBottom) || collide(rightX, yTop)) {
            collided = true;
            self.setX(x - Math.abs(x + (w / 2) - (rightX * gameVars.level.size) + 1));
        }
        if (collide(xLeft, topY) || collide(xRight, topY)) {
            collided = true;
            self.setY(y + Math.abs(y - h - ((topY + 1) * gameVars.level.size) - 1));
        }
        if (collide(xLeft, bottomY) || collide(xRight, bottomY)) {
            collided = true;
            self.setY(y - Math.abs(y - (bottomY * gameVars.level.size) + 1));
        }

        // colliding with borders
        if (x - (w / 2) < 0) {
            collided = true; self.setX(w / 2);
        }
        if (x + (w / 2) > WIDTH) { collided = true; self.setX(WIDTH - w / 2); }
        if (y - h < 0) { collided = true; self.setY(h); }
        if (y > HEIGHT) { collided = true; self.setY(HEIGHT); }
        //if(self.getType() === "enem" && collided && self.getIsDead()) self.setRemove(true);
    }

    function makeEmThink() {
        for (const i in entities) {
            const entity = entities[i];
            if (entity.getType() === 'char') continue;
            if (entity.getIsDead()) continue;

            //make em think
            entity.startThinking();

        }
    }

    function processPunch() {
        for (const i in entities) {
            const entity = entities[i];
            if (entity.getType() === 'char') continue;
            if (entity.getIsDead()) continue;

            let newX = crosshairCord.x;
            let newY = crosshairCord.y;
            let xx = newX - entity.getX();
            let yy = newY - (entity.getY() - entity.getH() / 2);
            let distance = Math.sqrt((xx * xx) + (yy * yy));

            newX = playerX;
            newY = (playerY - playerW / 2);
            xx = newX - entity.getX();
            yy = newY - (entity.getY() - entity.getH() / 2);
            let angleRad = Math.atan2(yy, xx);
            let angleDeg = angleRad / Math.PI * 180;
            let rotation = angleDeg;
            let enemyD = entity.getW() / 2;
            if (distance < (enemyD + crosshairSize / 2)) {
                entity.playHurtFrame();
                entity.setHealth(-Dani.random(punchStrength - 5, punchStrength), true);
                entity.turnHostile();

                let xMov = Math.cos(rotation * (Math.PI / 180));
                let yMov = Math.sin(rotation * (Math.PI / 180));
                gameVars.gui.addScore(scoreEnemyHit);
                if (gameVars.powerups.isStrength())
                    gameVars.audios.audio.playOnce('EnemyHurtHard');
                else
                    gameVars.audios.audio.playOnce('EnemyHurt');

                entity.setX(-xMov * crosshairSize / 4, true);
                entity.setY(-yMov * crosshairSize / 4, true);
            }
        }
    }

    /*function getBlock(val) {
        return Math.floor(val/gameVars.level.size);
    }*/
    function getBlockX(x) {
        return Math.floor(x / gameVars.level.size);
    }
    function getBlockY(y) {
        return Math.floor(y / gameVars.level.size);
    }
    function pointsMatch(p1_X, p2_Y, p3_X, p4_Y) {
        if (arguments.length === 2) {
            return p1_X.x === p2_Y.x && p1_X.y === p2_Y.y;
        } else if (arguments.length === 4) {
            return p1_X === p3_X && p2_Y === p4_Y;
        }
    }
    function collide(x, y) {
        try {
            return (gameVars.level.isBlock(x, y, Tile.wall)) || (gameVars.level.isBlock(x, y, Tile.bedrock));
        } catch {
            return false;
        }
    }
    function touchingWall(x, y) {
        try {
            return gameVars.level.isBlock(x, y, Tile.wall);
        } catch {
            return false;
        }
    }

    return {
        addEntity,
        tick,
        render,
        Length,
        isFreeTile,
        makeEmThink,
        processPunch,
        reset,
        testTouchingTile,
        testTouchingTileAxis,
        testOutBounds,
        testBurriedInTile
    }
}

const Character = function (x, y, w, h, type) {
    x = x || 0;
    y = y || 0;
    w = w || 50;
    h = h || 50;
    type = type || 'char';

    let speed = 7;
    let xDir = 1;

    let hX = 0;
    let hY = 0;
    let hW = 16;
    let hH = 16;

    let weight = Math.floor(score / adjuster);

    let touchingWall = false;

    let barrageClickCount = Dani.lock(5 - weight / 5, 1, 5);
    let barrageClickCounter = barrageClickCount;

    let walkAnim = 4;
    let walking = false;
    let walkCount = 0;
    const walkCounter = 2;

    const punchFrame = 5;
    const hurtFrame = 6;
    const deadFrame = 7;

    let removeCount = 0;
    const removeCounter = 50;

    let canRemove = false;

    function setX(val, increment) {
        if (increment) {
            x += val;
        } else {
            x = val;
        }
    }
    function setY(val, increment) {
        if (increment) {
            y += val;
        } else {
            y = val;
        }
    }
    function getX() {
        return x;
    }
    function getY() {
        return y;
    }
    function getBX() {
        return (Math.floor(x / gameVars.level.size) * gameVars.level.size) + w / 2;
    }
    function getBY() {
        return (Math.floor(y / gameVars.level.size) * gameVars.level.size) + h;
    }
    function getW() {
        return w;
    }
    function getH() {
        return h;
    }
    function setRemove(val) {
        canRemove = val || canRemove;
    }
    function getRemove() {
        return canRemove;
    }
    function setTouchingWall(val) {
        touchingWall = val;
    }
    function getTouchingWall() {
        return touchingWall;
    }
    function getType() {
        return type;
    }
    function getHealth() {
        return health;
    }
    function setHealth(val, increment) {
        if (increment) {
            health += val;
        } else {
            health = val;
        }
        health = Dani.lock(health, 0, maxHealth);
    }
    function getSpeed() {
        return speed;
    }
    function playHurtFrame(val) {
        hX = hurtFrame; //hurt
    }
    function getIsDead() {
        return playerDead;
    }


    function tick() {
        if (!playerDead) {
            if (playerStartled) {
                if (playerStartledCounter >= playerStartledCount) {
                    playerStartledCounter = 0;
                    playerStartled = false;
                } else {
                    playerStartledCounter++;
                }
            } else {
                if (movingUp) {
                    y -= speed;
                }
                if (movingDown) {
                    y += speed;
                }
                if (movingLeft) {
                    x -= speed;
                    // xDir = -1;
                }
                if (movingRight) {
                    x += speed;
                    // xDir = 1;
                }
                if (!movingDown && !movingLeft && !movingRight && !movingUp) {
                    walking = false;
                } else {
                    walking = true;
                }

                playerX = x;
                playerY = y;
                playerBX = (Math.floor((x - 5) / gameVars.level.size) * gameVars.level.size) + w / 2;
                playerBY = (Math.floor((y - 10) / gameVars.level.size) * gameVars.level.size) + h;

                if (crosshairCord.x > playerX) xDir = 1
                else if (crosshairCord.x < playerX) xDir = -1;


                if (xDir === -1) {
                    hY = 1;
                } else {
                    hY = 0;
                }
                if (walking) {
                    crosshairCord = gameVars.aim.getCoords();
                    if (walkCount >= walkCounter) {
                        walkCount = 0;
                        if (hX === 1 || hX === 3)
                            gameVars.audios.audio.playOnce('PlayerStep');
                        hX = Dani.cycle(hX, walkAnim, 1);
                    } else {
                        walkCount++;
                    }
                } else {
                    walkCount = 0;
                    hX = 0;
                }
                if (doingAction) {
                    doingAction = false;
                    hX = punchFrame; //punch
                }
            }
            if (punchBack.length > 0) {
                for (const i in punchBack) {
                    let newX = punchBack[i].x;
                    let newY = punchBack[i].y;
                    let xx = newX - x;
                    let yy = newY - (y - h / 2);
                    let distance = Math.sqrt((xx * xx) + (yy * yy));
                    let angleRad = Math.atan2(yy, xx);
                    let angleDeg = angleRad / Math.PI * 180;
                    let rotation = angleDeg;
                    let enemyFistSize = punchBack[i].r;
                    let playerD = w / 2;
                    if (distance < (enemyFistSize + playerD)) {
                        gameVars.audios.audio.playOnce('PlayerHurt');
                        hX = hurtFrame; //hurt
                        let dmg = punchBack[i].dmg
                        playerHealth -= Dani.random(dmg - 5, dmg);
                        playerHealth = Math.ceil(Dani.lock(playerHealth, 0, playerMaxHealth));
                        playerStartled = true;

                        let xMov = Math.cos(rotation * (Math.PI / 180));
                        let yMov = Math.sin(rotation * (Math.PI / 180));
                        x -= xMov * enemyFistSize / 2;
                        y -= yMov * enemyFistSize / 2;

                        if (playerHealth <= 0) {
                            playerDead = true;
                            gameVars.audios.audio.playOnce('PlayerDeath');
                        }
                    }
                }
                punchBack = [];
            }
            if (gameVars.powerups.isBarrage()) {
                weight = Math.floor(score / adjuster);
                barrageClickCount = Dani.lock(5 - weight / 5, 1, 5);
                if (barrageClickCounter <= 0) {
                    performClick();
                    barrageClickCounter = barrageClickCount;
                } else {
                    barrageClickCounter--;
                }
            }
            if (gameVars.powerups.isStrength()) {
                weight = Math.floor(score / adjuster);
                punchStrength = defaultPunchStrength + defaultPunchStrength * weight / 3 + Dani.random(15);
                wallStrength = defaultWallStrength + defaultPunchStrength * weight / 3 + Dani.random(15);
                barrageClickCount = Dani.lock(5 - weight / 5, 1, 5);
            } else {
                if (punchStrength !== defaultPunchStrength) punchStrength = defaultPunchStrength;
                if (wallStrength !== defaultWallStrength) wallStrength = defaultWallStrength;
            }
        } else {
            if (removeCount >= removeCounter) {
                removeCount = 0;
                canRemove = true;
                canRestart = true;
            } else {
                removeCount++;
            }
            hX = deadFrame; //dead
        }
    }

    function render() {
        if (gameVars.powerups.isStrength()) {
            drawImg('glowStrength', x - w, y - h * 3 / 2, w * 2, h * 2);
        }
        if (gameVars.powerups.isBarrage()) {
            drawImg('glowBarrage', x - w, y - h * 3 / 2, w * 2, h * 2);
        }

        drawImg('player', x - (w / 2), y - h, w, h, hX * hW, hY * hH, hW, hH);
    }
    return {
        render,
        tick,
        getX,
        getY,
        getBX,
        getBY,
        getW,
        getH,
        setX,
        setY,
        getRemove,
        setRemove,
        setTouchingWall,
        getTouchingWall,
        getType,
        getHealth,
        setHealth,
        getSpeed,
        playHurtFrame,
        getIsDead
    }
}

const Enemy = function (x, y, w, h, type) {
    x = x || 0;
    y = y || 0;
    w = w || 50;
    h = h || 50;
    type = type || 'enem';


    let hX = 0;
    let hY = 0;
    let hW = 16;
    let hH = 16;

    const weight = Math.floor(score / adjuster);
    const eStrength = Dani.lock(Dani.random(10 + weight / 5, 15 + weight / 5), 10, 50);
    const eWallStrength = Dani.lock(Dani.random(3 + weight / 4, 8 + weight / 4), 3, 50);
    const eReach = Dani.lock(23 + weight / 10, 23, 30);

    let touchingWall = false;

    let startled = false;
    let startledCount = defaultStartledCount - Dani.lock(weight / 8, 1, defaultStartledCount);
    let startledCounter = 0;

    let punchingChar = false;
    let punchingCharCount = 1;
    let punchingCharCounter = 0;

    let walkAnim = 4;
    let walking = false;
    let walkCount = 0;
    const walkCounter = 2;

    const punchFrame = 5;
    const hurtFrame = 6;
    const deadFrame = 7;

    let attackCount = 0;
    const attackCounter = Dani.lock(12 - weight, 5, 12);
    let wallBreakCount = 0;
    const wallBreakCounter = Dani.lock(10 - weight, 4, 10);

    let removeCount = 0;
    const removeCounter = 50;

    const maxHealth = 50 + Dani.lock(Math.round(weight * 2.5), 0, 450);
    let health = maxHealth;
    let isDead = false;
    let canRemove = false;

    let speed = 4;

    let enemAimCord = { x: 0, y: 0, bX: 0, bY: 0 };
    const enemAimSize = 25;


    function setX(val, increment) {
        if (increment) {
            x += val;
        } else {
            x = val;
        }
    }
    function setY(val, increment) {
        if (increment) {
            y += val;
        } else {
            y = val;
        }
    }
    function getX() {
        return x;
    }
    function getY() {
        return y;
    }
    function getBX() {
        return (Math.floor(x / gameVars.level.size) * gameVars.level.size) + w / 2;
    }
    function getBY() {
        return (Math.floor(y / gameVars.level.size) * gameVars.level.size) + h;
    }
    function getW() {
        return w;
    }
    function getH() {
        return h;
    }
    function setRemove(val) {
        canRemove = val || canRemove;
    }
    function getRemove() {
        return canRemove;
    }
    function setTouchingWall(val) {
        touchingWall = val;
    }
    function getTouchingWall() {
        return touchingWall;
    }
    function getType() {
        return type;
    }
    function getHealth() {
        return health;
    }
    function setHealth(val, increment) {
        if (increment) {
            health += val;
        } else {
            health = val;
        }
        health = Dani.lock(health, 0, maxHealth);
    }
    function getSpeed() {
        return speed;
    }
    function playHurtFrame(val) {
        hX = hurtFrame; //hurt
    }
    function getIsDead() {
        return isDead;
    }
    function turnHostile() {
        followingPlayer = true;
        startled = true;
        targetMet = true;
    }
    function startThinking() {
        targetMet = true;
    }

    let xMove = 0;
    let yMove = 0;
    let blX = 0;
    let blY = 0;
    let followingPlayer = false;
    let xDir = 1;

    let nextMoves;
    let nextMove;
    let targetMet = true;

    function getAimCord(targetX, targetY, enemX, enemY, enemW, enemH) {
        let newX = targetX;
        let newY = targetY - playerW / 2;
        let xx = newX - enemX;
        let yy = newY - (enemY - enemW / 2);
        let angleRad = Math.atan2(yy, xx);
        let angleDeg = angleRad / Math.PI * 180;
        let rotation = angleDeg;

        let distance = Math.sqrt((xx * xx) + (yy * yy));
        range = distance > eReach ? eReach : distance;

        let xMov = Math.cos(rotation * (Math.PI / 180));
        let yMov = Math.sin(rotation * (Math.PI / 180));
        const x = enemX + xMov * range;
        const y = (enemY - playerW / 2) + yMov * range;

        const bX = (Math.floor(x / gameVars.level.size) * gameVars.level.size);
        const bY = (Math.floor(y / gameVars.level.size) * gameVars.level.size);

        enemAimCord = { x: x, y: y, bX: bX, bY: bY };
    }
    function tick() {
        if (!isDead) {
            if (health <= 0) {
                isDead = true;
                gameVars.gui.addScore(scoreEnemyDead);
                gameVars.audios.audio.playOnce('EnemyDeath');
                return;
            }

            if (startled) {
                if (startledCounter >= startledCount) {
                    startledCounter = 0;
                    startled = false;
                } else {
                    startledCounter++;
                }
            } else if (punchingChar) {
                if (punchingCharCounter >= punchingCharCount) {
                    punchingCharCounter = 0;
                    punchingChar = false;
                } else {
                    punchingCharCounter++;
                }
            } else {
                if (followingPlayer) {
                    blX = (Math.floor((x - 5) / gameVars.level.size) * gameVars.level.size) + w / 2;
                    blY = (Math.floor((y - 10) / gameVars.level.size) * gameVars.level.size) + h;
                    const playersX = Math.floor(playerBX / gameVars.level.size);
                    const playersY = Math.floor(playerBY / gameVars.level.size);
                    const blockX = Math.floor(blX / gameVars.level.size);
                    const blockY = Math.floor(blY / gameVars.level.size);
                    nextMoves = gameVars.level.findPath({ x: blockX, y: blockY }, { x: playersX, y: playersY }, [Tile.floor]);
                    if (nextMoves.length === 0) nextMoves = gameVars.level.findPath({ x: blockX, y: blockY }, { x: playersX, y: playersY }, [Tile.floor, Tile.wall]);
                    if (nextMoves.length === 0) { //chase
                        if (!nearChar()) {
                            targetMet = true;
                            followingPlayer = false;
                        } else {
                            let newX = playerX;
                            let newY = playerY;
                            let xx = newX - x;
                            let yy = newY - y;
                            let angleRad = Math.atan2(yy, xx);
                            let angleDeg = angleRad / Math.PI * 180;

                            let distance = Math.sqrt((xx * xx) + (yy * yy));

                            let rotation = angleDeg;
                            if (distance > speed) {
                                walking = true;
                                let xMov = Math.cos(rotation * (Math.PI / 180));
                                let yMov = Math.sin(rotation * (Math.PI / 180));
                                x += xMov * speed;
                                y += yMov * speed;
                                if (xMov > 0) xDir = 1;
                                else if (xMov < 0) xDir = -1;
                            } else {
                                walking = false;
                            }
                            getAimCord(newX, newY, x, y, w, h);
                        }
                    } else { //pathfing
                        walking = true;

                        if (targetMet) {
                            nextMove = nextMoves[1];
                            targetMet = false;
                        }

                        let newX = nextMove.x * gameVars.level.size + w / 2;
                        let newY = nextMove.y * gameVars.level.size + h;
                        let xx = newX - x;
                        let yy = newY - y;
                        let angleRad = Math.atan2(yy, xx);
                        let angleDeg = angleRad / Math.PI * 180;
                        let distance = Math.sqrt((xx * xx) + (yy * yy));

                        let rotation = angleDeg;
                        let xMov = Math.cos(rotation * (Math.PI / 180));
                        let yMov = Math.sin(rotation * (Math.PI / 180));
                        x += xMov * speed;
                        y += yMov * speed;

                        if (xMov > 0) xDir = 1;
                        else if (xMov < 0) xDir = -1;

                        if (distance < speed) {
                            targetMet = true;
                        }
                        getAimCord(newX, newY + h / 2, x, y, w, h);
                    }

                    touchingWall = gameVars.entities.testTouchingTile(x, y, w, h, [Tile.wall]);
                    if (touchingWall) {
                        if (wallBreakCount >= wallBreakCounter) {
                            wallBreakCount = 0;

                            gameVars.checker.punchWall(enemAimCord.bX, enemAimCord.bY, Dani.random(eWallStrength - 2, eWallStrength), 'enemy');
                            hX = punchFrame;
                            punchingChar = true;
                        } else {
                            wallBreakCount++;
                        }
                        touchingWall = false;
                    }

                    if (Dani.random(100) > 99) {
                        targetMet = true;
                        followingPlayer = false;
                    }


                    if (!playerDead && nearChar()) {
                        if (attackCount >= attackCounter) {
                            attackCount = 0;
                            hX = punchFrame; //punch
                            punchingChar = true;
                            punchBack.push({ x: enemAimCord.x, y: enemAimCord.y, r: enemAimSize / 2, dmg: eStrength });
                        } else {
                            attackCount++;
                        }
                    }
                } else { //idle
                    x += xMove * speed;
                    y += yMove * speed;
                    touchingWall = gameVars.entities.testTouchingTile(x, y, w, h, [Tile.wall, Tile.bedrock]) || gameVars.entities.testOutBounds(x, y, w, h);
                    if (touchingWall) {
                        const touchTileAxis = gameVars.entities.testTouchingTileAxis(x, y, w, h, [Tile.wall, Tile.bedrock]);
                        if (touchTileAxis.x) xMove = 0;
                        if (touchTileAxis.y) yMove = 0;
                    } else {
                        if (Dani.random(100) > 96) xMove = parseInt(Dani.random([-1, 1], 1));
                        if (Dani.random(100) > 96) yMove = parseInt(Dani.random([-1, 1], 1));
                    }
                    if (xMove === 1 || xMove === -1) {
                        xDir = xMove;
                    }
                    if (xMove === 0 && yMove === 0) {
                        walking = false;
                    } else {
                        walking = true;
                    }
                    getAimCord(playerX, playerY, x, y, w, h);

                    if (Dani.random(100) > 96) {
                        followingPlayer = true;
                    }
                }

                if (xDir === -1) {
                    hY = 1;
                } else {
                    hY = 0;
                }

                if (walking) {
                    if (walkCount >= walkCounter) {
                        walkCount = 0;
                        hX = Dani.cycle(hX, walkAnim, 1);
                    } else {
                        walkCount++;
                    }
                } else {
                    walkCount = 0;
                    hX = 0;
                }

            }

        } else {
            if (gameVars.entities.testTouchingTile(x, y, w / 2, h / 2, [Tile.wall, Tile.bedrock])) canRemove = true;
            if (removeCount >= removeCounter) {
                removeCount = 0;
                canRemove = true;
            } else {
                removeCount++;
            }
            hX = deadFrame; //dead
        }
    }

    function render() {
        // for(let i in nextMoves)
        //     draw('enemm', nextMoves[i].x * gameVars.level.size + w/2, nextMoves[i].y * gameVars.level.size + h, w, h);
        drawImg('enemy', x - (w / 2), y - h, w, h, hX * hW, hY * hH, hW, hH);
        if (followingPlayer && !isDead)
            drawImg('enemAim', enemAimCord.x - gameVars.level.size / 2, enemAimCord.y - gameVars.level.size / 2, gameVars.level.size, gameVars.level.size);

        //drawImg('buildOptions', bX, bY, gameVars.level.size, gameVars.level.size);
        /*drawImg('buildOptions', enemAimCord.bX, enemAimCord.bY, gameVars.level.size, gameVars.level.size);*/
    }

    function nearChar() {
        let newX = playerX;
        let newY = playerY - playerH / 2;
        let xx = newX - enemAimCord.x;
        let yy = newY - (enemAimCord.y);
        let distance = Math.sqrt((xx * xx) + (yy * yy));

        let enemyD = enemAimSize / 2;
        if (distance < (enemyD + playerW / 2)) {
            return true
        }
        return false;
    }

    return {
        render,
        tick,
        getX,
        getY,
        getBX,
        getBY,
        getW,
        getH,
        setX,
        setY,
        getRemove,
        setRemove,
        setTouchingWall,
        getTouchingWall,
        getType,
        getHealth,
        setHealth,
        getSpeed,
        playHurtFrame,
        getIsDead,
        turnHostile,
        startThinking
    }
}

const Font = function (pathRef) {
    let path = pathRef ? pathRef : "PixelFont/font_";

    let fontChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'colon', 'equals', 'period', 'comma', 'exclamationPoint', 'questionMark', 'space', 'slash', 'addition', 'subtraction'];
    let fonts = {};

    function getChar(char) {
        char = char.toLowerCase();
        if (char.match(/[0-9a-z]/i)) {
            return char;
        } else {
            if (char === " ") return 'space';
            if (char === ":") return 'colon';
            if (char === "=") return 'equals';
            if (char === ".") return 'period';
            if (char === ",") return 'comma';
            if (char === "!") return 'exclamationPoint';
            if (char === "?") return 'questionMark';
            if (char === "/") return 'slash';
            if (char === "+") return 'addition';
            if (char === "-") return 'subtraction';
        }
        return '';
    }

    let preloadimages = async function () {
        let texxture;
        for (let i in fontChars) {
            texxture = fontChars[i];
            fonts[texxture] = new Image();
            fonts[texxture].onerror = async function () {
                let textyure = this.src.split(path)[1].split('.')[0];

                this.onerror = async function () {
                    for (let j = 0; j < fontChars.length; j++) {
                        if (fontChars[j] === textyure) {
                            fontChars.splice(j, 1);
                            j--;
                        }
                    }
                }
                this.src = await path + textyure + ".jpg";
            }
            fonts[texxture].src = await path + texxture + ".png";
        }

    }
    preloadimages();

    return {
        fonts: fonts,
        getChar
    }
}

const Audios = function () {
    const audio = new GameAudio();

    async function loadAudios() {
        audio.setDefaults({ source: '/games/BobTheBrawler/audios', type: 'wav' });
        await audio.create('GameMusic', 'EnemyDeath', 'EnemyHurt', 'EnemyHurtHard', 'WallPlace', 'WallHurt', 'WallDeath', 'HealthPickup', 'HealthUse', 'PlayerDeath', 'PlayerHurt', 'PlayerSwing', 'HealthNull', 'PackagePickup', 'PackageDrop', 'PlayerStep', 'PackageDeath', 'PowerupPickup', 'PowerupDeath');
        audio.setVolume('GameMusic', defaultGameMusicVolume);
        audio.setVolume('HealthUse', 60);
        audio.setVolume('HealthPickup', 60);
        audio.setVolume('HealthNull', 60);
        audio.setVolume('WallPlace', 50);
        audio.setVolume('WallHurt', 50);
        audio.setVolume('WallDeath', 50);
        audio.setVolume('EnemyHurt', 60);
        audio.setVolume('EnemyHurtHard', 60);
        audio.setVolume('EnemyDeath', 60);
        audio.setVolume('PlayerHurt', 60);
        audio.setVolume('PlayerDeath', 60);
        audio.setVolume('PlayerSwing', 55);
        audio.setVolume('PackageDrop', 60);
        audio.setVolume('PackagePickup', 60);
        audio.setVolume('PackageDeath', 60);
        audio.setVolume('PowerupPickup', 90);
        audio.setVolume('PowerupDeath', 90);
    }

    loadAudios();

    return {
        audio
    }
}

const Texture = function (pathRef) {

    let textureList = ["player", "wall", "floor", "bedrock", "blockDamage", "enemy", "health", "potion", "package", "GUIPanel", "pauseScreen", "playScreen", "deathScreen", "crosshair", "buildOptions", "mousePos", "packageTime", "powerupTime", "enemAim", "powerupBarrage", "powerupStrength", "glowBarrage", "glowStrength", "blackDropSmall"];
    let textures = {};

    let path = pathRef ? pathRef : "textures/";

    let preloadimages = async function () {
        let texxture;
        for (let i in textureList) {
            texxture = textureList[i];
            textures[texxture] = new Image();
            textures[texxture].onerror = async function () {
                let textyure = this.src.split(path)[1].split('.')[0];

                this.onerror = async function () {
                    for (let j = 0; j < textureList.length; j++) {
                        if (textureList[j] === textyure) {
                            textureList.splice(j, 1);
                            j--;
                        }
                    }
                }
                this.src = await path + textyure + ".jpg";
            }
            textures[texxture].src = await path + texxture + ".png";
        }

    }
    preloadimages();

    return {
        textures: textures
    }
}

function drawImg(obj, x, y, w, h, dx, dy, dw, dh) {
    const width = panel.canvasWidth();
    const scale = width / WIDTH;
    dx = dx || 0;
    dy = dy || 0;
    dw = dw || gameVars.texture.textures[obj].width;
    dh = dh || gameVars.texture.textures[obj].height;

    x *= scale;
    y *= scale;
    w *= scale;
    h *= scale;

    screen.drawImage(gameVars.texture.textures[obj], dx, dy, dw, dh, x, y, w, h); // parseInt(w), parseInt(h));
}

function drawTxt(string, x, y, h, dx, dy, dw, dh) {
    const width = panel.canvasWidth();
    const scale = width / WIDTH;
    dx = dx || 0;
    dy = dy || 0;
    dw = dw || gameVars.font.fonts['a'].width;
    dh = dh || gameVars.font.fonts['a'].height;

    let dist = 3;
    h = h || 10; //parseInt(h) || 10;

    let w = h / 2;
    x *= scale;
    y *= scale;
    w *= scale;
    h *= scale;
    dist *= scale;

    dist += w;

    let char;
    let j = 0;
    for (let i in string) {
        char = gameVars.font.getChar(string[i]);
        if (char === '') continue;
        screen.drawImage(gameVars.font.fonts[char], dx, dy, dw, dh, x + (j * dist), y, w, h); // parseInt(w), parseInt(h));
        j++;
    }
}

const Tile = {
    floor: 'floor',
    wall: 'wall',
    bedrock: 'bedrock'
}

function Level(w, h) {
    w = w || 10;
    h = h || 10;
    const blockMaxHealth = 100;
    const blockDamageFrames = 5;
    this.size = 50;
    this.block = [];
    const clearMap = () => {
        for (let x = 0; x < w; x++) {
            this.block[x] = [];
            for (let y = 0; y < h; y++) {
                this.block[x][y] = { id: Tile.floor, health: blockMaxHealth };
            }
        }
        for (let x = 0; x < w; x++) {
            const y = 8;
            this.block[x][y].id = Tile.bedrock;
        }
    }

    const maps = [
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 0, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 0, 1, 1, 0]
        ],
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    ]

    const generateMap = () => {
        clearMap();
        const theMap = Dani.random(maps, 1);
        for (let y = 0; y < theMap.length; y++) {
            for (let x = 0; x < theMap[y].length; x++) {
                if (theMap[y][x] === 0)
                    this.block[x][y].id = Tile.floor;
                else if (theMap[y][x] === 1)
                    this.block[x][y].id = Tile.wall;
            }
        }
        const i = Dani.random(1);
        const j = Dani.random(1);
        for (let x = 0; x < w; x++)
            for (let y = 0; y < h; y++) {
                if ((x - i) % 2 === 0 && (y - j) % 2 === 0 && Dani.random(10) > 7)
                    this.block[x][y].id = Tile.bedrock;
            }

        //clearing char tiles
        this.block[4][3].id = Tile.floor;
        this.block[5][3].id = Tile.floor;
        this.block[4][4].id = Tile.floor;
        this.block[5][4].id = Tile.floor;
    }

    this.reset = function () {
        generateMap();
    }

    this.tick = function () {
    }
    this.render = function () {
        let id, i = 0;
        for (let x = 0; x < w; x++)
            for (let y = 0; y < h; y++) {
                i++;
                id = this.block[x][y].id
                if (id === Tile.floor) {
                    const dX = i % 12 === 0 ? 1 : i % 2 === 0 ? 2 : 0;
                    drawImg(id, x * this.size, y * this.size, this.size, this.size, dX * 16, 0, 16, 16);
                } else {
                    drawImg(id, x * this.size, y * this.size, this.size, this.size, 0, 0, 16, 16);
                }

                const dmgAnim = Math.floor(this.block[x][y].health / blockMaxHealth * blockDamageFrames);
                drawImg('blockDamage', x * this.size, y * this.size, this.size, this.size, dmgAnim * 16, 0, 16, 16);
            }
    }
    this.findPath = function (startPos, endPos, passables) {
        const block = this.block;
        const map = {};
        for (let x = 0; x < w; x++) {
            map[x] = [];
            for (let y = 0; y < h; y++) {
                map[x][y] = { taken: false, num: 0, roots: [] };
            }
        }

        function spreadPath(id, x, y) {
            try {
                // if(!map[x][y].taken && block[x][y].id !== Tile.wall) {
                map[x][y].taken = true;
                map[x][y].num = id;
                if (map[x][y].roots.length === 0) map[x][y].roots = [{ x, y }];
                attemptSpread(id, x + 1, y, Dani.cloneObject(map[x][y].roots));
                attemptSpread(id, x, y + 1, Dani.cloneObject(map[x][y].roots));
                attemptSpread(id, x - 1, y, Dani.cloneObject(map[x][y].roots));
                attemptSpread(id, x, y - 1, Dani.cloneObject(map[x][y].roots));
                // }
            } catch (e) {
                // console.warn(e.message, x, y)
            }
        }
        const spreadsLeft = [];
        function attemptSpread(id, x, y, roots) {
            try {
                for (let i in passables)
                    if (!map[x][y].taken && block[x][y].id === passables[i] && !pathFound) {
                        map[x][y].taken = true;
                        map[x][y].num = id + 1;
                        map[x][y].roots = roots;
                        map[x][y].roots.push({ x, y });
                        if (x === endPos.x && y === endPos.y) {
                            pathFound = true;
                            properPath = map[x][y].roots;
                            return;
                        }
                        spreadsLeft.push({ id, x, y });
                    }
            } catch (e) {
                // console.warn(e.message, x, y)
            }
        }
        let pathFound = false;
        let properPath = [];

        spreadPath(0, startPos.x, startPos.y);
        for (let i = 0; i < spreadsLeft.length; i++) {
            if (pathFound) break;
            spreadPath(i + 1, spreadsLeft[i].x, spreadsLeft[i].y);
            if (spreadsLeft[i].x === endPos.x && spreadsLeft[i].y === endPos.y) {
                //pathFound = true;
                break;
            }
        }
        return properPath;
    }

    this.isBlock = function (x, y, id) {
        try {
            return this.block[x][y].id === id;
        } catch {
            return false;
        }
    }

    this.setBlock = function (x, y, id) {
        try {
            this.block[x][y].id = id;
            this.block[x][y].health = blockMaxHealth;
        } catch { }
    }

    this.getBlock = function (x, y) {
        try {
            return this.block[x][y].id;
        } catch {
            return null;
        }
    }

    this.hitBlock = function (x, y, damage, target) {
        try {
            if (this.block[x][y].id !== Tile.wall) return;
            gameVars.audios.audio.playOnce('WallHurt');
            this.block[x][y].health -= damage;
            this.block[x][y].health = Dani.lock(this.block[x][y].health, 0, blockMaxHealth);
            if (this.block[x][y].health === 0) {
                this.setBlock(x, y, Tile.floor);
                gameVars.audios.audio.playOnce('WallDeath');
                if (target === 'player') {
                    gameVars.gui.addWall(1);
                }
                gameVars.entities.makeEmThink();
            }
        } catch { }
    }



    generateMap();
}

function Spawner() {
    const lowestEnems = 8;
    let maxEntities = 1 + lowestEnems;
    let weight = Math.floor(score / adjuster);
    let spawnTimer = Dani.random(25, 50) - weight / 2;
    let spawnTime = 0;
    const spawn = function () {
        if (gameVars.entities.Length() < maxEntities) {
            for (i = 0; i < spawnDropTries; i++) {
                const x = Dani.random(lW);
                const y = Dani.random(lH - 1);
                if (gameVars.entities.isFreeTile(x, y) && gameVars.level.isBlock(x, y, Tile.floor)) {
                    const xx = x * gameVars.level.size + playerW / 2;
                    const yy = y * gameVars.level.size + playerH;
                    gameVars.entities.addEntity('enem', xx, yy);
                    break;
                }
            }
        }
    }
    function tick() {
        if (spawnTime >= spawnTimer) {
            weight = Math.floor(score / adjuster);
            maxEntities = 1 + lowestEnems + Dani.lock(Math.floor(weight / 3), 0, 11);
            spawnTimer = Dani.lock(Dani.random(25, 50) - weight / 3, 15, 50);

            spawnTime = 0;
            spawn();
        } else {
            spawnTime++;
        }
    }
    return {
        tick
    }
}

function Checker() {
    function usePotion() {
        if (potions > 0 && playerHealth < playerMaxHealth) {
            playerHealth += 10 + Dani.lock(Math.floor(score / adjuster), 0, 100);
            playerHealth = Dani.lock(playerHealth, 0, playerMaxHealth);
            gameVars.gui.removePotion();
            gameVars.audios.audio.playOnce('HealthUse');
        } else {
            gameVars.audios.audio.playOnce('HealthNull');
        }
    }
    function placeWall() {
        if (walls > 0) {
            const pX = Math.floor((crosshairCord.bX) / gameVars.level.size);
            const pY = Math.floor((crosshairCord.bY) / gameVars.level.size);
            try {
                if (gameVars.entities.isFreeTile(pX, pY) && gameVars.level.isBlock(pX, pY, Tile.floor)) {
                    gameVars.audios.audio.playOnce('WallPlace');
                    gameVars.level.setBlock(pX, pY, Tile.wall);
                    gameVars.gui.removeWall();
                }
            } catch (e) { console.warn(e.message) }
        }
    }

    function punchWall(bX, bY, strength, target) {
        const pX = Math.floor((bX) / gameVars.level.size);
        const pY = Math.floor((bY) / gameVars.level.size);
        try {
            if (gameVars.level.isBlock(pX, pY, Tile.wall)) {
                gameVars.level.hitBlock(pX, pY, strength, target);
            }
        } catch (e) { console.warn(e.message) }
    }

    function tick() {
        if (canUsePotion) {
            usePotion();
            canUsePotion = false;
        }

        if (rightClicked) {
            placeWall();
        }
    }
    return {
        tick,
        punchWall,
        placeWall
    }
}

function Drops() {
    const size = 50;
    const items = [];
    const ticker = 50;

    let weight = Math.floor(score / adjuster);
    let dropTimer = 250 - weight * 10;
    let dropTime = 0;

    const drop = function (name, x, y, timeLeft) {
        items.push({ name, x, y, time: timeLeft || ticker, ticker: timeLeft || ticker });
    }

    const reset = function () {
        while (items.length) {
            items.pop();
        }
    }

    const dropItem = function (x, y) {
        weight = Math.floor((score / adjuster) / 4);
        const rand = Dani.random(100);
        if (rand >= 75 - Dani.lock(weight, 0, 5))       //rand of 75 to 70
            drop('package', x, y, 150);
        else if (rand >= 40 - Dani.lock(weight, 0, 5)) //rand of 40 to 35
            drop(Dani.random(['powerupBarrage', 'powerupStrength'], 1), x, y, 200);
        else
            drop('potion', x, y, 100);
    }
    const dropSomethingDown = function () {
        if (Dani.random(100) > 25) {
            for (i = 0; i < spawnDropTries; i++) {
                const xx = Dani.random(lW);
                const yy = Dani.random(lH - 1);
                if (gameVars.entities.isFreeTile(xx, yy) && gameVars.level.isBlock(xx, yy, Tile.floor)) {
                    gameVars.audios.audio.playOnce('PackageDrop');
                    const x = xx * gameVars.level.size + size / 2;
                    const y = yy * gameVars.level.size + size;
                    dropItem(x, y);
                    break;
                }
            }
        }
    }
    function tick() {
        if (dropTime >= dropTimer) {
            weight = Math.floor(score / adjuster);
            dropTimer = Dani.random(225, 250) - Dani.lock(weight, 0, 125);

            dropTime = 0;
            dropSomethingDown();
        } else {
            dropTime++;
        }
        for (const i in items) {
            const item = items[i];
            if (!item.ticker) item.ticker = item.time;
            else (item.ticker--);
            if (item.ticker <= 0) {
                gameVars.audios.audio.playOnce('PackageDeath');
                items.splice(parseInt(i), 1);
            }
            if (gameVars.entities.testBurriedInTile(item.x, item.y, size / 2, size / 2, [Tile.wall, Tile.bedrock])) {
                items.splice(parseInt(i), 1);
            }

        }
        checkToPickupItem();
    }
    function render() {
        for (const i in items) {
            const item = items[i];
            drawImg(item.name, item.x - (size / 2), item.y - (size), size, size);
            drawImg('packageTime', item.x - (size / 2), item.y - (size * 3 / 4), size, size / 4, 0, 0, 16, 4); //background itself
            drawImg('packageTime', item.x - (size / 2), item.y - (size * 3 / 4), size / item.time * item.ticker, size / 4, 0, 4, 16 / item.time * item.ticker, 4); //timer itself
        }
    }

    function checkToPickupItem(usingMouse) {
        if (playerDead) return;
        weight = Math.floor(score / adjuster);
        for (const i in items) {
            const item = items[i];
            if (nearChar(item.x, item.y, size, size, usingMouse)) {
                if (item.name === 'potion') {
                    gameVars.audios.audio.playOnce('HealthPickup');
                    gameVars.gui.addPotion(1);
                    gameVars.gui.upMaxHealth(Dani.random(1, 5));
                    gameVars.gui.addScore(scorePotionPickup);
                } else if (item.name === 'package') {
                    gameVars.audios.audio.playOnce('PackagePickup');
                    gameVars.gui.addWall(Dani.random(3, 8));
                    gameVars.gui.addPotion(Dani.random(1, 3));
                    gameVars.gui.upMaxHealth(Dani.random(10, 50));
                    gameVars.gui.addScore(scorePackagePickup);
                } else if (item.name === 'powerupBarrage') {
                    gameVars.audios.audio.playOnce('PowerupPickup');
                    gameVars.powerups.addPowerUp('barrage', 100 + Dani.lock(Dani.random(weight * 10), 0, 150));
                    gameVars.gui.addScore(scorePowerUpPickup);
                } else if (item.name === 'powerupStrength') {
                    gameVars.audios.audio.playOnce('PowerupPickup');
                    gameVars.powerups.addPowerUp('strength', 150 + Dani.lock(Dani.random(weight * 8), 0, 120));
                    gameVars.gui.addScore(scorePowerUpPickup);
                }
                items.splice(parseInt(i), 1); //to remove the item (put inside separate if statements if you dont want to remove all instantly in the future)
            }
        }
    }

    function nearChar(x, y, w, h, usingMouse) {
        if (usingMouse) {
            let newX = crosshairCord.x;
            let newY = crosshairCord.y;
            let xx = newX - x;
            let yy = newY - (y - h / 2);
            let distance = Math.sqrt((xx * xx) + (yy * yy));

            let thisD = w / 3;
            if (distance < (thisD + crosshairSize / 2)) {
                return true
            }
        } else {
            let newX = playerX;
            let newY = playerY - (playerW / 2);
            let xx = newX - x;
            let yy = newY - (y - h / 2);
            let distance = Math.sqrt((xx * xx) + (yy * yy));

            let thisD = w / 3;
            if (distance < (thisD + playerW / 2)) {
                return true
            }
        }
        return false;
    }

    return {
        drop,
        tick,
        render,
        reset,
        checkToPickupItem
    }
}

function GUI() {
    const size = gameVars.level.size;
    function addScore(val) {
        const weight = Math.floor(score / adjuster);
        score += Math.round(val + val * weight / 5) || Math.round(1 + weight / 5);
        score = Dani.lock(score, 0, 9999999);
    }
    function removeScore(val) {
        score -= val || 1;
        score = Dani.lock(score, 0, 9999999);
    }

    function addPotion(val) {
        potions += val || 1;
        potions = Dani.lock(potions, 0, 99);
    }
    function removePotion(val) {
        potions -= val || 1;
        potions = Dani.lock(potions, 0, 99);
    }

    function addWall(val) {
        walls += val || 1;
        walls = Dani.lock(walls, 0, 99);
    }
    function removeWall(val) {
        walls -= val || 1;
        walls = Dani.lock(walls, 0, 99);
    }
    function upMaxHealth(val) {
        const healthRatio = playerHealth / playerMaxHealth;
        playerMaxHealth += val || 10;
        playerMaxHealth = Dani.lock(playerMaxHealth, 0, 999);
        playerHealth = Dani.lock(Math.floor(playerMaxHealth * healthRatio), 0, 999);
    }

    function render() {

        //guipanel
        drawImg('GUIPanel', 0, 400, 500, 50); //health border

        //player health
        drawImg('health', 16, 415.5, 100 / playerMaxHealth * playerHealth, 25, 0, 0, 32 / playerMaxHealth * playerHealth, 8); //health itself
        drawTxt(`${playerHealth}/${Math.ceil(playerMaxHealth)}`, 20, 415, 19);

        //potion gui
        drawTxt(`${potions}`, 158, 415, 19);

        //wall gui
        drawTxt(`${walls}`, 275, 415, 19);

        //score gui
        drawTxt(`${score}`, 393, 415, 19);
    }
    return {
        addScore,
        removeScore,
        addPotion,
        removePotion,
        addWall,
        removeWall,
        upMaxHealth,
        render
    }
}

function PowerUps() {
    const timed = powerUpDuration;
    let powerUps = {
        strength: { timer: 0, active: false, hY: 1 },
        barrage: { timer: 0, active: false, hY: 2 }
    }
    const addPowerUp = function (name, time) {
        powerUps[name].timer = time || timed;
        powerUps[name].active = true;
    }
    const tick = function () {
        for (const i in powerUps) {
            if (powerUps[i].timer > 0) {
                if (!powerUps[i].active) powerUps[i].active = true;
                powerUps[i].timer--;
            } else {
                if (powerUps[i].active) {
                    gameVars.audios.audio.playOnce('PowerupDeath');
                    powerUps[i].active = false;
                }
            }
        }
    }
    const txtH = 19;
    const barH = 12.5;
    const yOffSet = barH * 3;
    const powerImgW = 21;
    const powerImgH = 4;
    const powerWidth = 65.625; //21/160*500
    const render = function () {
        let j = 0;
        screen.globalAlpha = (playerBX < 125 && playerBY < 125) ? 0.5 : 0.8;
        for (const i in powerUps) {
            if (powerUps[i].active) {
                drawImg('blackDropSmall', 6.25, 6.25 + j * (txtH + yOffSet), 125, 46.875); //blackdrop itself

                drawTxt(`${i}+`, 12.5, 12.5 + (j * (txtH + yOffSet)), txtH);
                drawImg('powerupTime', 12.5, 15.65 + (j * (txtH + yOffSet)) + txtH, powerWidth, barH, 0, 0, powerImgW, powerImgH); //background itself
                drawImg('powerupTime', 12.5, 15.65 + (j * (txtH + yOffSet)) + txtH, powerWidth / timed * powerUps[i].timer, barH, 0, powerUps[i].hY * powerImgH, powerImgW / timed * powerUps[i].timer, powerImgH); //timer itself
                j++;
            }
        }
        screen.globalAlpha = 1;
    }
    function isBarrage() {
        return powerUps['barrage'].active;
    }
    function isStrength() {
        return powerUps['strength'].active;
    }


    const reset = function () {
        powerUps = {
            strength: { timer: 0, active: false, hY: 1 },
            barrage: { timer: 0, active: false, hY: 2 }
        }
    }

    return {
        tick,
        render,
        addPowerUp,
        isBarrage,
        isStrength,
        reset
    }
}

function performClick(mouseDidIt) {
    if (mouseDidIt && gameVars.powerups.isBarrage()) return;
    if (playerStartled) return;
    gameVars.audios.audio.playOnce('PlayerSwing');
    gameVars.entities.processPunch();
    gameVars.checker.punchWall(crosshairCord.bX, crosshairCord.bY, Dani.random(wallStrength - 5, wallStrength), 'player');
    gameVars.drops.checkToPickupItem(true);
    doingAction = true;
}

async function main() {

    gameVars.texture = await new Texture('/games/BobTheBrawler/textures/');
    gameVars.font = await new Font('/games/BobTheBrawler/PixelFont/font_');

    gameVars.level = new Level(lW, lH);
    gameVars.checker = new Checker();

    gameVars.entities = new Entity();
    gameVars.entities.addEntity('char', 250, 225);

    gameVars.powerups = new PowerUps();

    gameVars.spawner = new Spawner();
    gameVars.drops = new Drops();

    gameVars.aim = new Aim();
    gameVars.gui = new GUI();

    gameVars.audios = await new Audios();

    setInterval(run, 50);
}

const resetGame = function () {
    //reset let variables
    PAUSED = false;
    musicStopped = false;

    playerMaxHealth = defaultPlayerMaxHealth;
    playerHealth = playerMaxHealth;
    playerX = 0;
    playerY = 0;
    playerBX = 0;
    playerBY = 0;
    playerDead = false;
    canRestart = false;
    punchStrength = defaultPunchStrength;
    wallStrength = defaultWallStrength;
    playerReach = defaultPlayerReach;
    playerStartled = false;
    playerStartledCount = defaultStartledCount;
    playerStartledCounter = 0;

    movingLeft = false;
    movingRight = false;
    movingUp = false;
    movingDown = false;
    doingAction = false;
    crosshairCord = { x: 0, y: 0 };
    punchBack = [];

    score = 0;
    potions = 0;
    walls = 0;

    canPunch = false;
    canUsePotion = false;

    //reset entities
    gameVars.entities.reset();
    gameVars.entities.addEntity('char', 250, 225);

    //reset drops
    gameVars.drops.reset();

    //reset level
    gameVars.level.reset();

    //reset powerup
    gameVars.powerups.reset();

    gameVars.audios.audio.restart('GameMusic');
    gameVars.audios.audio.setLoop('GameMusic', true);
    gameVars.audios.audio.setVolume('GameMusic', defaultGameMusicVolume);
}

function tick() {
    gameVars.spawner.tick();
    gameVars.level.tick();
    gameVars.drops.tick();
    gameVars.entities.tick();
    gameVars.aim.tick();
    gameVars.checker.tick();
    gameVars.powerups.tick();
}

function render() {

    screen.mozImageSmoothingEnabled = false;
    screen.webkitImageSmoothingEnabled = false;
    screen.msImageSmoothingEnabled = false;
    screen.imageSmoothingEnabled = false;

    panel.clear();

    gameVars.level.render();
    gameVars.drops.render();
    gameVars.entities.render();
    gameVars.aim.render();
    gameVars.powerups.render();
    gameVars.gui.render();
}

function run() {
    if (!init) {
        if (!PAUSED && !canRestart) {
            tick();
            if (musicStopped) musicStopped = false;
        }
        render();
        if (PAUSED) {
            drawImg('pauseScreen', 50, 125, 400, 200);
        } else if (playerDead && canRestart) {
            drawImg('deathScreen', 50, 125, 400, 200);
            if (!musicStopped) {
                gameVars.audios.audio.setVolume('GameMusic', defaultGameMusicVolume * 2 / 3);
                gameVars.audios.audio.setLoop('GameMusic', false);
                musicStopped = true;
            }
        }
    } else {
        drawImg('playScreen', 0, 0, 500, 450);
    }
    //cursor pos
    drawImg('mousePos', mouseCords.x - gameVars.level.size / 2, mouseCords.y - gameVars.level.size / 2, gameVars.level.size, gameVars.level.size);
}

function clickedOutScreen() {
    movingLeft = false;
    movingRight = false;
    movingUp = false;
    movingDown = false;
    doingAction = false;
}

window.onload = function () {
    main();
    stage.tabIndex = 1000;
    stage.style.outline = "none";
    stage.addEventListener("keydown", keyIsDown);
    stage.addEventListener("keyup", keyIsUp);
    stage.addEventListener('mousedown', mouseIsDown, true);
    stage.addEventListener('mouseup', mouseIsUp);
    stage.addEventListener('mousemove', mouseIsMoving);
    stage.onselectstart = function () { return false; }
    stage.addEventListener('contextmenu', function (e) { e.preventDefault(); e.stopPropagation(); });
    stage.style.cursor = 'none';

    document.addEventListener('mousedown', function() {if(!mouseClicked)clickedOutScreen()}, false);
}

function mouseIsUp(e) {
    // e.preventDefault();
    mouseClicked = false;
    crosshairCord = gameVars.aim.getCoords();
    if (e.button === actionKey) {
        leftClicked = false;
    } else if (e.button === buildKey) {
        rightClicked = false;
    }
}

function mouseIsMoving(e) {
    mouseCords = panel.mouse();
    crosshairCord = gameVars.aim.getCoords();
}

function mouseIsDown(e) {
    //e.button describes the mouse button that was clicked
    // 0 is left, 1 is middle, 2 is right
    mouseClicked = true;
    crosshairCord = gameVars.aim.getCoords();
    if (e.button === actionKey) {
        leftClicked = true;
        if (!PAUSED && !playerDead) {
            performClick(true);
        }
    } else if (e.button === buildKey) {
        rightClicked = true;
    }
}

function keyIsUp(e) {
    e.preventDefault();
    if (e.keyCode === 80 || e.keyCode === 81 || e.keyCode === 32 || e.keyCode === 82) //P or Q or space or R
        setKey(e.keyCode, false, true);
    else
        setKey(e.keyCode, false);
}

function keyIsDown(e) {
    e.preventDefault();
    setKey(e.keyCode, true);
}

function setKey(key, cond, pressOnly) {
    switch (key) {
        case 65: //left or A
        case 37:
            movingLeft = cond;
            break;
        case 68: //right or D
        case 39:
            movingRight = cond;
            break;
        case 87: //up or W
        case 38:
            movingUp = cond;
            break;
        case 83: // down or S
        case 40:
            movingDown = cond;
            break;
        case 80: //P
        case 81: //Q
            if (pressOnly) {
                if (init) {
                    init = false;
                    PAUSED = false;
                    gameVars.audios.audio.playLoop('GameMusic');
                } else if (!playerDead) {
                    PAUSED = !PAUSED;
                    if (PAUSED) gameVars.audios.audio.pause('GameMusic');
                    else if (!PAUSED) gameVars.audios.audio.play('GameMusic');
                }
            }
            break;
        case 32: // space
            if (pressOnly && !playerDead)
                canUsePotion = true;
            break;
        case 82: //R
            if (pressOnly && canRestart) resetGame();
            break;
        default:
        //console.log('not moving really', key)
    }
} //1728-2178