window.onload = function () {
    window.render = () => { }
    const width = 800;
    const height = 600;
    const iwidth = 800;
    const iheight = 600;
    const panel = new GamePanel("gameArea", { dimensions: { width, height, lock: false }, name: "Rogot Slide" });
    const canvasDiv = panel.getCanvas().parentElement;
    canvasDiv.innerHTML =
        `<iframe id="gameFrame" style="overflow: hidden;margin:0;padding:0;border:0;" width=${iwidth} height=${iheight}
    src="https://rogot-slide-ld47.netlify.app/" scrolling="no" allowFullScreen="true"></iframe>`;
    const gameFrame = document.getElementById("gameFrame");

    const resizeFunction = () => {
        const newWidth = parseInt(canvasDiv.clientWidth);
        const scale = newWidth / width;
        gameFrame.style.transform = `scale(${scale})`;
        gameFrame.style.transformOrigin = "0 0";
    }
    window.addEventListener('resize', resizeFunction, false);
    resizeFunction();
}