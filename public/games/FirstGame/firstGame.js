// const high = new HighscoreAPI("b256b190e975c2f1d36973448c0242c9", {optionalSort: "name", optionalName: "Highscores"});
// const high = new HighscoreAPI("203ccd12a854de78516e5d90220bfc6c", {optionalSort: "name", optionalName: "Highscores"});


// (async()=> {
//     await high.connect()
//     await high.showScores("highscoreArea");
// })()

const gema = new GamePanel("gameArea", {dimensions: {width:800, height:400}, name: "Game Demo"});

// const i = gema.getCanvas();
const j = gema.getCanvas().getContext('2d');
function render() {

    j.fillStyle = "black";
    j.fillRect(0, 0, 100, 100);
    bob = {w:gema.canvasWidth(), h: gema.canvasHeight()};
    j.fillText(`W:${bob.w}, H:${bob.h}`, 0, gema.canvasHeight());
}

async function postScore() {
    await high.postScore(parseInt(prompt("Enter Score", 0) || 0));
}