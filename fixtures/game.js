const descending = ["desc", "descending", "-1"];
const game = {
    find: (options = {}) => {
        const games = [...gamesList()];
        if (options.sort !== undefined && typeof options.sort === "string" && descending.includes(options.sort)) {
            games.reverse();
        }
        if (options.limit !== undefined && typeof options.limit === "number") {
            games.splice(options.limit);
        }
        return games;
    },
    findOne: (name) => {
        return gamesInformation(name);
    }
};


const gamesList = function () {
    const gameList = [
        /*{
            title: "My First Game",
            minidesc: "The first game of mines.",
            image: "FirstGame/Icon_Rakan.png",
            url: "/games/my_first_game"
        },*/
        {
            title: "Miscen...AGAIN!?",
            minidesc: "Why does everything seem to go missing? You've just found Miscen! But…there she goes again…",
            image: "https://static.jam.vg/content/0fb/8/z/31170.png.480x384.fit.jpg",
            url: "/games/miscen_again"
        },
        {
            title: "Bob The Brawler",
            minidesc: "Ski Mask Gang are out for you! Beat some baddies in this fast-paced brawler! (>:[=)",
            image: "https://static.jam.vg/raw/0fb/8/z/295ec.png",
            url: "/games/bob_the_brawler"
        },
        {
            title: "Quiz Game",
            minidesc: "Test your intellect with 10 simple questions.",
            image: "https://cdn.pixabay.com/photo/2018/08/31/11/17/quiz-3644414_960_720.png",
            url: "/games/quiz_game"
        },
        {
            title: "Newgrounds Games",
            minidesc: "Play my other games at Newgrounds.",
            image: "/games/newgroundsimg.png", // /games/[src.png]
            url: "https://danidre14.newgrounds.com/games"
        }
    ]
    return gameList;
}

const gamesInformation = function (gameName) {
    const gameLibrary = {
        /*my_first_game: {
            scripts: ["/games/FirstGame/firstGame.js"], // /games/[src.js]
            title: "My First Game",
            description: `The first game ever in a world of time and space with a humanitarian face Lorem Ipsum Diplum BloopDomTomLum A Dumbamom.
            Hope you enhoy.`,
            minidesc: `The first game of mines.`,
            image: "FirstGame/Icon_Rakan.png" // /games/[src.png]
        }*/
        quiz_game: {
            scripts: ["/games/QuizGame/guizGame.js"],
            title: "Quiz Game",
            description: `My first game on this website.
            
            Answer 10 simple questions! :D`,
            minidesc: `Test your intellect with 10 simple questions.`,
            image: "https://cdn.pixabay.com/photo/2018/08/31/11/17/quiz-3644414_960_720.png",
            url: "/games/quiz_game"
        },
        bob_the_brawler: {
            scripts: ["/games/BobTheBrawler/script.js"],
            title: "Bob The Brawler",
            description: `# [Bob the Brawler](https://ldjam.com/events/ludum-dare/45/bob-the-brawler)
            [coverimg](https://static.jam.vg/raw/0fb/8/z/28772.jpg)
            ## Made for [Ludum Dare 45](https://ldjam.com/events/ludum-dare/45/games).

            # Objective:
            Start with nothing but your fists, and punch your way into becoming the ultimate brawler!
            Explore numerous maps, fight off endless baddies, and collect powerups/item drops; they make you stronger

            # Drops:
            **Potion-** adds potion to inventory; Space to consume**; (heals increase with difficulty)**
            **Package-** increases max health; gives walls and potions
            **Strength Powerup-** exponentially increases attack power**; (lasts longer with difficulty)**
            **Barrage Powerup-** enters a barrage of auto attacks**; (lasts longer with difficulty)**
            **Range Powerup-** increases attack range and view distance**; (lasts longer with difficulty)**
            
            # Controls:
            **WASD-** Move
            **Space-** Heal
            **Left Mouse-** Attack
            **Right Mouse-** Build
            **Q/P-** Toggle Pause
            **M-** Toggle Mute
            **R-** Restart Game
            **K-** Toggle Fullscreen

            # Story:
            A grave disagreement with the Ski Mask Baddies forces Bob to end his *Building* career for good. However, dissatisfied with just his unemployment, the Baddies are out for his life! Now, **Bob the** previous **Builder** becomes **Bob the Brawler**; living only to defend himself from the Baddies breaking into his warehouse, in hopes of regaining his positions, and...punching off... some steam!! (>:[=)
            *****
            ## Credits:
            **Programming/Design-** [@danidre](/u/danidre)
            **Art/Audio-** [@AXLplosion](/u/AXLplosion)`,
            minidesc: `Ski Mask Gang are out for you! Beat some baddies in this fast-paced brawler! (>:[=)`,
            image: "https://static.jam.vg/raw/0fb/8/z/295ec.png",
            url: "/games/bob_the_brawler"
        },
        miscen_again: {
            scripts: ["/games/MiscenAgain/script.js"],
            title: "Miscen...AGAIN!?",
            description: `# [Miscen...AGAIN!?](https://ldjam.com/events/ludum-dare/46/miscen-again)
            [coverimg](https://static.jam.vg/content/0fb/8/z/31170.png.480x384.fit.jpg)
            ## Made for [Ludum Dare 45](https://ldjam.com/events/ludum-dare/46/games) and [Geta Game Jam 11](https://itch.io/jam/geta-game-jam-11)!

            # You've just found Miscen! But...there she goes again...

            - Why is your charger missing? Your laptop just died because of it! :angry: 
            - Who stole your watering can? Your plants died from having nothing to drink! :sob:

            -----
            -----

            **Miscen** keeps taking your belongings, can you get them back?
            Solve these riddles and find **Miscen** before something goes *horribly wrong*!

            *****

            # Controls:

            - **[WASD/Arrows]:** Move
            - **[E]:** Interact/Search
            - **[M]:** Show/Hide Riddle Sheet

            -----
            -----

            ## Made for Ludum Dare 46 and Geta Jam 11!
            -----
            # Credits:
            **Programming-** [@danidre](/u/danidre)
            **Design-** [@TMG](/u/TeaEhmGee)
            **Art-** [@rbatistadelima](https://ldjam.com/users/rbatistadelima/)
            **Audio/Composer-** [@JasmineCooper](https://twitter.com/perennialcoop)`,
            minidesc: `Why does everything seem to go missing? You've just found Miscen! But…there she goes again…`,
            image: "https://static.jam.vg/content/0fb/8/z/31170.png.480x384.fit.jpg",
            url: "/games/miscen_again"
        }
    }
    return gameLibrary[gameName];
}


module.exports = game;