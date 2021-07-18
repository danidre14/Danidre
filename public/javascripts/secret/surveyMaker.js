const postList = async function(config) {
    try {
        const request = await axios('/api/users/data_username');
        const requestOK = request && request.status === 200;
        if(!requestOK) {
            console.log('Must be logged in')

            return //unable to get username of logged in user
        }
        let user = await request.data;
        if(user === null || user === undefined) return

        const response = await axios({
            method: 'post',
            url: `/u/${user.username}/update`,
            data: config
        });

        let responseOK = response && response.status === 200;
        if (responseOK) {
            const data = await response.data;
            // do something with data

            console.log(data);
            getList();
        }
    } catch (e) {
        console.log(e.message, 'h')
    }
}

//=============================================================================================>
const semiColon = "&scn&";
const ampersand = "&amp;";
const colon = "&cln&";
const comma = "&cma&";
const fullStop = "&fsp&";
const myData = "1&scn&Gender&scn&Male&cln&12&cma&Female&cln&9&cma&Anonymous&cln&4&fsp&1&scn&Age&scn&13 - 15&cln&0&cma&16 - 17&cln&9&cma&18 - 19&cln&15&cma&Anonymous&cln&1&fsp&0&scn&1. What do you think peer pressure is?&scn&Influence of someone on their colleagues&cma&Peers pressure you to do something you dont want&cma&Friends tell you do something stupid constantly.&cma&When someone takes advantage of your free will.&cma&Being forced to want something other people have.&cma&When a group has a big impact on your actions.&cma&When someone is forced into doing somehig they don't want to do.&cma&Influence someone to do something they wont usually do.&cma&When assocuates pressure you in doing something you dont want to do.&cma&When you are pressured into doing things you may not want to do.&cma&The influence an individual's friends have on them.&cma&When your friends pressure you into something.&cma&Pressure put on to make a decision or to do something by peers.&cma&When peers encourage someone to do something.&cma&When peers influence you to make choices.&cma&Acting a certain way to fit in.&cma&Putting good or bad pressure on peers.&cma&Influence of friends/peers on a person.&cma&Influence one have on their peers.&cma&Either positive/negatice advice given in a controuing or emcouraging way.&cma&The influence someone has on one's life.&cma&Being forced to do something.&cma&Influencing your peers to do something.&cma&People pressuring other people.&fsp&1&scn&2. Identify the types of peer pressure that you are aware of:&scn&Positive&cln&0&cma&Negative&cln&3&cma&Both&cln&22&cma&None&cln&0&fsp&1&scn&3. Do you think you have a positive or negative influence on your peers?&scn&Positive&cln&19&cma&Negative&cln&3&cma&Both&cln&3&fsp&0&scn&4. Explain/Give (an) example(s) of your positive and/or negative influence(s) on them:&scn&I encourage them to work.&cma&I influence them to slack off.&cma&Help them through tough times.&cma&Urge them to study.&cma&Duck classes.&cma&Belittle them until they do my will.&cma&Encourage them to work.&cma&Make them study harder.&cma&Help them work harder.&cma&Encourage others to study.&cma&Getting them to study. Partying.&cma&Encourage them to be better.&cma&I encourage them to do their work.&cma&Encourage them to do their best in everything.&cma&I influence them to drink.&cma&I promote them to enjoy life and do work.&cma&Make them keep doing something even when they don't feel like doing it.&cma&I encourage them to do illegal things.&cma&Encourage them in activities and music.&cma&Encourage people to read.&cma&Encourage them to do their work and follow their dreams.&cma&Encourage them to embrace their differences, do their schoolwork, and worship God.&cma&Encourage them to focus on their goals and ignore negativity.&cma&I try to guide them on a good path.&cma&I encourage them to do their work.&cma&Encourage friends to attend/skip class.&cma&Encourage them to do work.&fsp&1&scn&5. Do you think your peers have a positive or negative influence on you?&scn&Positive&cln&19&cma&Negative&cln&3&cma&Both&cln&2&cma&None&cln&1&fsp&0&scn&6. Explain/Give (an) example(s) of their positive and/or negative influence(s) on you:&scn&They encourage me to exercise.&cma&Sometimes they make me reach to class late.&cma&Encourage me to work and pray.&cma&Make me do work.&cma&Encourage me to be social.&cma&Encourage me to be better.&cma&Encourage me to be good.&cma&Force me to seek help.&cma&Making me study.&cma&Make me skip classes.&cma&They encourage me to work.&cma&They encourage me to be true to myself.&cma&Encourage me to do well in school.&cma&Influence me to do work more.&cma&Influence me to have fun and play games.&cma&Make me keep doing something when they don't feel like doing it.&cma&They encourage me to do good stuff.&cma&They encourage me to smoke or drink.&cma&Talk me out of doing non sense&cma&Encourage me to push on and do what I love.&cma&Encourages me to do better in every aspect of my life [school, attitude].&cma&They encourage me to do the right thing all times, pursue my goals, and we practice honesty.&cma&They motivate me to do better when I want to give up.&cma&Encourage me to do my work.&cma&Encourage me to get better grades or slack off.&cma&Encourage me to do dumb stuff.&fsp&1&scn&7. Do you think peer pressure affects academic performance?&scn&Yes&cln&20&cma&No&cln&5&cma&No reply&cln&0&fsp&0&scn&8. If yes, how so? Explain/Give example(s) of pos and/or neg effects of PP on academic performance:&scn&Encouraging other friends to study.&cma&Pursuade them into skipping class.&cma&Competing for highest grades.&cma&Encourage to avoid classes.&cma&Failing exams, being dumb, teacher problems&cma&Pressured to leave/duck school.&cma&Partying and leaving school.&cma&Make your skip/duck classes.&cma&Makes you miss assignments.&cma&Forced to study and pass exams.&cma&How often you study. How you perform.&cma&Influence can distract you from work etc.&cma&Encouraging/motivating you to study hard.&cma&Help each other.&cma&Influence one to attend class and study.&cma&Drugs can cause someome to slack off from school.&cma&Bullying can lower self esteem and confidence.&cma&Negatives may be ditching and slacking off. Positives may be studying, homework etc.&cma&Negative pp makes you unmotivated. Positive pp makes you feel able to accomplish the impossible.&cma&They can encourage you to do your work and this can motivate you to do better which is a positive pp&cma&Positive pressure can motivate someone to do good. Negative pressure can make them fall behind.&cma&I can either deteriorate one's mark or raise it to the optimum level it can reach via person.&cma&Pressure for other things can take away time to do school work.&cma&Doing dumb stuff.&fsp&1&scn&9. Do you think peer pressure affects extra-curricular activities?&scn&Yes&cln&14&cma&No&cln&10&cma&No reply&cln&1&fsp&0&scn&10. If yes, how so? Explain/Give example(s) of pos and/or neg effects of PP on extra-cur activities:&scn&Challenges to be the best.&cma&Influence them to play sports.&cma&Make them skip school for sports.&cma&Encourage them to join sports and be active.&cma&Bring you down for being bad.&cma&Encourage you to join clubs&cma&May influence one to stay away from clubs.&cma&Influence them to skip the activity.&cma&How often you train.&cma&Keeping you interested in the sport.&cma&Motivate to train harder.&cma&Pressured into devoting all time into activities, and loss in school work.&cma&Positives- encourage to join and be poductive. Negatives- encourage disruptions within the club.&cma&Positive pp can make you stay true to everyone's good thoughts amd strive to be the best at sport.&cma&Parents can affect their children's mindset on their ability to do activities.&cma&One can either be successful due to the motivation or fail as it takes away from academics.&cma&Encourage to join many extra-curricular activities.&cma&Doing dumb stuff.&fsp&0&scn&11. What advice would you give on encouraging positive peer pressure?&scn&Keep influencing peers to strive for greatness.&cma&Continue encouraging others to do good.&cma&Do something good with life.&cma&Be nice and promote positive vibes&cma&Follow your role models.&cma&Follow those that encourage you to do right.&cma&Do onto others as you want them do unto you.&cma&Help encourage others to do better.&cma&Choose friends who support your goals.&cma&Set standards and me a good example.&cma&Do onto others as you would want them to do unto you.&cma&Make sure to positively pressure someone to get better as a person.&cma&You should positively pressure them.&cma&Hang out with people like you.&cma&Set a good example to others.&cma&Just do it.&cma&Push peers to do better amd always be the positive friend.&cma&Peers should push each other to be better in every aspect of their lives and embrace differences.&cma&Motivate someone to do good cause 'what goes around comes back around'.&cma&Encourage it and rewards can be given.&cma&Its good.&cma&To do work.&fsp&0&scn&12. What advice would you give on coping/dealing with negative peer pressure?&scn&Hang around better friends. Try not to do it just to fit in.&cma&Cut out/off the negativity.&cma&Be your own self.&cma&Cut them off.&cma&Learn to live alone.&cma&Ignore negative people.&cma&Ignore them.&cma&Find someone you trust to get advice.&cma&Be sure of your morals and don't compromise them.&cma&Choose new friends.&cma&Try your best to do the right thing.&cma&Develop awareness and coping skills to it.&cma&Distance yourself from negative people.&cma&Ignore the negatives and it may eventually stop.&cma&Be resilient and block them out.&cma&Don't indulge in it.&cma&Talk to family or trusted friend.&cma&Seek a counsellor or health professional.&cma&Be strong minded. Get new friends.&cma&Take it with a grain of salt. Negative things usually gice you motivation to prove them wrong.&cma&It's okay to be different. Be you for you; not for anyone else.&cma&Be confident with yourself and never let anyone pressure you into being accepted.&cma&Focus on what you can achieve instead of pleasing others.&cma&Avoid bad company and consult a trusted adult.&cma&Talk to an adult or teacher.&cma&Hold a singular standard and know right from wrong.&cma&Ignore.&fsp&0&scn&13. What do you think can be done to rause awareness about coping with peer pressure?&scn&Advertisements on TVs or radios, assembly in school, via drama presentations, or in theatres.&cma&Boost self esteem by telling them they are enough.&cma&School visits amd lectures.&cma&Make it a mandatory PD topic in all schools.&cma&Have someone speak/lecture on it during assembly.&cma&Seminars, interactive teem open discussion.&cma&Speak sbout it in schools.&cma&Have groups that show you ways to overcome peer pressure.&cma&Class sessions educating on the topic.&cma&Seminars and counselling.&cma&Talking about it or doing minor activities for positive peer pressure.&cma&Let experts visit schools to educate young minds.&cma&Educate about the effects.&cma&Counselling or sessions in schools as classes.&cma&Speeches on its importance in schools can help.&cma&Support groups to build confidence.&cma&A support group to build confidence.&cma&Advertisements on local television can raise awareness.&cma&Posters, public awareness campaigns on how to deal with it.&cma&Public education.&cma&IDK&cma&Protect."
var editorMode = false;
var autoFill = false;
var div;
var listdiv;
var currFileName = "New Survey";
var listFiles = {};
var questions = [];
window.onload = function() {
    div = document.getElementById("ttbody");
    listdiv = document.getElementById("ttlist");
    toggleMode("dev", false);
    toggleMode("auto", false);
    getList();
}
window.addEventListener('beforeunload', function (e) {
    // the absence of a returnValue property on the event will guarantee the browser unload happens
    // delete e['returnValue'];
    // Cancel the event
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = '';
});
const getList = async function() {
    const request = await axios('/api/users/data_secret');
    const requestOK = request && request.status === 200;
    if(!requestOK) {
        console.log('Must be logged in')

        return //unable to get username of logged in user
    }
    let user = await request.data;
    if(user === null || user === undefined) return
    listFiles = user.secret.surveyMaker; //get all elements inside surveyMaker model and save it as files
    let htm = ``;
    let j = 0;
    htm = `<div class="bigbound">`;
    for(let i in user.secret.surveyMaker) {
        if(user.secret.surveyMaker[i] === null) continue;
        j++;
        htm += `<div class="listbox box">
                    <div class="listbtn" onclick="loadFile('${i}')">${i}</div>
                    <button class="small deny button" onclick="removeFile('${i}')">Remove</button>
                </div>`;
    }
    if(j === 0) htm += '<div class="listbox box">No survers found. Create a survey below.</div>';
    htm += `</div>`;
    listdiv.innerHTML = htm;  
}

const removeFile = async function(fileName) {
    if(!confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone!`)) return; //self explanatory

    try {
        const request = await axios('/api/users/data_username'); //fix this
        const requestOK = request && request.status === 200;
        if(!requestOK) {
            console.log('Must be logged in')

            return //unable to get username of logged in user
        }
        let user = await request.data;
        if(user === null || user === undefined) return

        const response = await axios({
            method: 'delete',
            url: `/u/${user.username}/update`,
            data: {
                target: 'surveyMaker',
                key: fileName
            }
        });

        let responseOK = response && response.status;
        if (responseOK) {
            const data = await response.data;
            // do something with data
            console.log(data);
            getList();
        }
    } catch (e) {
        console.log(e.message, 'h')
    }

}

const loadFile = function(fileName) {
    currFileName = fileName;
    loadProgress(listFiles[currFileName]);
}

const toggleMode = function(target, mode) {
    if(target == "dev") {
        if(mode == undefined) {
            editorMode = !editorMode;
        } else {
            editorMode = mode;
        }
        document.getElementById("devM").innerText = "Editor Mode: " + (editorMode? "On" : "Off");
    } else if(target == "auto") {
        if(mode == undefined) {
            autoFill = !autoFill;
        } else {
            autoFill = mode;
        }
    }
    updateQuestions();
}
const changeVal = function(target, id, jd) { 
    try {
        if(target == "question") {
            questions[id].name = (prompt("Change question: ", questions[id].name) || questions[id].name).trim();
        } else if(target == "answerC") {
            questions[id].answer[jd].name = (prompt("Change question: ", questions[id].answer[jd].name) || questions[id].answer[jd].name).trim();
        } else if(target == "answerO") {
            questions[id].answer[jd] = (prompt("Change question: ", questions[id].answer[jd]) || questions[id].answer[jd]).trim();
        }
    } catch(e) {console.log(e.message)}
    updateQuestions();
}
const swapVal = function(dir, target, id, jd) {
    var temp;
    id = parseInt(id);
    jd = parseInt(jd);
    switch(dir) {
        case "up":
            switch(target) {
                case "question":
                    if(id > 0) {
                        temp = questions[id];
                        questions[id] = questions[id - 1];
                        questions[id - 1] = temp;
                    }
                break;
                case "answer":
                    if(jd > 0) {
                        temp = questions[id].answer[jd];
                        questions[id].answer[jd] = questions[id].answer[jd - 1];
                        questions[id].answer[jd - 1] = temp;
                    }
                break;
            }
        break;
        case "down":
            switch(target) {
                case "question":
                    if(id < (questions.length - 1)) {
                        temp = questions[id];
                        questions[id] = questions[id + 1];
                        questions[id + 1] = temp;
                    }
                break;
                case "answer":
                    if(jd < (questions[id].answer.length - 1)) {
                        temp = questions[id].answer[jd];
                        questions[id].answer[jd] = questions[id].answer[jd + 1];
                        questions[id].answer[jd + 1] = temp;
                    }
                break;
            }
        break;
    }
    updateQuestions();
}
const removeVal = function(target, id, jd) {
    switch(target) {
        case "question":
            if(!autoFill) if(!confirm('Confirm deletion of question:\n"' + questions[id].name + '"')) return;
            questions.splice(id, 1);
        break;
        case "answerC":
            if(!autoFill) if(!confirm('Question:\n"' + questions[id].name + '"\nConfirm deletion of choice option:\n"' + questions[id].answer[jd].name + ':' + questions[id].answer[jd].value +'"')) return;
            questions[id].answer.splice(jd, 1);
        break;
        case "answerO":
            if(!autoFill) if(!confirm('Question:\n"' + questions[id].name + '"\nConfirm deletion of response:\n"' + questions[id].answer[jd] + '"')) return;
            questions[id].answer.splice(jd, 1);
        break;
    }
    updateQuestions();
}
const duplicateVal = function(target, id, jd) {
    var temp;
    id = parseInt(id);
    jd = parseInt(jd);
    switch(target) {
        case "question":
            temp = cloneVar(questions[id]);
            for(var i = questions.length; i > (id + 1); i--)
                questions[i] = questions[i - 1];
            questions[id + 1] = temp;
        break;
        case "answer":
            temp = cloneVar(questions[id].answer[jd]);
            for(var j = questions[id].answer.length; j > (jd + 1); j--)
                questions[id].answer[j] = questions[id].answer[j - 1];
            questions[id].answer[jd + 1] = temp;
        break;
    }
    
    updateQuestions();
}
const addQuestion = function(closed) {
    var name = "Question " + (questions.length + 1);
    if(!autoFill) name = prompt(`Enter ${closed?'closed':'open'} ended question:`) || "";
    if(name.trim() == "") return;
    questions.push({closed: closed, name: name, answer:(closed? (!autoFill? [] : [{name: "Yes", value: 0}, {name: "No", value: 0}]) : (!autoFill? [] : ["Random opinion 1", "Response example 2"]))});
    updateQuestions();
}
const addPoint = function(id, jd) {
    questions[id].answer[jd].value++;
    updateQuestions();
}
const removePoint = function(id, jd) {
    if(questions[id].answer[jd].value > 0) questions[id].answer[jd].value--;
    updateQuestions();
}
const addOption = function(id) {
    var name = "Option " + (questions[id].answer.length + 1);
    if(!autoFill) name = prompt("Enter option:") || "";
    if(name.trim() == "") return;
    questions[id].answer.push({name: name, value: 0});
  
    updateQuestions();
}
const addResponse = function(id) {
    var resp = prompt("Enter response: ") || "";
    if(resp.trim() == "") return;
    questions[id].answer.push(resp);
    
    updateQuestions();
}
const cloneVar = function(data) {
    if(data === null || typeof data !== "object") return data;    
    var temp = new data.constructor();
    for(var key in data)
        temp[key] = cloneVar(data[key]);    
    return temp;
}
const saveProgress = function(str) {
    let fileName = prompt("Enter Survey Name: ", currFileName);
    if(fileName === null) return;
    else filename = fileName.trim();
    if(listFiles[fileName] && fileName !== currFileName) { //if file exists, and it isnt the current file
        if(!confirm(`"${fileName}" already exists. Do you want to over-write it?`)) return; //self explanatory
    }
    //here, a new file name will be, or they will save/update the existing file

    var s = "";
    
    for(var i in questions) {
        s += questions[i].closed + semiColon;
        s += questions[i].name.replace(/&/g, ampersand) + semiColon;
        if(questions[i].closed) {
            for(var j in questions[i].answer) {
                s += questions[i].answer[j].name.replace(/&/g, ampersand) + colon;
                s += questions[i].answer[j].value + comma;
            }
        } else {
            for(var j in questions[i].answer)
                s += questions[i].answer[j].replace(/&/g, ampersand) + comma;
        }
        s = s.substr(0, s.length - 5);
        s += fullStop;
    }
    s = s.substr(0, s.length - 5);

    currFileName = fileName;
    postList({target: 'surveyMaker', key: fileName, value: s});
    
}
const loadProgress = function(str) {
    
    var s = str? str : myData;
    
    
    questions = [];
    
    s = s.split(ampersand).join('&');
    var ques = s.split(fullStop);
    var vars, closed, name, answers, answer, ans;
    
    for(var i in ques) {
        vars = ques[i].split(semiColon);
        closed = vars[0] == 1? 1 : 0;
        name = vars[1];
        if(vars[2] != undefined) answers = vars[2].split(comma);
        else answers = [];
        answer = [];
        if(closed) {
            for(var j in answers) {
                ans = answers[j].split(colon);
                answer.push({name: ans[0], value: ans[1]});
            }
        } else {
            for(var j in answers) {
                answer.push(answers[j]);
            }
        }
        
        questions.push({name:name, closed: closed, answer: answer});
    }
    
    updateQuestions();
}

const newFile = function() {
    if(!confirm(`Are you sure you want to create a new survey? Unsaved files would be lost.`)) return;
    currFileName = "New Survey";
    questions = [];
    updateQuestions();
}
const updateQuestions = function() {
    var htm = '';
    if(editorMode) {
        htm += '<div class="middle"> <button class="normal warn button" onclick=toggleMode(\'auto\')>Autofill: ' + (autoFill? "On" : "Off") + '</button><button class="normal warn button" onclick="newFile()">New</button> <br /></div>';
    }
    if(editorMode) {
        for(var i in questions) {
            htm += '<div class="box"> <span class="normal" onclick="changeVal(\'question\', \'' + i + '\')">' + questions[i].name.replace(/&/g, ampersand).replace(/</g, '&lt;').replace(/>/g, '&gt;') + ' (' + (questions[i].closed? "Closed" : "Open") + ' Ended)</span> <br /> <button class="small inquire button" onclick="swapVal(\'up\', \'question\', \'' + i + '\')">Up</button> <button class="small inquire button" onclick="swapVal(\'down\', \'question\', \'' + i + '\')" >Down</button> <button class="small inquire button" onclick="duplicateVal(\'question\', \'' + i + '\')">Duplicate</button> <button class="small deny button" onclick="removeVal(\'question\', \'' + i + '\')" >Remove</button>';
            if(questions[i].closed) {
                for(var j in questions[i].answer)
                    htm += '<div class="box"> <span class="small" onclick="changeVal(\'answerC\', \'' + i + '\', \'' + j + '\')" >' + questions[i].answer[j].name.replace(/&/g, ampersand).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '[' + questions[i].answer[j].value + ']</span> <button class="small button" onclick="removePoint(\'' + i + '\', \'' + j + '\')">-</button> <br /> <button class="tiny inquire button" onclick="swapVal(\'up\', \'answer\', \'' + i + '\', \'' + j + '\')" >Up</button> <button class="tiny inquire button" onclick="swapVal(\'down\', \'answer\', \'' + i + '\', \'' + j + '\')" >Down</button> <button class="tiny inquire button" onclick="duplicateVal(\'answer\', \'' + i + '\', \'' + j + '\')" >Duplicate</button> <button class="tiny deny button" onclick="removeVal(\'answerC\', \'' + i + '\', \'' + j + '\')" >Remove</button> </div>';
                htm += '<button class="small accept button" onclick="addOption(\'' + i + '\')">Add Choice Option</button>';
            } else {
                htm += '<div class="bigbound">';
                for(var j in questions[i].answer)
                    htm += '<div class="box"> <span class="small" onclick="changeVal(\'answerO\', \'' + i + '\', \'' + j + '\')" >' + questions[i].answer[j].replace(/&/g, ampersand).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span> <br /> <button class="tiny inquire button" onclick="swapVal(\'up\', \'answer\', \'' + i + '\', \'' + j + '\')" >Up</button> <button class="tiny inquire button" onclick="swapVal(\'down\', \'answer\', \'' + i + '\', \'' + j + '\')" >Down</button> <button class="tiny inquire button" onclick="duplicateVal(\'answer\', \'' + i + '\', \'' + j + '\')" >Duplicate</button> <button class="tiny deny button" onclick="removeVal(\'answerO\', \'' + i + '\', \'' + j + '\')" >Remove</button> </div> ';
                htm += '</div>';
            }
            htm += '</div> <br />';
        }
    } else {
        for(var i in questions) {
            htm += '<div class="cont"> <div class="normal">' + questions[i].name.replace(/&/g, ampersand).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
            if(questions[i].closed) {
                for(var j in questions[i].answer)
                    htm += '<button class="small button" onclick="addPoint(\'' + i + '\', \'' + j + '\')">+</button>&nbsp;<span class="small">' + questions[i].answer[j].name.replace(/&/g, ampersand).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;') + '[' + questions[i].answer[j].value + ']</span> ';
            } else {
                htm += '<div class="smallbound">';
                for(var j in questions[i].answer)
                    htm += '<div class="box small">' + questions[i].answer[j].replace(/&/g, ampersand).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
                htm += '</div> <button class="small button" onclick="addResponse(\'' + i + '\')">Add Response</button>';
            }
            htm += '</div>';
        }
    }
    if(editorMode) {
        htm += '<div class="middle"> <button class="normal accept button" onclick="addQuestion(0)">Add Open Ended</button> <button class="normal accept button" onclick="addQuestion(1)">Add Closed Ended</button> </div> ';
    } else {
        htm += '<div class="middle cont"> <span class="big">Questions: ' + questions.length + '</span></div>';
    }
    div.innerHTML = htm;
    document.getElementById("CF").innerText = currFileName;
}

const scrollToTop = function() {
    var elmnt = document.getElementById("devM");
    elmnt.scrollIntoView();
}