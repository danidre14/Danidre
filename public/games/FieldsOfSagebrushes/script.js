window.onload = function () {
    window.render = () => { }
    const width = 800;
    const height = 450;
    const iwidth = 1024;
    const iheight = 576;
    const panel = new GamePanel("gameArea", { dimensions: { width, height, lock: false }, name: "Fields of Sagebrushes" });
    const canvasDiv = panel.getCanvas().parentElement;
    canvasDiv.innerHTML =
        `<iframe id="gameFrame" style="overflow: hidden;margin:0;padding:0;border:0;" width=${iwidth} height=${iheight}
    src="https://fieldsofsagebrushes.netlify.app/" scrolling="no"></iframe>`;
    const gameFrame = document.getElementById("gameFrame");

    const resizeFunction = () => {
        const newWidth = parseInt(canvasDiv.clientWidth);
        const scale = newWidth / width * 0.78125;
        gameFrame.style.transform = `scale(${scale})`;
        gameFrame.style.transformOrigin = "0 0";
    }
    window.addEventListener('resize', resizeFunction, false);
    resizeFunction();
}