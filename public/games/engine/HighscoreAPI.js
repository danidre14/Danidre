const HighscoreAPI = function (key, options) {
   if(!key || typeof key !== "string") {
       console.error("Highscore key missing.");
       return {};
   }
    const KEY = key;
    const DOMAIN = options? options.domain || "" : "";

    let SCORES = {
        list: [],
        user: {}
    };
    let USERNAME = '';
    let LOGGEDIN = false;
    let CONNECTED = false;
    let PAGE = 1;
    let MAXPAGES = 1;
    let ELEMBOARD = null;
    let NAME = options? options.optionalName || "" : "";
    NAME = NAME.trim();

    let optionalSort = options? options.optionalSort || "score" : "score";
    optionalSort = ['name', 'score', 'date'].includes(optionalSort.trim()) ? optionalSort : "score";

    let optionalOrder = options? options.optionalOrder || 1 : 1;
    if(optionalOrder > 1 || optionalOrder == 0) optionalOrder = 1;
    else if(optionalOrder < -1) optionalOrder = -1;


    const connect = async function() {
        if(CONNECTED) return //console.log("Already connected to highscores.");
        try {
            const request = await axios(`${DOMAIN}/api/users/data_loggedIn`);
            const requestOK = request && request.status === 200 && request.statusText === 'OK';
            if(requestOK) {
                const data = await request.data;
                LOGGEDIN = data.loggedId || false;
            }

            const request2 = await axios({
                method: 'post',
                url: `${DOMAIN}/api/games/highscores/connect`,
                data: {key: KEY}
            });

            const request2OK = request2 && request2.status === 200 && request2.statusText === 'OK';
            if (request2OK) {
                const data2 = await request2.data;

                if(data2.res === "Error") {
                    console.error(data2.msg);
                } else if(data2.res === "Success") {
                    if(NAME === "") NAME = data2.name || "HighScore";
                    CONNECTED = true;
                    USERNAME = data2.userName;
                    // console.log(data2.msg);
                }
            }
        } catch (e) {
            console.error("Can't connect to highscores:", e.message);
        }
    }

    const postScore = async function(score) {
        if(!CONNECTED) return console.error("Not connected to highscores.");
        
        if(!LOGGEDIN || score === undefined || score === null || typeof score !== "number") return;

        try {
            const request = await axios({
                method: 'post',
                url: `${DOMAIN}/api/games/highscores/post_score`,
                data: {key: KEY, userName: USERNAME, score: score}
            });

            const requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                const data = await request.data;
                if(data.res === "Error")
                    console.error(data.msg);
                else if(data.res === "Success") {}
                    //console.log(data.msg);
                if(ELEMBOARD) await showScores();
            }
        } catch (e) {
            console.error("Can't post highscores:", e.message);
        }
    }

    const getScores = async function(nav) {
        if(!CONNECTED) return console.error("Not connected to highscores.");
        try {
            const request = await axios({
                method: 'post',
                url: `${DOMAIN}/api/games/highscores/get_scores`,
                data: {key: KEY, sort: optionalSort, nav: nav, page: PAGE}
            });

            const requestOK = request && request.status === 200 && request.statusText === 'OK';
            if (requestOK) {
                const data = await request.data;


                if(data.res === "Error")
                    console.error(data.msg);
                else if(data.res === "Success") {
                    SCORES = data.scores;
                    PAGE = data.page;
                    MAXPAGES = data.maxPages;
                    //console.log(data.msg);
                }

            }
        } catch (e) {
            console.error("Can't get highscores:", e.message);
        }
        return {
            scores: SCORES,
            page: PAGE,
            maxPages: MAXPAGES
        }
    }

    const prevScore = async function() {
        await showScores(null, 'prev');
    }

    const nextScore = async function() {
        await showScores(null, 'next');
    }

    const showScores = async function(elemID, nav) {
        if(!CONNECTED) {
            console.error("Not connected to highscores.");
        } else {
            await getScores(nav);
        }

        if(!ELEMBOARD) ELEMBOARD = document.getElementById(elemID);
        const canPrev = (PAGE > 1) ? true : false;
        const canNext = (PAGE < MAXPAGES) ? true : false;

        let scoreH = "";
        let hasScore = false;
        for(const i in SCORES.list) {
            if(!hasScore) hasScore = true;
            const rank = ((PAGE-1) * SCORES.limit) + parseInt(i) + 1;
            const h = SCORES.user.rank === rank? `highscore-score-grid-selected` : '';
            scoreH += `
                <div class="highscore-score-grid-container ${h}">
                    <div class="highscore-score-grid-rank">${rank}.</div>
                    <div class="highscore-score-grid-name"> <a href="/u/${SCORES.list[i].name}" target="_blank" rel="noreferrer">${SCORES.list[i].name}</a></div>
                    <div class="highscore-score-grid-score">${SCORES.list[i].score}</div>
                </div>
            `;
        }
        if(!CONNECTED) {
            scoreH = `
            <div class="highscore-score-grid-norank"><i>Highscore Board Broken. <a href="/contact">Click here to report it.</a></i></div>
        `;
        } else if(!hasScore) scoreH = `
            <div class="highscore-score-grid-norank"><i>No scores yet.<br/>Be the first to set a high score!.</i></div>
        `;

        let scoresH = `<div class="highscore-board">
            <div class="highscore-title-grid-container">
                <div class="highscore-name div-align-around">${NAME}</div>
                <div class="highscore-pagin">
                    <button id="prevBtn" class="btn btn-primary">◀</button>
                    <span class="highscore-page">Page ${PAGE} of ${MAXPAGES}</span>
                    <button id="nextBtn" class="btn btn-primary">▶</button>
                </div>
            </div>
            <div class="highscore-content">
                ${scoreH}
            </div>`;
        if(CONNECTED) {
            scoresH += `<div class="highscore-content">`;
            if(SCORES.user.loggedIn && SCORES.user.hasScore) {
                scoresH += `
                    <div class="highscore-score-grid-container">
                        <div class="highscore-score-grid-rank">${SCORES.user.rank}.</div>
                        <div class="highscore-score-grid-name"><a href="/u/${SCORES.user.name}" >${SCORES.user.name}</a></div>
                        <div class="highscore-score-grid-score">${SCORES.user.score}</div>
                    </div>
                `;
            } else if(SCORES.user.loggedIn && !SCORES.user.hasScore) {
                scoresH += `
                    <div class="highscore-score-grid-norank"><i>Play to add score.</i></div>
                `;
            } else {
                scoresH += `
                    <div class="highscore-score-grid-norank"><i><a href="/signin">Sign in</a> to add a score.</i></div>
                `;
            }
            scoresH += `</div>`;
        }
        
        scoresH += `</div>`;

        ELEMBOARD.innerHTML = scoresH;

        const prevBtn = document.getElementById('prevBtn');
        prevBtn.removeAttribute('id');
        if(canPrev) {
            prevBtn.onclick = prevScore;
        } else {
            prevBtn.disabled = true;
        }
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.removeAttribute('id');
        if(canNext) {
            nextBtn.onclick = nextScore;
        } else {
            nextBtn.disabled = true;
        }
    }

    return {
        connect,
        postScore,
        getScores,
        showScores
    }
}