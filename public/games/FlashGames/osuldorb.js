window.onload = function () {
    const url = "osuldorb";
    const width = 660;
    const height = 500;

    const panel = new GamePanel("gameArea", { dimensions: { width, height }, name: "Osuldorb" });
    panel.getCanvas().parentElement.innerHTML =
        `<iframe style="overflow: hidden;margin:0;padding:0;border:0;" width="100%" height="100%"
    src="https://danidre-flash-games.netlify.app/?game=${url}" scrolling="no"></iframe>`;
}