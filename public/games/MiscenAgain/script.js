window.onload = function () {
    window.render = () => { }
    const width = 640;
    const height = 480;
    const panel = new GamePanel("gameArea", { dimensions: { width, height, lock: false }, name: "Miscen...AGAIN!?" });
    const canvasDiv = panel.getCanvas().parentElement;
    canvasDiv.innerHTML =
        `<iframe id="gameFrame" style="overflow: hidden;margin:0;padding:0;border:0;" width=${width} height=${height}
    src="https://miscen-again.netlify.app/" scrolling="no"></iframe>`;
    const gameFrame = document.getElementById("gameFrame");

    window.addEventListener('resize', () => {
        const newWidth = parseInt(canvasDiv.clientWidth);
        const scale = newWidth / width;
        gameFrame.style.transform = `scale(${scale})`;
        gameFrame.style.transformOrigin = "0 0";
    }, false);
}