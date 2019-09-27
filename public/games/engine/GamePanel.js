const GamePanel = function(gameAreaId, options) {
    let defaultCW = options? options.dimensions? options.dimensions.width || 400 : 400 : 400;
    let defaultCH = options? options.dimensions? options.dimensions.height || 400  : 400 : 400;
    let WIDTH = defaultCW;
    let HEIGHT = defaultCH;
    let PAD = 40;
    const index = options? options.index? options.index || 0 : 0 : 0;
    const showLogs = options? options.showLogs !== undefined ? options.showLogs : true : true;
    const gameName = options? options.name? options.name || "Game" : "Game" : "Game";
    const safeRender = options? options.safeRender !== undefined ? options.safeRender : true : true;
    const renderOnMouse = options? options.renderOn !== undefined ? options.renderOn.mouse : false : false;
    const startEmpty = options? options.startEmpty !== undefined ? options.startEmpty : false : false;
    let renderCallBack = options? options.renderMethod? options.renderMethod || 'render' : 'render' : 'render';

    let mouseX = 0;
    let mouseY = 0;

    const getCanvas = function() {
        return gameCanvas;
    }
    const getCanvasWidth = function() {
        return gameCanvas.width;
    }
    const getCanvasHeight = function() {
        return gameCanvas.height;
    }
    const getWidth = function () {
        return gamePanel.clientWidth || gamePanel.offsetWidth || gamePanel.style.width || defaultCW;
    }
    const getHeight = function () {
        return gamePanel.clientHeight || gamePanel.offsetHeight || gamePanel.style.height || defaultCH;
    }
    const setDimension = function(width, height) {
        setWidth(width);
        setHeight(height);
    }
    const setWidth = function(width) {
        defaultCW = width || defaultCW;
        gameCanvasDiv.style.width = defaultCW + "px";
        WIDTH = getWidth();
        resizeCanvas();
    }
    const setHeight = function(height) {
        defaultCH = height || defaultCH;
        gameCanvasDiv.style.height = defaultCH + "px";
        HEIGHT = getHeight();
        resizeCanvas();
    }
    const resetCanvas = function() {
        stage.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    }

    const getMouseX = function() {
        return mouseX;
    }
    const getMouseY = function() {
        return mouseY;
    }
    const getMouse = function() {
        return {x: mouseX, y: mouseY};
    }
    function getViewportSize() {
        var w = document.documentElement.clientWidth || window.innerWidth || 0;
        var h = document.documentElement.clientHeight || window.innerHeight || 0;
        return {w : w, h: h}
    }
    function resizeCanvas(dontRender) {
        if(!isFullScreen()) {
            getPadded();
            const vp = getViewportSize();
            const pad = parseInt(window.getComputedStyle(document.getElementById('main'), null).getPropertyValue('padding-left')) * 2;
            if(vp.w - pad < WIDTH) {
                const newW = vp.w - PAD;
                const newH = defaultCW / defaultCH;
                gameCanvasDiv.style.width = (newW) + 'px';
                gameCanvasDiv.style.height = (newW / newH) + 'px';
            } else {
                gameCanvasDiv.style.width = defaultCW + "px";
                gameCanvasDiv.style.height = defaultCH + "px";
            }
        }
        gameCanvas.width = gameCanvasDiv.clientWidth || gameCanvasDiv.offsetWidth || defaultCW;
        gameCanvas.height = gameCanvasDiv.clientHeight || gameCanvasDiv.offsetHeight || defaultCH;
        if(dontRender === "true") return;
        render(); 
    }

    const clearCanvas = function() {
        stage.fillStyle = "white";
        stage.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    };
    function renderNoMethod() {
        stage.fillStyle = "white";
        stage.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        stage.fillStyle = "black";
        stage.font = '20px Arial';
        stage.fillText("No render method found.", 0, gameCanvas.height);
    };
    function renderError(message) {
        if(message)
            console.error("Render error: ", message)

        stage.fillStyle = "white";
        stage.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        stage.fillStyle = "black";
        stage.font = '20px Arial';
        stage.fillText(`Check Logs> Render error${message? ': ' + message + '!' : '!'}`.toUpperCase(), 0, 20);
        stage.fillText(`Check Logs> Render error${message? ': ' + message + '!' : '!'}`.toUpperCase(), 0, gameCanvas.height);
    };                                 
    function renderNothing() {
        stage.fillStyle = "white";
        stage.fillRect(0, 0, gameCanvas.width/2, gameCanvas.height/2);
        stage.fillStyle = "grey";
        stage.fillRect(gameCanvas.width/2, 0, gameCanvas.width/2, gameCanvas.height/2);
        stage.fillStyle = "grey";
        stage.fillRect(0, gameCanvas.height/2, gameCanvas.width/2, gameCanvas.height/2);
        stage.fillStyle = "white";
        stage.fillRect(gameCanvas.width/2, gameCanvas.height/2, gameCanvas.width/2, gameCanvas.height/2);
    };

    function getPadded() {
        PAD = (parseInt(window.getComputedStyle(gameCanvasDiv, null).getPropertyValue('margin-left')) +
        parseInt(window.getComputedStyle(document.getElementById('main'), null).getPropertyValue('padding-left')) +
        parseInt(window.getComputedStyle(gameCanvasDiv, null).getPropertyValue('border-left-width'))) * 2;
    }

    function setMousePosition() {
        const rect = gameCanvas.getBoundingClientRect(),
            scaleX = gameCanvas.width / rect.width,
            scaleY = gameCanvas.height / rect.height;
      
        mouseX = parseInt((event.clientX - rect.left) * scaleX);
        mouseY = parseInt((event.clientY - rect.top) * scaleY);
        
        if(renderOnMouse)
            render();
    }

    const paint = function(method, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
        stage[method](a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
    }
    const prop = function(prop, val) {
        stage[prop] = val;
    }

    const renderMethod = function(renderMethod) {
        renderCallBack = renderMethod;
    }
    let remMem = [];
    const render = function() {
        if(safeRender)
            renderNothing();
        try {
            if(typeof renderCallBack === 'string')
                window[renderCallBack]();
            else
                renderCallBack();
        } catch (e) {
            if(showLogs) console.error('Render attempt failed: ', e.message);
            renderMethod(renderError);
            return renderError(e.message);
        }
        if(arguments.length > 0) {
            remMem = [];
            for(const i in arguments) {
                try {
                    if(typeof arguments[i] === 'string') {
                        window[arguments[i]]();
                    } else {
                        arguments[i]();
                    }
                    remMem.push(arguments[i]);
                } catch (e) {
                    if(showLogs) console.error('Render attempt failed: ', e.message);
                    renderMethod(renderError);
                    return renderError(e.message);
                }
            }
        } else {
            for(const i in remMem) {
                try {
                    if(typeof remMem[i] === 'string') {
                        window[remMem[i]]();
                    } else {
                        remMem[i]();
                    }
                } catch (e) {
                    if(showLogs) console.error('Render attempt failed: ', e.message);
                    renderMethod(renderError);
                    return renderError(e.message);
                }
            }
        }
    }

    const exitHandler = function() {
        if (!isFullScreen()) {
            gamePanel.scrollIntoView();
        }
    }

    const isFullScreen = function() {
        const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        
        if(!fullscreenElement) return false;
        return true;
    }
    const gameArea = document.getElementById(gameAreaId);
    const gamePanel = document.createElement("div");
    gamePanel.className = "gamePanel";
    gameArea.appendChild(gamePanel);
    //gameArea.appendChild(document.createElement("br"));

    const gamePanelHTML = `
        <div class="gameName">${gameName}</div>
        <div class="gameCanvasDiv" id="gameCanvasDiv" style="width:${defaultCW}px;height:${defaultCH}px;">
            <canvas id="gameCanvas" width="${defaultCW}" height="${defaultCH}"></canvas> <!-- set proper width -->
        </div>
        <div class="gamePanelButtonsDiv">
            <button class="gamePanelButton btn btn-primary" id="fsBtn">Full Screen</button>
            <button class="gamePanelButton btn btn-primary" id="shBtn">Share</button>
        </div>
    `;
    gamePanel.innerHTML = gamePanelHTML;

    const gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.removeAttribute('id');

    document.getElementById('fsBtn').onclick = openFullscreen;
    document.getElementById('fsBtn').removeAttribute('id');

    document.getElementById('shBtn').onclick = () => {alert("Share link of game: " + window.location.href);};
    document.getElementById('shBtn').removeAttribute('id');

    const gameCanvasDiv = document.getElementById('gameCanvasDiv');
    gameCanvasDiv.removeAttribute('id');

    const stage = gameCanvas.getContext('2d');


    WIDTH = getWidth();
    HEIGHT = getHeight();
    getPadded();


    function openFullscreen() {
        if (gameCanvasDiv.requestFullscreen) {
            gameCanvasDiv.requestFullscreen();
        } else if (gameCanvasDiv.mozRequestFullScreen) {
            gameCanvasDiv.mozRequestFullScreen();
        } else if (gameCanvasDiv.webkitRequestFullscreen) {
            gameCanvasDiv.webkitRequestFullscreen();
        } else if (gameCanvasDiv.msRequestFullscreen) {
            gameCanvasDiv.msRequestFullscreen();
        }
    }

    function closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    window.addEventListener('resize', resizeCanvas, false);
    gameCanvasDiv.addEventListener('fullscreenchange', exitHandler, false);
    gameCanvasDiv.addEventListener('mozfullscreenchange', exitHandler, false);
    gameCanvasDiv.addEventListener('MSFullscreenChange', exitHandler, false);
    gameCanvasDiv.addEventListener('webkitfullscreenchange', exitHandler, false);
    gameCanvas.addEventListener('mousemove', setMousePosition, false);

    resizeCanvas('true');
    if(!startEmpty)
        renderNothing();

    return {
        canvasWidth: getCanvasWidth,
        canvasHeight: getCanvasHeight,
        clear: clearCanvas,
        getCanvas,
        height: getHeight,
        mouseX: getMouseX,
        mouseY: getMouseY,
        mouse: getMouse,
        paint,
        prop,
        render,
        renderMethod,
        reset: resetCanvas,
        setDimension,
        setHeight,
        setSize: setDimension,
        setWidth,
        width: getWidth
    }
}