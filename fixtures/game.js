const descending = ["desc", "descending", "-1"];
const game = {
    find: (options = {}) => {
        const games = [...gamesList()];
        if (options.random === true) {
            games.sort(() => Math.random() - 0.5);
        }
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
            url: "/games/miscen_again",
            newTab: false
        },
        {
            title: "Bob The Brawler",
            minidesc: "Ski Mask Gang are out for you! Beat some baddies in this fast-paced brawler! (>:[=)",
            image: "https://static.jam.vg/raw/0fb/8/z/295ec.png",
            url: "/games/bob_the_brawler",
            newTab: false
        },
        {
            title: "BtBIO PBE",
            minidesc: "Public Beta Environment for Bob the Brawler Multiplayer Game",
            image: "/games/thumbnails/btbio_thumbnail.png",
            url: "https://btbiopbe.danidre.com",
            newTab: true
        },
        {
            title: "Quiz Game",
            minidesc: "Test your intellect with 10 simple questions.",
            image: "https://cdn.pixabay.com/photo/2018/08/31/11/17/quiz-3644414_960_720.png",
            url: "/games/quiz_game",
            newTab: false
        },
        {
            title: "Newgrounds Games",
            minidesc: "Play my other games at Newgrounds.",
            image: "/games/thumbnails/newgrounds_thumbnail.png", // /games/[src.png]
            url: "https://danidre14.newgrounds.com/games",
            newTab: true
        },
        {
            title: "TWHGFM",
            minidesc: "The world's hardest game! (Fan Made)",
            image: "https://danidre-flash-games.netlify.app/thumbnails/twhgfm.png",
            url: "/games/twhgfm",
            newTab: false
        },
        {
            title: "Osuldorb",
            minidesc: "Nielderthands just won't give up.",
            image: "https://danidre-flash-games.netlify.app/thumbnails/osuldorb.png",
            url: "/games/osuldorb",
            newTab: false
        },
        {
            title: "Super Sam Chapter 1",
            minidesc: "There's Super Man, and then there's Super Sam",
            image: "https://danidre-flash-games.netlify.app/thumbnails/superSamChapter1.png",
            url: "/games/super_sam_chapter_1",
            newTab: false
        },
        {
            title: "One Screen For Worlds",
            minidesc: "Ludum Dare 31 Jam: Test your skills, accuracy, patience, and thinking.",
            image: "https://danidre-flash-games.netlify.app/thumbnails/oneScreenForWorlds.png",
            url: "/games/one_screen_for_worlds",
            newTab: false
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
        osuldorb: {
            scripts: ["/games/FlashGames/osuldorb.js"],
            title: "Osuldorb",
            description: `
            During scientific research as a Osuldorb, you went off into another galaxy, with your best friend Chudwe, using the high-tech Derodonal device. At your arrival to a planet you are greeted by many different hostile Nielderthands. During the chaos that broke out, you are separated from the Derodonal device, and now have to find it. Unfortunately for you, these Nielderthands are all very poisonous, which results in death on touch, and Chudwe jumped strait into one. He disintegrated in a flash.

-----
-----
There are also other materials out there that can result in death, since on this planet, almost everything is linked.
-----
You now have to find your way to the Derodonal device, and figure out how to get there. There are signs that may or may not be helpful on the way.
-----
Collect Metons to increase your Mation power. You need at least 500 Mations to power up your Derodonal device.

-----

Movement is unknown. Multiple keys can be pressed to do the same thing.
-----
You have to find out what does what and what goes where.

-----
-----

So unfortunately for this monster species, they die instantly, as in game over, their life is gone.
-----
At least there is an option to start life afresh.
-----
P.S. - Use Z to shoot.

-----


Made in 17 hours for LDJAM
-----
-----

View and rate the entry submission [here](http://ludumdare.com/compo/ludum-dare-33/?action=preview&uid=32791)
            `,
            minidesc: "Nielderthands just won't give up.",
            image: "https://danidre-flash-games.netlify.app/thumbnails/osuldorb.png",
            url: "/games/osuldorb"
        },
        one_screen_for_worlds: {
            scripts: ["/games/FlashGames/oneScreenForWorlds.js"],
            title: "One Screen For Worlds",
            description: `
# Help:
- W - Jump
- A - Left
- D - Right
- R - Restart
- N - Next level

Reach each new door to advance in level.
Collect gems on the way.
***Any wrong movements, and you're sure to glitch through the walls = death! >:D***

-----

# About:

This game was made by Danidre14 in 48 hours, for the Ludum Dare Jam with the theme: Entire Game On One Screen (I started this one day late).

-----
This fast-paced, puzzle solving, path guessing, nerve wrecking sequence game is enough to let you raise of your seat, in both excitement, and rage!
-----
Take your step into these despicable levels, not knowing of when nature would ambush you, or when you'd ambush it. Staying in time with the sequence will prevent you from ending up in a lot of bugs or restarting, but some may want to use that to their advantage.
-----
Test your patience and skill, by collecting as much gems as possible per level.
-----
Note: All levels are beat-able.

-----

# Music:

- Main Menu Music: Chipzel - We Knew
- Level 1 Music: Chipzel - Hello Earth
- Level 2 Music: Chipzel - Focus
- Level 3 Music: Chipzel - Can't Stop Us
- Level 4 Music: Chipzel - Her Heart
- Level 5 Music: Chipzel - To the Sky
- Game Beat Music: Raiden III - Passing Pleasures

-----

# Credits:
- Artwork - Danidre14
- Animations - Danidre14
- Programming - Danidre14
- Sound Effects - Danidre14

-----

# Updates:

Added Easy, Normal, and Hard difficulties.

-----

Fixed the glitch where you could not pass level 4, which was due to a collision error, where I tried to make the character glitch through the wall, if he stayed in that on spot for too long! :\ :]
-----
Fixed bug where the levels would not reset when you win, unless you pressed **'R'**.
# Not based off I Wanna Be the Guy

-----

***Any wrong movements, and you're sure to glitch through the walls = death! >:D***

***Any wrong movements, and you're sure to glitch through the walls = death! >:D***

***Any wrong movements, and you're sure to glitch through the walls = death! >:D***

***Any wrong movements, and you're sure to glitch through the walls = death! >:D***

***Any wrong movements, and you're sure to glitch through the walls = death! >:D***

***Any wrong movements, and you're sure to glitch through the walls = death! >:D***

-----

You are meant to glitch through walls when you move incorrectly. You can also use that to your advantage to win.

-----


            `,
            minidesc: "Ludum Dare 31 Jam: Test your skills, accuracy, patience, and thinking.",
            image: "https://danidre-flash-games.netlify.app/thumbnails/oneScreenForWorlds.png",
            url: "/games/one_screen_for_worlds",
        },
        super_sam_chapter_1: {
            scripts: ["/games/FlashGames/superSamChapter1.js"],
            title: "Super Sam Chapter 1",
            description: `
            Basic idea come from TehPencilsmaster game Decido. All I did was tried to make a game like it, then did lots of random stuff and tada. Now there is a lot like birds, bricks, towers mountains, volcanoes, oceans, oops, I said too much. Controls in the game.
            `,
            minidesc: "There's Super Man, and then there's Super Sam",
            image: "https://danidre-flash-games.netlify.app/thumbnails/superSamChapter1.png",
            url: "/games/super_sam_chapter_1"
        },
        twhgfm: {
            scripts: ["/games/FlashGames/twhgfm.js"],
            title: "TWHGFM",
            description: `This is a fan made version of the 'The Worlds Hardest Game' series by [Stevie Critoph](https://snubby.newgrounds.com/), with added features and difficulty.
           
            -----

            You begin it all as a red box. Go through the worlds collecting the yellow coins and avoiding the enemies. You'll know it's an enemy because it is the only other thing that is not a coin. Enemies do come in 5 colours, but you'll notice as you advance in worlds.
            
            -----
            
            You must, however, collect all the coins, before you advance in level. Collect keys to unlock doors that blocks your path to the green portals.
            
            -----
            
            At the end of each world, you can submit your score to the high score board. The lower the score, the better. The score is based on the number of times you've died.
            
            -----
            
            Music by Snayk: [http://snayk.newgrounds.com/](http://snayk.newgrounds.com/)
            
            -----
            
            Each world has it's own instructions to follow.`,
            minidesc: `You are guaranteed to rage quit. All levels are possible to beat!`,
            image: "https://danidre-flash-games.netlify.app/thumbnails/TWHGFM",
            url: "/games/twhgfm"
        },
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
            
            # How to Play:
            The riddles show you where Miscen is hiding. Press E on an object to make a guess/search for Miscen there. After you find Miscen, return the item to win!
            
            If you guess incorrectly, you lose 10 seconds! Solve the riddles, find Miscen, and return the items before time runs out. 
            
            -----

            # Controls:

            - **[WASD/Arrows]:** Move
            - **[E]:** Interact/Search
            - **[M]:** Show/Hide Riddle Sheet

            -----
            -----

            ## Made for Ludum Dare 46 and Geta Jam 11!
            -----
            # Credits:

            - **Art-** [rbatistadelima](https://twitter.com/rbatistadelima)
            - **Audio/Composer-** [JasmineCooper](https://twitter.com/perennialcoop)
            - **Design-** [TMG](/u/TeaEhmGee)
            - **Programming-** [danidre](/u/danidre)`,
            minidesc: `Why does everything seem to go missing? You've just found Miscen! But…there she goes again…`,
            image: "https://static.jam.vg/content/0fb/8/z/31170.png.480x384.fit.jpg",
            url: "/games/miscen_again"
        }
    }
    return gameLibrary[gameName];
}


module.exports = game;