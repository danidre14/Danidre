window.onload = function () {
    const panel = new GamePanel("gameArea", { dimensions: { width: 640, height: 480 }, name: "Miscen...AGAIN!?" });
    panel.getCanvas().parentElement.innerHTML =
        `<iframe style="overflow: hidden;margin:0;padding:0;border:0;" width=640 height=480
    src="https://miscen-again.netlify.app/" scrolling="no"></iframe>`;
}