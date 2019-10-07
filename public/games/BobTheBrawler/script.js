const gameVars = {};
const panel = new GamePanel("gameArea", {dimensions: {width:500, height:450}, name: "Bob The Brawler"});
const WIDTH = panel.canvasWidth();
const HEIGHT = panel.canvasHeight();
const SCALE = WIDTH/HEIGHT;

let PAUSED = true;
let musicStopped = false;

let init = true;

const lW = 10, lH = 9;

const stage = panel.getCanvas();
const screen = stage.getContext('2d');
const maxEntitiesAllowed = 15;
screen.mozImageSmoothingEnabled = false;
screen.webkitImageSmoothingEnabled = false;
screen.msImageSmoothingEnabled = false;
screen.imageSmoothingEnabled = false;


const playerMaxHealth = 100;
let playerHealth = playerMaxHealth;
let playerX = 0;
let playerY = 0;
let playerBX = 0;
let playerBY = 0;
let playerDead = false;
let playerStrength = 10;
let playerReach = 25;
let pXDir = 1;
let pYDir = 0;

const scoreEnemyDead = 230;
const scoreEnemyHit = 20;

let movingLeft = false;
let movingRight = false;
let movingUp = false;
let movingDown = false;
let punching = false;
let punchCord = {x: 0, y: 0};
let punchBack = [];

let score = 0;
let potions = 0;
let walls = 0;

let canUsePotion = false;
let canPlaceWall = false;

var Dani = { 
    random:function(a, b) {
        var result;
        var random = Math.random();
        if(a !== null && typeof a === "object") {
            //treat as list
            if(b === 1)
                result = a[this.random(a.length-1)];
            else
                result = this.cloneObject(a).sort(function() {
                    return random>.5?-1:1;
                });
        } else if(typeof a === "string") {
            //treat as string
            if(b === 1)
                result = a.split("")[this.random(a.length-1)];
            else
                result = a.split("").sort(function() {
                    return random>.5?-1 :1;
                }).join("");
        } else if(typeof a === "number") {
            //treat as number
            if(typeof b === "number") {
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
    cloneObject:function(obj){
        if(obj === null || typeof(obj) !== 'object')
            return obj;

        var temp = new obj.constructor(); 
        for(var key in obj)
            temp[key] = this.cloneObject(obj[key]);

        return temp;
    },
    lock:function(num, a, b) {
        if(num === undefined) return 0;
        if(b === undefined) b = a;
        if(num < a) num = a;
        else if(num > b) num = b;
        return num;
    },
    cycle:function(num, max, min) {
        if(num === undefined || max === undefined) return 0;
        min = min || 0;
        num = this.lock(num, min, max);
        if(num < max) num++;
        else num = min;
        return num;
    }
}

const Entity = function() {

    const entities = [];

    const Length = function() {
        return entities.length;
    }

    const reset = function() {
        // for(const i in entities) {
        //     const entity = entities[i];
        // }
        while (entities.length) {
            entities.pop();
        }
    }

    const addEntity = function(type, x, y, w, h) {
        x = x || 0;
        y = y || 0;
        w = Dani.lock(w, 40) || 40;
        h = Dani.lock(h, 40) || 40;
        let speed = 5;

        if(type === 'char') {
            entities.push(new Character(x, y, w, h));
        } else if(type === 'enem') {
            entities.push(new Enemy(x, y, w, h));
        }
    }
    let deadEntities = [];
    function tick() {
        //sort entities based on their y
        entities.sort((a,b) => a.getY()-b.getY());
        for(const i in entities) {
            const entity = entities[i];
            entity.tick();

            testCollisions(entity);
            if(entity.getRemove()) {
                entities.splice(parseInt(i), 1);
                if(Dani.random(100) > 70)
                    gameVars.drops.drop('potion', entity.getX(), entity.getY());
            }
        }
    }

    function render() {
        for(const i in entities) {
            entities[i].render();
        }
    }

    function isFreeTile(x, y) {
        for(const i in entities) {
            const entity = entities[i];

            const entityBX = (Math.floor((entity.getX()- 5)/gameVars.level.size) * gameVars.level.size) + entity.getW()/2;
            const entityBY = (Math.floor((entity.getY()- 10)/gameVars.level.size) * gameVars.level.size) + entity.getH();
            const pX = Math.floor((entityBX)/gameVars.level.size);
            const pY = Math.floor((entityBY)/gameVars.level.size);

            if(pX == x && pY == y) return false;
        }
        return true;
    }

    function testCollisions(self) {
        const w = self.getW();
        const h = self.getH();
        const x = self.getX();
        const y = self.getY();

        // colliding with borders
        if(x - (w/2) < 0) self.setX(w/2);
        if(x + (w/2) > WIDTH) self.setX(WIDTH - w/2);
        if(y - h < 0) self.setY(h);
        if(y > HEIGHT) self.setY(HEIGHT);

        // colliding with walls
        //collisions
        const rightX = getBlockX(x + (w/2));
        const leftX = getBlockX(x - (w/2));
        const topY = getBlockY(y - h);
        const bottomY = getBlockY(y);

        const xLeft = getBlockX(x - (w/4))
        const xRight = getBlockX(x + (w/4));
        const yTop = getBlockY(y - (h*3/4));
        const yBottom = getBlockY(y - (h/4));

        // left collide
        if(collide(leftX, yBottom) || collide(leftX, yTop)) {
            self.setX(x + Math.abs(x - (w/2) - ((leftX + 1) * gameVars.level.size)));
        }
        if(touchingWall(leftX, yBottom) || touchingWall(leftX, yTop)) {
            self.setTouchingWall(true);
        }

        // right collide
        if(collide(rightX, yBottom) || collide(rightX, yTop)) {
            self.setX(x - Math.abs(x + (w/2) - (rightX * gameVars.level.size)));
        }
        if(touchingWall(rightX, yBottom) || touchingWall(rightX, yTop)) {
            self.setTouchingWall(true);
        }

        // top collide
        if(collide(xLeft, topY) || collide(xRight, topY)) {
            self.setY(y + Math.abs(y - h - ((topY + 1) * gameVars.level.size)));
        }
        if(touchingWall(xLeft, topY) || touchingWall(xRight, topY)) {
            self.setTouchingWall(true);
        }

        // bottom collide
        if(collide(xLeft, bottomY) || collide(xRight, bottomY)) {
            self.setY(y - Math.abs(y - (bottomY * gameVars.level.size)));
        }
        if(touchingWall(xLeft, bottomY) || touchingWall(xRight, bottomY)) {
            self.setTouchingWall(true);
        }
    }

    
    function getBlockX(x) {
        return Math.floor(x/gameVars.level.size);
    }
    function getBlockY(y) {
        return Math.floor(y/gameVars.level.size);
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
        reset
    }
}

const Character = function(x, y, w, h) {
    x = x || 0;
    y = y || 0;
    w = w || 50;
    h = h || 50;
    let speed = 7;
    let xDir = 1;

    let hX = 0;
    let hY = 0;
    let hW = 16;
    let hH = 16;

    let touchingWall = false;

    let walkAnim = 4;
    let walking = false;
    let walkCount = 0;
    const walkCounter = 2;

    const punchFrame = 5;
    const hurtFrame = 6;
    const deadFrame = 7;
    
    let canRemove = false;

    function setX(val) {
        x = val;
    }
    function setY(val) {
        y = val;
    }
    function getX() {
        return x;
    }
    function getY() {
        return y;
    }
    function getW() {
        return w;
    }
    function getH() {
        return h;
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

    function tick() {
        if(!playerDead) {
            if(movingUp) {
                y -= speed;
                pXDir = 0;
                pYDir = -1;
            } 
            if(movingDown) {
                y += speed;
                pXDir = 0;
                pYDir = 1;
            }
            if(movingLeft) {
                x -= speed;
                xDir = -1;
                pXDir = -1;
                pYDir = 0;
            }
            if(movingRight) {
                x += speed;
                xDir = 1;
                pXDir = 1;
                pYDir = 0;
            }
            if(!movingDown && !movingLeft && !movingRight && !movingUp) {
                walking = false;
            } else {
                walking = true;
            }

            playerX = x;
            playerY = y;
            playerBX = (Math.floor((x- 5)/gameVars.level.size) * gameVars.level.size) + w/2;
            playerBY = (Math.floor((y- 10)/gameVars.level.size) * gameVars.level.size) + h;

            if(xDir === -1) {
                hY = 1;
            } else {
                hY = 0;
            }
            if(walking) {
                if(walkCount >= walkCounter) {
                    walkCount = 0;
                    hX = Dani.cycle(hX, walkAnim, 1);
                } else {
                    walkCount++;
                }
            } else {
                walkCount = 0;
                hX = 0;
            }

            if(punching && punchCord.x === 0 && punchCord.y === 0) {
                punchCord.x = x;
                punchCord.y = y - (h/2);
                gameVars.checker.punchWall(playerBX, playerBY, pXDir, pYDir, playerStrength, 'player');
                hX = punchFrame; //punching
            } else if(!punching) {
                punchCord.x = 0;
                punchCord.y = 0;
            }

            if(punchBack.length > 0) {
                for(const i in punchBack) {
                    var newX = punchBack[i].x;
                    var newY = punchBack[i].y;
                    var xx = newX-x;
                    var yy = newY-(y - h/2);
                    var distance = Math.sqrt((xx * xx) + (yy * yy));
                    var angleRad = Math.atan2(yy, xx);
                    var angleDeg = angleRad/Math.PI*180;
                    var rotation = angleDeg;
                    var enemyD = punchBack[i].w;
                    var playerD = w/2;
                    if(distance < (enemyD + playerD)) {
                        hX = hurtFrame; //hurt
                        let dmg = punchBack[i].dmg
                        playerHealth -= Dani.random(dmg-5,dmg);
                        playerHealth = Dani.lock(playerHealth, 0, playerMaxHealth);

                        var xMov = Math.cos(rotation*(Math.PI/180));
                        var yMov = Math.sin(rotation*(Math.PI/180));
                        gameVars.audios.audio.playOnce('PlayerHurt');
                        x -= xMov*playerD;
                        y -= yMov*playerD;
                        if(playerHealth <= 0) {
                            playerDead = true;
                            gameVars.audios.audio.playOnce('PlayerDeath');
                        }
                    }
                }
                punchBack = [];
            }
        } else {
            // if(removeCount >= removeCounter) {
            //     removeCount = 0;
            //     canRemove = true;
            // } else {
            //     removeCount++;
            // }
            hX = deadFrame; //dead
        }
    }

    function render() {
        // draw('charr', playerBX, playerBY, w+5, h+5);

        drawImg('player', x-(w/2), y-h, w, h, hX*hW, hY*hH, hW, hH);
    }
    return {
        render,
        tick,
        getX,
        getY,
        getW,
        getH,
        setX,
        setY,
        getRemove,
        setTouchingWall,
        getTouchingWall
    }
}


const Enemy = function(x, y, w, h) {
    x = x || 0;
    y = y || 0;
    w = w || 50;
    h = h || 50;
    

    let hX = 0;
    let hY = 0;
    let hW = 16;
    let hH = 16;
    
    const eStrength = Dani.random(10, 20);

    let touchingWall = false;

    let walkAnim = 4;
    let walking = false;
    let walkCount = 0;
    const walkCounter = 2;

    const punchFrame = 5;
    const hurtFrame = 6;
    const deadFrame = 7;

    let attackCount = 0;
    const attackCounter = 10;
    let wallBreakCount = 0;
    const wallBreakCounter = 10;

    let removeCount = 0;
    const removeCounter = 50;

    const maxHealth = 40;
    let health = maxHealth;
    let gotHit = false;
    let isDead = false;
    let canRemove = false;

    let speed = 4;

    
    function setX(val) {
        x = val;
    }
    function setY(val) {
        y = val;
    }
    function getX() {
        return x;
    }
    function getY() {
        return y;
    }
    function getW() {
        return w;
    }
    function getH() {
        return h;
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

    let xMove = 0;
    let yMove = 0;
    let blX = 0;
    let blY = 0;
    let followingPlayer = false;
    let xDir = 1;
    
    var nextMoves;
    var nextMove;
    var targetMet = true;
    function tick() {
        if(!isDead) {
            if(followingPlayer) {
                blX = (Math.floor((x- 5)/gameVars.level.size) * gameVars.level.size) + w/2;
                blY = (Math.floor((y- 10)/gameVars.level.size) * gameVars.level.size) + h;
                const playersX = Math.floor(playerBX/gameVars.level.size);
                const playersY = Math.floor(playerBY/gameVars.level.size);
                const blockX = Math.floor(blX/gameVars.level.size);
                const blockY = Math.floor(blY/gameVars.level.size);
                nextMoves = gameVars.level.path({x: blockX, y: blockY}, {x:playersX, y:playersY});
                if(nextMoves.length === 0) { //chase
                    //walking = false;
                    //followingPlayer = 'chase';
                    var newX = playerX;
                    var newY = playerY;
                    var xx = newX-x;
                    var yy = newY-y;
                    var angleRad = Math.atan2(yy, xx);
                    var angleDeg = angleRad/Math.PI*180;

                    var distance = Math.sqrt((xx * xx) + (yy * yy));
                    
                    var rotation = angleDeg;
                    if(distance > speed) {
                        walking = true;
                        var xMov = Math.cos(rotation*(Math.PI/180));
                        var yMov = Math.sin(rotation*(Math.PI/180));
                        x += xMov*speed;
                        y += yMov*speed;
                        if(xMov > 0) xDir = 1;
                        else if(xMov < 0) xDir = -1;
                    } else {
                        walking = false;
                    }
                } else {
                    walking = true;
                    
                    if(targetMet) {
                        nextMove = nextMoves[1];
                        targetMet = false;
                    }

                    var newX = nextMove.x * gameVars.level.size + w/2;
                    var newY = nextMove.y * gameVars.level.size + h;
                    var xx = newX-x;
                    var yy = newY-y;
                    var angleRad = Math.atan2(yy, xx);
                    var angleDeg = angleRad/Math.PI*180;
                    var distance = Math.sqrt((xx * xx) + (yy * yy));
                    
                    var rotation = angleDeg;
                    var xMov = Math.cos(rotation*(Math.PI/180));
                    var yMov = Math.sin(rotation*(Math.PI/180));
                    x += xMov*speed;
                    y += yMov*speed;

                    if(xMov > 0) xDir = 1;
                    else if(xMov < 0) xDir = -1;
                    
                    if(distance < speed) {
                        targetMet = true;
                    }
                }

            } else { //idle
                x += xMove * speed;
                y += yMove * speed;
                if(Dani.random(100) > 97) {
                    xMove = parseInt(Dani.random([-1, 0, 1], 1));
                    yMove = parseInt(Dani.random([-1, 0, 1], 1));
                    if(xMove === 1 || xMove === -1) {
                        xDir = xMove;
                    }
                }
                if(xMove === 0 && yMove === 0) {
                    walking = false;
                } else {
                    walking = true;
                }
            }

            if(Dani.random(100) > 98) {
                // followingPlayer = Dani.random(['idle', 'chase', 'path'], 1);
                // followingPlayer = 'path'
                followingPlayer = !followingPlayer;
            }

            if(xDir === -1) {
                hY = 1;
            } else {
                hY = 0;
            }
            
            if(walking) {
                if(walkCount >= walkCounter) {
                    walkCount = 0;
                    hX = Dani.cycle(hX, walkAnim, 1);
                } else {
                    walkCount++;
                }
            } else {
                walkCount = 0;
                hX = 0;
            }
            let nearPlayer = nearChar();
            if(!playerDead && nearPlayer) {
                if(attackCount >= attackCounter) {
                    attackCount = 0;
                    hX = punchFrame; //punch
                    punchBack.push({x, y:y - (h/2), w:w/2, dmg:eStrength});
                } else {
                    attackCount++;
                }
            }

            if(punching) {
                if(punchCord.x === 0 || punchCord.y === 0) return;
                var newX = punchCord.x;
                var newY = punchCord.y;
                var xx = newX-x;
                var yy = newY-(y - h/2);
                var distance = Math.sqrt((xx * xx) + (yy * yy));
                var angleRad = Math.atan2(yy, xx);
                var angleDeg = angleRad/Math.PI*180;
                var rotation = angleDeg;
                var enemyD = w/2;
                if(distance < (enemyD + playerReach) && !gotHit) {
                    hX = hurtFrame; //hurt
                    gotHit = true;
                    health -= Dani.random(playerStrength-5, playerStrength);
                    health = Dani.lock(health, 0, maxHealth);

                    var xMov = Math.cos(rotation*(Math.PI/180));
                    var yMov = Math.sin(rotation*(Math.PI/180));
                    gameVars.gui.addScore(scoreEnemyHit);
                    gameVars.audios.audio.playOnce('EnemyHurt');

                    x -= xMov*playerReach;
                    y -= yMov*playerReach;
                    if(health <= 0) {
                        isDead = true;
                        gameVars.gui.addScore(scoreEnemyDead);
                        gameVars.audios.audio.playOnce('EnemyDeath');
                    }
                }
            } else {
                gotHit = false;
            }
            if(touchingWall) {
                let bX = (Math.floor((x- 5)/gameVars.level.size) * gameVars.level.size) + w/2;
                let bY = (Math.floor((y- 10)/gameVars.level.size) * gameVars.level.size) + h;
                if(wallBreakCount >= wallBreakCounter) {
                    wallBreakCount = 0;
                    
                    if(playerBX > bX) {
                        gameVars.checker.punchWall(bX, bY, 1, 0, eStrength, 'enemy');
                        hX = punchFrame;
                    } else if(playerBX < bX) {
                        gameVars.checker.punchWall(bX, bY, -1, 0, eStrength, 'enemy');
                        hX = punchFrame;
                    }
                    if(playerBY > bY) {
                        gameVars.checker.punchWall(bX, bY, 0, 1, eStrength, 'enemy')
                        hX = punchFrame;
                    } else if(playerBY < bY) {
                        gameVars.checker.punchWall(bX, bY, 0, -1, eStrength, 'enemy');
                        hX = punchFrame;
                    }
                } else {
                    wallBreakCount++;
                }
                touchingWall = false;
            }
        } else {
            if(removeCount >= removeCounter) {
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
        drawImg('enemy', x-(w/2), y-h, w, h, hX*hW, hY*hH, hW, hH);
    }

    function nearChar() {
        var newX = playerX;
        var newY = playerY;
        var xx = newX-x;
        var yy = newY-(y - h/2);
        var distance = Math.sqrt((xx * xx) + (yy * yy));
        
        var enemyD = w;
        if(distance < (enemyD)) {
            return true
        }
        return false;
    }

    return {
        render,
        tick,
        getX,
        getY,
        getW,
        getH,
        setX,
        setY,
        getRemove,
        setTouchingWall,
        getTouchingWall
    }
}

const Font = function(pathRef) {
    var path = pathRef ? pathRef : "PixelFont/font_";

    var fontChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0','colon','equals','period','comma','exclamation_point','question_mark', 'space'];
    var fonts = {};

    function getChar(char) {
        char = char.toLowerCase();
        if(char.match(/[0-9a-z]/i)) {
            return char;
        } else {
            if(char === " ") return 'space';
            if(char === ":") return 'colon';
            if(char === "=") return 'equals';
            if(char === ".") return 'period';
            if(char === ",") return 'comma';
            if(char === "!") return 'exclamation_point';
            if(char === "?") return 'question_mark';
        }
        return '';
    }

    var preloadimages = async function(){
        var texxture;
        for (var i in fontChars) {
            texxture = fontChars[i];
            fonts[texxture] = new Image();
            fonts[texxture].onerror = async function() {
                var textyure = this.src.split(path)[1].split('.')[0];
                
                this.onerror = async function() {
                    for(var j = 0; j < fontChars.length; j++){ 
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
        fonts:fonts,
        getChar
    }
}

const Texture = function(pathRef) {

    var textureList = ["player", "wall", "floor", "bedrock", "blockDamage", "enemy", "health", "potion", "package", "GUIPanel", "pause_screen", "play_screen", "death_screen"];
    var textures = {};
    
    var path = pathRef ? pathRef : "textures/";

    var preloadimages = async function(){
        var texxture;
        for (var i in textureList) {
            texxture = textureList[i];
            textures[texxture] = new Image();
            textures[texxture].onerror = async function() {
                var textyure = this.src.split(path)[1].split('.')[0];
                
                this.onerror = async function() {
                    for(var j = 0; j < textureList.length; j++){ 
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
        textures:textures
    }
}

function drawImg(obj, x, y, w, h, dx, dy, dw, dh) {
    const width = panel.canvasWidth();
    const scale = width/WIDTH;
    dx = dx || 0;
    dy = dy || 0;
    dw = dw || gameVars.texture.textures[obj].width;
    dh = dh || gameVars.texture.textures[obj].height;

    x *= scale;
    y *= scale;
    w *= scale;
    h *= scale;
    
   screen.drawImage(gameVars.texture.textures[obj], dx, dy, dw, dh, x, y, w, h);
}

function drawTxt(string, x, y, h) {
    const width = panel.canvasWidth();
    const scale = width/WIDTH;

    let dist = 2;

    h = parseInt(h) || 10;
    x *= scale;
    y *= scale;
    h *= scale;
    dist *= scale;
    h = parseInt(h);
    const w = h/2;
    dist += w;

    let char;
    let j = 0;
    for(var i in string) {
        char = gameVars.font.getChar(string[i]);
        if(char === '') continue;
        screen.drawImage(gameVars.font.fonts[char], x + (j*dist), y, w, h);
        j++;
    }

//    screen.drawImage(gameVars.texture.textures[obj], dx, dy, dw, dh, x, y, w, h);
}

const Tile = {
    floor: 'floor',
    wall: 'wall',
    bedrock: 'bedrock'
}

function Level(w, h) {
    w = w || 10;
    h = h || 10;
    const blockMaxHealth = 60;
    const blockDamageFrames = 5;
    this.size = 50;
    this.block = [];
    for(let x = 0; x < w; x++) {
        this.block[x] = [];
        for(let y = 0; y < h; y++) {
            this.block[x][y] = {id:Tile.floor, health:blockMaxHealth};
        }
    }
    
    for(let x = 0; x < w; x++) {
        const y = 8;
        this.block[x][y].id = Tile.bedrock;
    }

    this.reset = function() {
        for(let x = 0; x < w; x++) {
            this.block[x] = [];
            for(let y = 0; y < h; y++) {
                this.block[x][y] = {id:Tile.floor, health:blockMaxHealth};
            }
        }
        
        for(let x = 0; x < w; x++) {
            const y = 8;
            this.block[x][y].id = Tile.bedrock;
        }
    }

    this.tick = function() {
    }
    this.render = function() {      
         
        for(let x = 0; x < w; x++)
            for(let y = 0; y < h; y++) {   
                drawImg(this.block[x][y].id, x * this.size, y * this.size, this.size, this.size);

                const dmgAnim = Math.floor(this.block[x][y].health/blockMaxHealth*blockDamageFrames);
                drawImg('blockDamage', x * this.size, y * this.size, this.size, this.size, dmgAnim*16, 0, 16, 16);
            }
    }
    this.path = function(startPos, endPos) {
        const block = this.block;
        const map = {};
        for(let x = 0; x < w; x++) {
            map[x] = [];
            for(let y = 0; y < h; y++) {
                map[x][y] = {taken: false, num: 0, roots:[]};
            }
        }

        function spreadPath(id, x, y) {
            try {
                // if(!map[x][y].taken && block[x][y].id !== Tile.wall) {
                map[x][y].taken = true;
                map[x][y].num = id;
                if(map[x][y].roots.length === 0) map[x][y].roots = [{x, y}];
                attemptSpread(id, x+1, y, Dani.cloneObject(map[x][y].roots));
                attemptSpread(id, x, y+1, Dani.cloneObject(map[x][y].roots));
                attemptSpread(id, x-1, y, Dani.cloneObject(map[x][y].roots));
                attemptSpread(id, x, y-1, Dani.cloneObject(map[x][y].roots));
                // }
            } catch (e) {
                // console.warn(e.message, x, y)
            }
        }
        const spreadsLeft = [];
        function attemptSpread(id, x, y, roots) {
            try {
                if(!map[x][y].taken && block[x][y].id === Tile.floor && !pathFound) {
                    map[x][y].taken = true;
                    map[x][y].num = id + 1;
                    map[x][y].roots = roots;
                    map[x][y].roots.push({x, y});
                    if(x === endPos.x && y === endPos.y) {
                        pathFound = true;
                        properPath = map[x][y].roots;
                        return;
                    }
                    spreadsLeft.push({id, x, y});
                }
            } catch (e) {
                // console.warn(e.message, x, y)
            }
        }
        let pathFound = false;
        let properPath = [];

        spreadPath(0, startPos.x, startPos.y);
        for(let i = 0; i < spreadsLeft.length; i++) {
            if(pathFound) break;
            spreadPath(i+1, spreadsLeft[i].x, spreadsLeft[i].y);
            if(spreadsLeft[i].x === endPos.x && spreadsLeft[i].y === endPos.y) {
                //pathFound = true;
                break;
            }
        }
        return properPath;
    }

    this.isBlock = function(x, y, id) {
        try {
            return this.block[x][y].id === id;
        } catch {
            return false;
        }
    }

    this.setBlock = function(x, y, id) {
        try {
            this.block[x][y].id = id;
            this.block[x][y].health = blockMaxHealth;
        } catch {}
    }

    this.getBlock = function(x, y) {
        try {
            return this.block[x][y].id;
        } catch {
            return null;
        }
    }

    this.hitBlock = function(x, y, damage, target) {
        try {
            if(this.block[x][y].id !== Tile.wall) return;
            this.block[x][y].health -= damage;
            this.block[x][y].health = Dani.lock(this.block[x][y].health, 0, blockMaxHealth);
            if(this.block[x][y].health === 0) {
                this.setBlock(x, y, Tile.floor);
                if(target === 'player') {
                    gameVars.gui.addWall(1);
                }
            }
        } catch {}
    }
}



function Spawner() {
    const maxEntities = maxEntitiesAllowed;
    const spawnTimer = 100;
    let spawnTime = 0;
    const spawn = function() {
        if(!PAUSED && gameVars.entities.Length() < maxEntities) {
            const x = parseInt(Dani.random([0, (lW-1)], 1)) * gameVars.level.size;
            const y = parseInt(Dani.random([0, (lH-1)], 1)) * gameVars.level.size;
            gameVars.entities.addEntity('enem', x, y);
        }
    }
    function tick() {
        if(spawnTime >= spawnTimer) {
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
        if(potions > 0 && playerHealth < playerMaxHealth) {
            playerHealth += 10;
            playerHealth = Dani.lock(playerHealth, 0, playerMaxHealth);
            gameVars.gui.removePotion();
            gameVars.audios.audio.playOnce('HealthUse');
        }
    }
    function placeWall() {
        if(walls > 0) {
            const pX = Math.floor((playerBX)/gameVars.level.size) + pXDir;
            const pY = Math.floor((playerBY)/gameVars.level.size) + pYDir;
            try {
                if(gameVars.entities.isFreeTile(pX, pY) && gameVars.level.isBlock(pX, pY, Tile.floor)) {
                    gameVars.level.setBlock(pX, pY, Tile.wall);
                    gameVars.gui.removeWall();
                }
            }catch(e){console.warn(e.message)}
        }
    }
    
    function punchWall(bX, bY, xDir, yDir, strength, target) {
        const pX = Math.floor((bX)/gameVars.level.size) + xDir;
        const pY = Math.floor((bY)/gameVars.level.size) + yDir;
        try {
            if(gameVars.level.isBlock(pX, pY, Tile.wall)) {//console.log('being punched')
                gameVars.level.hitBlock(pX, pY, strength, target);
            }
        }catch(e){console.warn(e.message)}
    }

    function tick() {
        if(canUsePotion) {
            usePotion();
            canUsePotion = false;
        }
        if(canPlaceWall) {
            placeWall();
            canPlaceWall = false;
        }
    }
    return {
        tick,
        punchWall
    }
}

function Drops() {
    const size = 35;
    const items = [];
    const ticker = 50;

    
    const dropTimer = 500;
    let dropTime = 0;

    const drop = function(name, x, y, timeLeft) {
        items.push({name, x, y, time:timeLeft || ticker});
    }

    const reset = function() {
        // for(const i in entities) {
        //     const entity = entities[i];
        // }
        while (items.length) {
            items.pop();
        }
    }

    const dropItem = function() {
        if(Dani.random(100) > 1) {
            dropPackage();
        }
    }
    const dropPackage = function() {
        const x = Dani.random(lW);
        const y = Dani.random(lH-1);
        if(gameVars.level.isBlock(x, y, Tile.floor)) {
            drop('package', x * gameVars.level.size + size/2, y * gameVars.level.size, 100);
        }
    }
    function tick() {
        if(dropTime >= dropTimer) {
            dropTime = 0;
            dropItem();
        } else {
            dropTime++;
        }
        for(const i in items) {
            const item = items[i];
            if(!item.ticker) item.ticker = 1;
            else (item.ticker++);
            if(item.ticker >= item.time)
                items.splice(parseInt(i), 1);

            if(nearChar(item.x, item.y, size, size)) {
                if(item.name === 'potion') {
                    items.splice(parseInt(i), 1);
                    gameVars.gui.addPotion(1);
                    gameVars.audios.audio.playOnce('HealthPickup');
                } else if(item.name === 'package') {
                    items.splice(parseInt(i), 1);
                    gameVars.gui.addWall(Dani.random(1, 5));
                    gameVars.gui.addPotion(Dani.random(1, 3));
                }
            }
        }
    }
    function render() {
        for(const i in items) {
            const item = items[i];
            drawImg(item.name, item.x - (size/2), item.y - (size), size, size);
        }
    }

    function nearChar(x, y, w, h) {
        var newX = playerX;
        var newY = playerY - 20;
        var xx = newX-x;
        var yy = newY-(y - h/2);
        var distance = Math.sqrt((xx * xx) + (yy * yy));
        
        var thisD = w/2;
        if(distance < (playerReach + thisD)) {
            return true
        }
        return false;
    }

    return {
        drop,
        dropItem,
        tick,
        render,
        reset
    }
}

function GUI() {
    function addScore(val) {
        score += val || 1;
    }
    function removeScore(val) {
        score -= val || 1;
        if(score < 0) score = 0;
    }

    function addPotion(val) {
        potions += val || 1;
    }
    function removePotion(val) {
        potions -= val || 1;
        if(potions < 0) potions = 0;
    }

    function addWall(val) {
        walls += val || 1;
    }
    function removeWall(val) {
        walls -= val || 1;
        if(walls < 0) walls = 0;
    }

    function render() {

        //guipanel
        drawImg('GUIPanel', 0, 400, 500, 50); //health border

        //player health
        drawImg('health', 12.5, 412.5, 100/playerMaxHealth*playerHealth, 25, 0, 0, 32/playerMaxHealth*playerHealth, 8); //health itself

        // //score baord
        drawTxt(`${score}`, 387.5, 415.625, 18.75);

        // //potion baord
        drawTxt(`${potions}`, 156.25, 415.625, 18.75);

        // //wall baord
        drawTxt(`${walls}`, 268.75, 415.625, 18.75);
    }
    return {
        addScore,
        removeScore,
        addPotion,
        removePotion,
        addWall,
        removeWall,
        render
    }
}

const Audios = function() {
    const audio = new GameAudio();

    async function loadAudios() {
        audio.setDefaults({source: '/games/BobTheBrawler/audios', type: 'wav'});
        await audio.create('GameMusic', 'EnemyDeath', 'EnemyHurt', 'HealthPickup', 'HealthUse', 'PlayerDeath', 'PlayerHurt');
    }

    loadAudios();

    return {
        audio
    }
}

async function main() {

    gameVars.texture = await new Texture('/games/BobTheBrawler/textures/');
    gameVars.font = await new Font('/games/BobTheBrawler/PixelFont/font_');

    gameVars.level = new Level(lW, lH);
    gameVars.checker = new Checker();

    gameVars.entities = new Entity();
    gameVars.entities.addEntity('char', 250, 200);

    gameVars.spawner = new Spawner();
    gameVars.drops = new Drops();

    gameVars.gui = new GUI();

    gameVars.audios = await new Audios();
    
    setInterval(run, 50);


    // setTimeout(resetGame, 5000);
}


const resetGame = function() {
    //reset let variables
    PAUSED = false;
    musicStopped = false;

    playerHealth = playerMaxHealth;
    playerX = 0;
    playerY = 0;
    playerBX = 0;
    playerBY = 0;
    playerDead = false;
    playerStrength = 10;
    playerReach = 25;
    pXDir = 1;
    pYDir = 0;

    movingLeft = false;
    movingRight = false;
    movingUp = false;
    movingDown = false;
    punching = false;
    punchCord = {x: 0, y: 0};
    punchBack = [];

    score = 0;
    potions = 0;
    walls = 0;
    canUsePotion = false;
    canPlaceWall = false;

    //reset entities
    gameVars.entities.reset();
    gameVars.entities.addEntity('char', 250, 200);

    //reset drops
    gameVars.drops.reset();

    //reset level
    gameVars.level.reset();

    gameVars.audios.audio.playLoop('GameMusic');
}

function tick() {
    gameVars.spawner.tick();
    gameVars.level.tick();
    gameVars.drops.tick();
    gameVars.entities.tick();
    gameVars.checker.tick();
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
    gameVars.gui.render();
}


function run() {
    if(!init) {
        if(!PAUSED && !playerDead) {
            tick();
            render();
            if(musicStopped) musicStopped = false;
        } else if(PAUSED) {
            drawImg('pause_screen', 50, 125 , 400, 200);
        } else if(playerDead) {
            drawImg('death_screen', 50, 125 , 400, 200);
            if(!musicStopped) {
                gameVars.audios.audio.stop('GameMusic');
                musicStopped = true;
            }
        }
    } else {
        drawImg('play_screen', 50, 125 , 400, 200);
    }
}

window.onload = function() {
    main();
    stage.tabIndex = 1000;
    stage.style.outline = "none";
    stage.addEventListener("keydown", keyIsDown);
    stage.addEventListener("keyup", keyIsUp);
}


function keyIsUp(e) {
    // console.log(e.target === stage)
    e.preventDefault();
    if(e.keyCode === 80 || e.keyCode === 77 || e.keyCode === 81 || e.keyCode === 71 || e.keyCode === 76 || e.keyCode === 82) //P or M or Q or G or L or R
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
        case 32: // space
            punching = cond;
            break;
        case 80: //P
            if(pressOnly) {    
                if(init) {
                    init = false;
                    PAUSED = false;
                    gameVars.audios.audio.play('GameMusic');
                } else 
                if(!playerDead) {
                    PAUSED = !PAUSED;
                    if(PAUSED) gameVars.audios.audio.pause('GameMusic');
                    else if(!PAUSED) gameVars.audios.audio.play('GameMusic');
                }
            }
            break;
        case 77: //M
        case 81: //Q
            if(pressOnly)
                canUsePotion = true;
            break;
        case 71: //G
        case 76: //L
            if(pressOnly)
                canPlaceWall = true;
            break;
        case 82: //R
            if(pressOnly && playerDead) resetGame();
            break;
        default:
            //console.log('not moving really', key )
    }
}