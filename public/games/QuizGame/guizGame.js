var btnA = document.getElementById('gameArea');
btnA.innerHTML = `<p>This quiz has 10 questions:</p><button class="btn btn-primary stqd" onclick="startQuiz()">Start Quiz</button>`;

const high = new HighscoreAPI("669c81fecd729dbb7fa834571125e466", {optionalName: "Most Points"}); //p 
// const high = new HighscoreAPI("b256b190e975c2f1d36973448c0242c9", {optionalName: "Most Points"}); //d
(async()=> {
    await high.connect()
    await high.showScores("highscoreArea");
})()


async function startQuiz () {
    const lock = ["stqd"];
    const scoreA = 5;
    let score = 0;
    await alertDialog("Answer these 10 simple questions", {lock: lock});
    const q1A = await promptDialog(`1. Type word for word without the quotes: "I think this is fun"`, "", {lock: lock}) || '';
    if(q1A.toLowerCase() === "i think this is fun") {
        score += scoreA;
        await alertDialog("You're great at this!", {lock: lock});
    } else {
        await alertDialog("Awww, not exact :(", {lock: lock});
    }
    
    const q2A = await promptDialog(`2. A monkey's favourite fruit? Hint:\n-has 6 letters,\n-starts with 'b'`, "", {lock: lock}) || '';
    if(q2A.toLowerCase() === "banana") {
        score += scoreA;
        await alertDialog("You're a genius", {lock: lock});
    } else {
        await alertDialog("Well, I guess that opinion is subjective.", {lock: lock});
    }
    
    const q3A = await promptDialog(`3. Do you think this is a cool game? Type yes if you agree :D`, "", {lock: lock}) || '';
    if(q3A.toLowerCase() === "yes") {
        score += scoreA;
        await alertDialog("I think so too xD I spent waayyy too much time on this :3", {lock: lock});
    } else {
        score += scoreA;
        await alertDialog("Well, I did rush it for a site update so... :p You get points still =D", {lock: lock});
    }
    
    const q4A = await promptDialog(`4. How many minutes are in one second?`, (1/60), {lock: lock}) || '';
    if(q4A.toLowerCase() == (1/60)) {
        score += scoreA;
        await alertDialog("Someone aced Math class!", {lock: lock});
    } else {
        await alertDialog("You should have kept the answer given to you :3", {lock: lock});
    }
    
    const q5A = await promptDialog(`5. Quick maths, 2 + 2?`, 22, {lock: lock}) || '';
    if(q5A.toLowerCase() == 4) {
        score += scoreA;
        await alertDialog(":O Math Scholarrsss", {lock: lock});
    } else {
        await alertDialog("Did you fall for it this time? xD", {lock: lock});
    }
    
    await alertDialog(`We're about half way there! :thumbs_up:`, {lock: lock});

    const q7A = await promptDialog(`7. What was the answer for number 6?`, 4, {lock: lock}) || '';
    if(q7A.toLowerCase() == 4) {
        score += scoreA;
        await alertDialog("Gotcha! There is no number 6 >:D", {lock: lock});
    } else {
        score += scoreA;
        await alertDialog("Same.", {lock: lock});
    }
    
    const q8A = await confirmDialog(`8. A free question flies your way. Will you take it?`, {lock: lock}) || '';
    if(q8A) {
        score += scoreA;
        await alertDialog("Free things are good. But not all good things are free.", {lock: lock});
    } else {
        await alertDialog("Good things are free. But not all free things are good.", {lock: lock});
    }
    
    const q9A = await promptDialog(`9. What was the first question's answer?\nA)I think\nB)this is fun\nC)All of the above\nD)banana`, "", {lock: lock}, 'D') || '';
    if(q9A.toLowerCase() === "c") {
        score += scoreA;
        await alertDialog("I never thought you'd think it fun :o!", {lock: lock});
    } else {
        score += scoreA;
        await alertDialog("The monkey qu-\nI spent too long thinking of a response here, so have some points still.", {lock: lock});
    }    
    
    let q10A = parseInt(await promptDialog(`10. Given the idea that sheep give hay, and clouds slowly dehydrate, if Steve drives his guitar to martial arts practice every Sunday, how likely is it for you to share this game to a friend, on a scale of 1 to 10?`, 5, {lock: lock}) || 0);
    if(q10A < 1) {
        await alertDialog("Woah, so uhm...no points for you I guess", {lock: lock});
    } else if(q10A > 9) {
        score += 10;
        await alertDialog(":O You get max points!!", {lock: lock});
    } else if (q10A == 5) {
        score += 5;
        await alertDialog("Mutual respect, to be honest", {lock: lock});
    } else {
        score += q10A;
        await alertDialog(`Much appreciated. You get ${q10A} points.`, {lock: lock});
    }

    await alertDialog(`WOOT WOOT! Your final score is ${score}`, {lock: lock});

    await high.postScore(score);
}