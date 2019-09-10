const selectSubjects = function(list, subs) {
    var p = [], i, x, y, tempg = [];
    for(i in subs)
        p.push(subs[i]);
    
    var pds = {};  
    var gotSub = false;
    var g = -1;
    for(x in list) { //periods 
        g++;
        gotSub = false;
        for(i in p) { //subjects
            for(y in list[x]) { //subjects in period
                tempg = [];
                if(p[i] === list[x][y]) {
                    pds[g] = list[x][y];
                    tempg.push(list[x][y]);
                    gotSub = true;
                    break;
                }
            }
            if(gotSub) break;            
        }
        for(y in list[x]) { //subjects in period
            if(Mandatory(list[x][y])) {
                tempg.push(list[x][y]);
            }                
        }
        
        pds[g] = tempg;
    }
    
    return pds;
}
const getSubjects = function(list, subs) {
    var p = [], i; 
    for(i in subs)
        p.push(subs[i]);
    
    subs = sortByPriority(p);
    
    var pds = {}, pbs = {};
    var gotSub = exist = false;
    var v = []; //subject categories
    var g = -1;
    for(var i in subs) { //look at each subject
        g = -1;
        for(var x in list) { //look at the choices
            g++;
            gotSub = false;
            for(var y in list[x]) { //compare choices in that category
                if(!pds[g]) {
                    if(!pbs[subparent[list[x][y]]]) {
                        if(subs[i] === list[x][y] || subparent[subs[i]] === list[x][y] || subs[i]  === subparent[list[x][y]]) { //if( subs[i] === list[x][y] || subparent[subs[i]] === subparent[list[x][y]]) {
                            v.push(list[x][y]);
                            pbs[subparent[list[x][y]]] = pds[g] = gotSub = true;
                            break;
                        }
                    }
                }
            }
            if(gotSub) break;
        }
    }    
    return v;
}
const Mandatory = function(sub) {
    for(var i in comlist) {
        if(comname[comlist[i]] === comname[sub]) {
            return true;
        }
    }
    return false;
}
const addCompulsory = function(name, com, number) {
    if(number !== undefined && typeof number === "number") {
        for(var x = 1; x <= number; x++) {
            window[com+""+x] = com+" "+x;
            comparent[com+" "+x] = com;
            comname[com+" "+x] = name;
            infoparent[com+" "+x] = com;
            infoname[com+" "+x] = name;
        }
    }
    window[com] = com;
    comparent[com] = com;
    comparent[name] = com;
    comname[com] = name;
    comname[name] = name;
    infoparent[com] = com;
    infoparent[name] = com;
    infoname[com] = name;
    infoname[name] = name;
    comlist.push(com);
}
const addSubject = function(name, sub, number) {
    var type, amt;

    if(number !== undefined && typeof number === "number") {
        for(var x = 1; x <= number; x++) {
            window[sub+""+x] = sub+" "+x;
            subparent[sub+" "+x] = sub;
            subname[sub+" "+x] = name;
            infoparent[sub+" "+x] = sub;
            infoname[sub+" "+x] = name;
        }
        if(number === 4)     
            type = "T";
        else
            type = "S";
        amt = number;
    } else {
        type = "P";
        amt = 1;
    }
    window[sub] = sub;
    subparent[sub] = sub;
    subparent[name] = sub;
    subname[sub] = name;
    subname[name] = name;
    infoparent[sub] = sub;
    infoparent[name] = sub;
    infoname[sub] = name;
    infoname[name] = name;
    sublist.push(sub);
    
    subinfo[sub] = {type:type, amt:amt};
}
const period = function() {
    return sortByPriority(arguments);
}
const formT = function() {
    return arguments;
}
const subjects = function() {
    return arguments;
}
const day = function(L6, U6) {
    return {"Lower 6":L6, "Upper 6":U6};
}
const cloneObject = function(obj) {
    if(obj === null || typeof(obj) !== 'object')
        return obj;

    var temp = []; 
    // var temp = new obj.constructor(); 
    for(var key in obj)
        temp[key] = cloneObject(obj[key]);

    return temp;
}
const sortByPriority = function(list) { 
    var p = [], temp, empty = true;
    for(var i in list)
        p.push(list[i]);
    //p.sort();
    while(true) { 
        empty = true;
        for(var i = 0; i < p.length-1; i++) {
            if((subinfo[subparent[p[i]]].type === "T" && subinfo[subparent[p[i+1]]].type !== "T") ||  (subinfo[subparent[p[i]]].type === "S" && subinfo[subparent[p[i+1]]].type === "P")) { 
                temp = p[i];
                p[i] = p[i+1];
                p[i+1] = temp;
                empty = false;
                break;
            }
        }
        if(empty === true) break;
    }
    
    return p;
}
const addElement = function(element, name) {
    var op = document.createElement(element);
    for(var i = 2; i < arguments.length; i++)
        op.setAttribute(arguments[i][0], arguments[i][1]);
    op.appendChild(document.createTextNode(name));
    return op;
}
const removeArr = function(obj, index) {
    ob = [];
    for(var i in obj)  if(i != index) ob.push(obj[i]);      
    return ob;
}
const chooseForm = function(f) {
    var form = ["Lower 6", "Upper 6"];
    if(window.form == undefined && f == undefined) return window.form = form[0];
    else if(f !== undefined) {
        window.form = form[f];
        pickFormAndSubs();
    }
}
const updateSubjectList = function(allS, yourS, shuffle) {
    var allSubjects = cloneObject(allS), yourSubjects = cloneObject(yourS);
    window.yS = cloneObject(yourS);
    window.aS = cloneObject(allS);
    var i;
    allSubjects.sort();
    if(!shuffle) yourSubjects = sortByPriority(yourSubjects);
        
    var allSD = document.getElementById("all_subjects");
    allSD.innerHTML = "";
    var yourSD = document.getElementById("your_subjects");
    yourSD.innerHTML = "";
    
    for(i in allSubjects)
        allSD.innerHTML += '<span class="btn-primary" style="width:100%;word-wrap:break-word;display:block;border:solid black 1px;padding:.5rem 0;" onclick="carrySubject(\'' + allSubjects + '\', \'' + yourSubjects + '\', ' + parseInt(i) + ', \'aToy\',true)">' + subname[allSubjects[i]] + '</span>';
    for(i in yourSubjects)
        yourSD.innerHTML += '<span class="btn-primary" style="width:100%;word-wrap:break-word;display:block;border:solid black 1px;padding:.5rem 0;" onclick="carrySubject(\'' + yourSubjects + '\', \'' + allSubjects + '\', ' + parseInt(i) + ', \'yToa\')">' + subname[yourSubjects[i]] + '</span>';
    
    if(yourSubjects.length >= 1) {
        var ctt = cloneObject(Choices[form]); //all subject choices
        var possibilities = perm(cloneObject(ctt));
        var tsubsA = [];
        var tsubsB = [];
        for(let pos in possibilities) {
            tsubsA = getSubjects(possibilities[pos], yourSubjects);
            if(tsubsA.length === yourSubjects.length) {
                if(!containsSame(tsubsB, tsubsA.join('-'))) {
                    tsubsB.push(tsubsA.join('-'));
                }
            }
        }
        if(tsubsB.length === 0) {
            yourSD.innerHTML += '<br/><p style="font-size:.8rem !important;margin:.6rem;">No possible choices with this combination of subjects.</p>';
        } else {
            var tsubsC = [];
            var subT = "";
            yourSD.innerHTML += '<br/><p style="font-size:.8rem !important;margin:.6rem;">Possible subject choices:</p>';
            for(let pos in tsubsB) {
                tsubsC = tsubsB[pos].split('-');
                subT = "";
                for(let posB in tsubsC)
                    subT += '<span style="background-color:grey;padding:.3rem;margin:.3rem;color:white;border-radius:.5rem;display:inline-block">' + tsubsC[posB] + '</span>';
                yourSD.innerHTML += '<div style="text-align:center;background-color:darkgrey;margin:.6rem;padding:.5rem;border-radius:.5rem;"><p style="margin:0;display:inline-block;color:black;font-size:1rem !important;">Choice ' + parseInt(parseInt(pos) + 1) + '</p><br/><div style="background-color:lightgrey;border-radius:.5rem;">' + subT + '<br/><button style="padding:.3rem;margin:.3rem;font-size:.6rem !important;" class="btn btn-primary" onclick="setupTimeTable(\'' + tsubsB[pos] + '\')">Choose</button></div><div>';
            }
        }
    }
}
const containsSame = function(obj, val) {
    for(var i in obj)
        if(obj[i] === val) return true;
    return false;
}
const perm = function(xs, num) {
    let ret = [];
    try {
    
    for (let i = 0; i < xs.length; i = i + 1) {
        let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));
        
        if(!rest.length) {
            ret.push([xs[i]])
        } else {
            for(let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }
    return num? ret.length : ret;
    } catch (e) {
        
    }
}
const carrySubject = function(aS, yS, index, order, max) {
    aS = aS.split(",");  
    yS = yS.split(","); if(yS[0] === "") yS = [];
    
    var temp = aS[index];
    var swapped = false;
    
        if(max) {
            for(var i in yS)
                if(yS[i] !== temp && subinfo[yS[i]].type === "T" && subinfo[temp].type === "T") {
                    aS = removeArr(aS, index);
                    aS.push(yS[i]);
                    yS = removeArr(yS, i);
                    yS.push(temp);
                    swapped = true;
                    break;
                }
        }
    if((!max || (max && yS.length < 4)) && !swapped) {        
        yS.push(temp);
        aS = removeArr(aS, index);
    }
    updateSubjectList(order==='aToy'?aS:yS, order==='aToy'?yS:aS);
    
}
const pickFormAndSubs = function() { //choose form
    chooseForm();
    var element = '<div class="hptt">Choose Your Form</div><div style="text-align:center;font-size:2.1rem;font-weight:500;" id="theFormClassName">' + form + '</div><table style="width:100%;text-align:center;"><tr><th class="btn btn-primary" onclick="chooseForm(0)">Lower 6</th><th class="btn btn-primary" onclick="chooseForm(1)">Upper 6</th></tr></table><br/>';

    //choose subjects
    element += '<div style="text-align:center;"><div class="hptt">Choose Your Subjects</div><table style="width:100%;text-align:center;"><tr><th>All Subjects</th><th>Your Subjects</th></tr><tr><td id="all_subjects" style="word-wrap:break-word;vertical-align:top;width:50%;"></td><td id="your_subjects" style="word-wrap:break-word;vertical-align:top;width:50%;"></td></tr></table></div>';
    
    mainD.innerHTML = element;
    
    updateSubjectList(window.aS || sublist, window.yS || []);
}
const setupTimeTable = function(yS) {
    var subs = yS.split("-");
    
    var dtt = [Mon[form], Tue[form], Wed[form], Thu[form], Fri[form]];
    window.yourSubjects = subs;
    window.timetable = getTable(dtt, subs);

    displayTimeTable(true, true);
}
const displayTimeTable = function(showd, showl, change) { //displaying time table!
    var element = "";
    var tt = Merge(times, timetable);
    var day = ["Time", "Mon", "Tue", "Wed", "Thu", "Fri"];
    var periodsN = 6, daysN = 6;
    var subs = yourSubjects;
    var w = 100/daysN, h;
    var dP, dR;
    getLegend(change);
    
    element += '<span style="display:block;width:100%;background-color:black;color:white;" onclick="pickFormAndSubs()">Sixth Form Government (' + form + ')</span><div class="hptt" style="display:block;width:100%;background-color:black;color:white;">Time Table</div>';
    element += '<table style="width:100%;table-layout:fixed;"><tr>';
    for(var i in tt)
        element += '<th class="ptth" style="width:' + w + '%;background-color:black;color:white;">' + (day[parseInt(i)]) + '</th>';
    var lunchAdded = false;
    element += '</tr>';
    for(var j = 0; j < periodsN; j++) {
        element += '<tr style="width:100%;">';
        for(var i = 0; i < daysN; i++) {
            if(j == 2 && !lunchAdded) {
                if(i==0) {
                    element += '<td class="pttd" style="width:' + w + '%;height:50px;border:2px solid black;">';
                    element += '<span style="display:flex;flex-wrap:wrap;justify-content:space-around;align-content:space-around;text-align:center;width:100%;height:50%;background-color:grey;color:black;">' + '10:00AM' + '</span>';
                    element += '<span style="display:flex;flex-wrap:wrap;justify-content:space-around;align-content:space-around;text-align:center;width:100%;height:50%;background-color:grey;color:black;">' + '10:15AM' + '</span>';
                    element += '</td>';
                } else {
                    element += '<td class="pttd" colspan="' + 5 + '" style="width:' + w + '%;height:50px;border:2px solid black;">';
                    element += '<span style="display:flex;flex-wrap:wrap;justify-content:space-around;align-content:space-around;text-align:center;width:100%;height:100%;background-color:darkgrey;color:black;">' + (showd? 'Supervised Box Lunch Distribution' : '') + '</span>';
                    element += '</td>';
                    break;
                }
            } else {
                element += '<td class="pttd" style="width:' + w + '%;height:50px;border:2px solid black;">';
                if(tt[i][j][0] !== undefined) {
                    h = 100/(tt[i][j].length);
                    for(var k in tt[i][j]) {
                        dR = tt[i][j][k];
                        dP = infoparent[dR];
                        element += '<span style="display:flex;flex-wrap:wrap;justify-content:space-around;align-content:space-around;text-align:center;width:100%;height:' + h + '%;background-color:' + (legend[dP]!==undefined?legend[dP][0] : 'grey') + ';color:' + (legend[dP]!==undefined?legend[dP][1] : 'black') + ';">' + ((showd || (i == 0))? dR : '') + '</span>';
                    }
                } else {
                    element += '<span style="display:flex;flex-wrap:wrap;justify-content:space-around;align-content:space-around;text-align:center;width:100%;height:100%;background-color:lightgrey;color:black;">' + ((showd || (i == 0))? 'Free' : '') + '</span>';
                }
            }
            element += '</td>';
        }
        if(j == 2 && !lunchAdded) {
            j = 1;
            lunchAdded = true;
        }
        element += "</tr>";
    }
    element += "</tr></table>";
    element += '<span style="display:block;width:100%;background-color:black;color:white;">';
    var et = "";
    for(var i in subs)
        et += subname[subs[i]] + ", ";
    element += et.substr(0, et.length-2) + '</span><span style="display:block;width:100%;background-color:black;color:white;">';
    et = "";
    for(var i in subs)
        et += subs[i] + ", ";
    element += et.substr(0, et.length-2) + '</span>';
    element += '<span style="display:block;width:100%;background-color:black;color:white;" onclick="displayTimeTable(' + showd + ',' + !showl + ')">Legend (' + (showl? 'Hide' : 'Show') + ')</span>';
    if(showl) {
        for(var i in legend)
            element += '<span style="display:block;width=100%;text-align:center;background-color:' + legend[i][0] + ';color:' + legend[i][1] + ';">' + keys[i] + (showd? ' (' + i + ')' : '') + '</span>';
        element += '<span style="display:block;width=100%;text-align:center;background-color:lightgrey;">Supervised Box Lunch Distribution</span>';
    }
        
    element += '<br/><button class="btn btn-primary" onclick="pickFormAndSubs()">Back</button> ';
    element += '<button class="btn btn-primary" onclick="displayTimeTable(' + !showd + ',' + showl + ')">' + (showd? 'Hide' : 'Show') + ' Details</button> ';    
    element += '<button class="btn btn-primary" onclick="displayTimeTable(' + showd + ',' + showl + ',true)">Re-Colour</button>';
    
    mainD.innerHTML = '<div style="text-align:center;font-size:0.8rem;">' + element + '</div>';
}
const getTable = function(tt, subs) {
    var p = [];
    for(var i in tt) {
        p.push(selectSubjects(tt[i], subs));
    }
    return p;
}
const getLegend = function(change) {
    if(change) colours = shuffle(colours);
    var cols = colours;
    var tt = timetable, p = [], cP = [], cN = [], key = 0, inP, inN;
    for(var i in tt) {
        for(var j in tt[i]) {
            for(var k in tt[i][j]) {
                inP = infoparent[tt[i][j][k]];
                if(!p[inP]) {
                    inN = infoname[tt[i][j][k]];
                    cN[inP] = cols[key++];
                    cP[inP] = inN;
                    p[inP] = true;
                }
            }
        }
    }
    window.keys = cP;
    window.legend = cN;
}
const Merge = function() {
    var obj = [];
    for(var i in arguments)
        if(typeof arguments[i] === "object")
            for(var j in arguments[i])
                obj.push(arguments[i][j]);
        else
            obj.push(arguments[i]);
    return obj;
}
const shuffle = function() {
    var p = [], temp, j;
    if(arguments.length === 1)
        for(var i in arguments[0])
            p.push(arguments[0][i]);
    else
        for(var i in arguments)
            p.push(arguments[i]);
            
    for(var i in p) {
        temp = p[i];
        j = Math.floor(Math.random() * p.length);
        p[i] = p[j];
        p[j] = temp;
    }
    
    return p;
} 
var sublist = [], subinfo = {}, subparent = {}, subname = {}, comlist = [], comparent = {}, comname = {}, infoparent = {}, infoname = {};
addCompulsory("Carib/Comm Plenary", "Plenary");
addCompulsory("Assembly", "Assembly");
addCompulsory("Committee/Department Meeting", "Meeting");
addCompulsory("Co-Curricular Activities", "CoCurr");
addCompulsory("Personal Development", "PD", 6);
addSubject("History", "Hist");
addSubject("Economics", "Econ", 2);
addSubject("Mathematics", "Maths", 2);
addSubject("Sociology", "Soc", 2);
addSubject("Environmental Science", "EnviSci");
addSubject("Caribbean Studies", "Carib", 4);
addSubject("Communication Studies", "Comm", 4);
addSubject("BMED", "BMED");
addSubject("Biology", "Bio", 2);
addSubject("Literature", "Lit");
addSubject("Geography", "Geo");
addSubject("Entrepreneurship", "Entre");
addSubject("EET", "EET");
addSubject("Accounting", "Acc");
addSubject("French", "Fren");
addSubject("Chemistry", "Chem");
addSubject("Physics", "Phys");
addSubject("Spanish", "Span");
addSubject("Business", "Bus");

//Upper 6
const choice1 = period(Hist, Econ2, Maths2, Soc1, EnviSci, Carib4, Comm4);
const choice2 = period(BMED, Bio2, Lit, Econ1, Maths1, Geo, Entre, Carib3, Comm3);
const choice3 = period(Bio1, Phys, Span, Bus, Carib2, Comm2);
const choice4 = period(Acc, Fren, Soc2, Chem, EET, Carib1, Comm1);
//Lower 6
const choice5 = period(BMED, Bio2, Lit, Econ1, Maths1, Geo, Entre, Comm1, Carib1);
const choice6 = period(Hist, Econ2, Maths2, Soc1, EnviSci, Carib2, Comm2);
const choice7 = period(Acc, Fren, Soc2, Chem, Carib3, Comm3);
const choice8 = period(Bio1, Phys, Span, Bus, Carib4, Comm4);

const Mon = day(formT(Merge(Plenary), choice8, choice8, choice6, choice7, choice5), formT(Merge(Plenary), choice1, choice1, choice3, choice2, choice4));
const Tue = day(formT(choice8, choice5, choice5, Merge(Meeting), choice6, choice7), formT(choice1, choice4, choice4, Merge(Meeting), choice3, choice2));
const Wed = day(formT(choice6, Merge(choice5, PD5), Merge(Assembly), Merge(choice7, PD2), choice7, choice8), formT(choice3, Merge(choice4, PD5), Merge(Assembly), Merge(choice2, PD2), choice2, choice1));
const Thu = day(formT(choice7, Merge(choice6, PD3), choice6, choice5, Merge(choice8, PD1), Merge(PD4, CoCurr)), formT(choice2, Merge(choice3, PD3), choice3, choice4, Merge(choice1, PD1), Merge(PD4, CoCurr)));
const Fri = day(formT(choice5, choice8, choice7, choice6, Merge(BMED, PD6, CoCurr), Merge(CoCurr)), formT(choice4, choice1, choice2, choice3, Merge(PD6, CoCurr), Merge(CoCurr)));

const Choices = day(formT(choice8, choice7, choice6, choice5), formT(choice1, choice2, choice3, choice4));

const times = [[["7:30AM", "8:45AM"], ["8:45AM", "10:AM"], ["10:15AM", "11:30AM"], ["11:30AM", "12:45PM"], ["12:45PM", "2:00PM"], ["2:00PM", "3:00PM"]]];

var colours = [["darkblue", "white"], ["green", "white"], ["blue", "white"], ["yellow", "black"], ["red", "black"], ["purple", "white"], ["cyan", "black"], ["orange", "black"], ["lightgreen", "black"]];

window.onload = function() {
    var body = document.getElementById("ttbody");    
    body.setAttribute("oncontextmenu", "event.preventDefault();");
    var main = addElement("div", "", ["id", "main"]);
    body.appendChild(main);
    window.mainD = document.getElementById("main");
    
    pickFormAndSubs(); //ask user form
}