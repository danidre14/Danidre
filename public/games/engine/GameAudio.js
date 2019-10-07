/*
Functions we want
Object GameAudio has:

audios={};

defaultSourceFolder='audio/'
--where it will look for audio if none stated
defaultFileType = 'mp3';
--file extension if none stated

setDefaultSourceFolder(source)
setDefaultFileType(source)
setDefaults({source, type})

create(audioName, audioSrc) //adds audio
--make it default to look for audio in default audio folder variable or 'audio/' folder if none found- if no source specified
--use audioName as the audio name in src if no src specified
--make it default to look for extension in default src folder variable or 'mp3' folder if none found- if no source specified

get(audioName) //returns audio object to root folder for raw accessing

play(audioName)
pause(audioName)
stop(audioName)
restart(audioName)

playLoop(audioName) //play audio in loop

playOnce(audioName) //play audio once

mute(audioName) //unmute one
unmute(audioName) //unmute one
togglemute(audioName) //toggle mute one

muteAll() //mutes all
unmuteAll() //unmutes all
togglemuteAll() //toggle mutes all

pauseAll() //pauses all
stopAll() //stops all

setVolume(audioName, [1-100]) or setVolume(audioName, vol, max)
//sets volume of one to either val between 100, or val in max range stated (relative to master volume)
setVolumeAll([1-100]) or setVolumeAll(vol, max)
//sets volume of all to either val between 100, or val in max range stated (relative to master volume)
setVolume([1-100]) or setVolume(vol, max)
//sets volume of master volume (when no name is identified)
getVolume(audioName) //gets volume of one
getVolume() //gets master volume (when no name is identified)

return:
    setDefaultSourceFolder
    setDefaultFileType
    setDefaults
    create
    get
    play
    pause
    stop
    restart
    playLoop
    playOnce  
    mute
    unmute
    togglemute
    muteAll
    unmuteAll
    togglemuteAll
    pauseAll
    stopAll
    getVolume
    setVolume
    setVolumeAll

*/

const GameAudio = function (options) {
    /*options can have
        source; type
    */
    let audios = {};
    let volume = 1;

    let defaultSourceFolder = options? options.source? options.source : 'audio' : 'audio';
    let defaultFileType = options? options.type? options.type : 'mp3' : 'mp3';

    const setDefaultSourceFolder = function (source) {
        defaultSourceFolder = source;
    }
    const setDefaultFileType = function (type) {
        defaultFileType = type;
    }
    const setDefaults = function (options) {
        //options would be {source:'source', type:'type'}
        if (options.source) setDefaultSourceFolder(options.source);
        if (options.type) setDefaultFileType(options.type);
    }

    const create = function () {
        return new Promise(async(resolve, reject) => {
            for(const i in arguments)
                await innerCreate(arguments[i]);
            resolve();
        });
    }
    const innerCreate = function (currStack) {
        return new Promise((resolve, reject) => {
            let audioName;
            let audioSrc;

            if (typeof currStack === 'string') {
                audioName = currStack;
            } else if (typeof currStack === 'object') {
                audioName = currStack[0];
                audioSrc = currStack[1];
            }
            //if already exists
            if (audios[audioName]) {
                console.error(`Cannot create "${audioName}": Audio file already exists.`);
                return resolve();
            }

            const src = audioSrc ? audioSrc : `${defaultSourceFolder}/${audioName}.${defaultFileType}`;
            const audio = new Audio(src);
            audio.onloadeddata = function () {
                audios[audioName] = {};
                audios[audioName].audioObj = audio;
                audios[audioName].volume = 1;
                resolve();
            }
            audio.onerror = function () {
                if (audios[audioName])
                    delete audios[audioName];
                resolve();
            }
        });
    }

    const get = function(audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot get "${audioName}": Audio file does not exists.`);
        }
        return audios[audioName].audioObj;
    }


    const play = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot play "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.play();
    }


    const pause = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot pause "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.pause();
    }


    const stop = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot stop "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.pause();
        audios[audioName].audioObj.currentTime = 0;
        audios[audioName].audioObj.loop = false;
    }


    const restart = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot restart "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.pause();
        audios[audioName].audioObj.currentTime = 0;
        audios[audioName].audioObj.play();
    }


    const playLoop = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot play "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.play();
        audios[audioName].audioObj.loop = true;
    }


    const playOnce = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot play "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.pause();
        audios[audioName].audioObj.currentTime = 0;
        audios[audioName].audioObj.play();
        audios[audioName].audioObj.loop = false;
    }


    const mute = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot mute "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.muted = true;
    }


    const unmute = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot unmute "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.muted = false;
    }


    const togglemute = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot toggle mute "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.muted = !audios[audioName].audioObj.muted;
    }


    const muteAll = function (audioName) {
        for (const audioName in audios)
            audios[audioName].audioObj.muted = true;
    }


    const unmuteAll = function (audioName) {
        for (const audioName in audios)
            audios[audioName].audioObj.muted = false;
    }


    const togglemuteAll = function (audioName) {
        for (const audioName in audios)
            audios[audioName].audioObj.muted = !audios[audioName].audioObj.muted;
    }


    const pauseAll = function (audioName) {
        for (const audioName in audios)
            audios[audioName].audioObj.pause();
    }


    const stopAll = function (audioName) {
        for (const audioName in audios) {
            audios[audioName].audioObj.pause();
            audios[audioName].audioObj.currentTime = 0;
        }
    }

    const getVolume = function (audioName) {  //gets volume of one, or master volume (when no name is identified)
        if (!audioName) {
            return volume;
        } else {
            //if does not exist
            if (!audios[audioName]) {
                return console.error(`Cannot set volume of "${audioName}": Audio file does not exists.`);
            }
            return audios[audioName].audioObj.volume;
        }
    }


    const setVolume = function (audioName, par1, par2) {
        let range;
        let max;
        let tempVolume;
        if (typeof audioName !== "string") {
            tempVolume = volume * 100;
            range = audioName || tempVolume;
            max = par1 || 100;

            tempVolume = range / max || volume;

            if (tempVolume > 1) tempVolume = 1;
            if (tempVolume < 0) tempVolume = 0;
            volume = tempVolume;


            for (const audioNames in audios)
                audios[audioNames].audioObj.volume = audios[audioNames].volume * volume;
        } else {
            //if does not exist
            if (!audios[audioName]) {
                return console.error(`Cannot set volume of "${audioName}": Audio file does not exists.`);
            }
            tempVolume = audios[audioName].volume * 100;
            range = par1 || tempVolume;
            max = par2 || 100;

            tempVolume = range / max || volume;

            if (tempVolume > 1) tempVolume = 1;
            if (tempVolume < 0) tempVolume = 0;
            audios[audioName].volume = tempVolume;

            audios[audioName].audioObj.volume = audios[audioName].volume * volume;
        }
    }


    const setVolumeAll = function (par1, par2) {
        let range;
        let max;
        let tempVolume;

        for (const audioName in audios) {
            tempVolume = audios[audioName].volume * 100;
            range = par1 || tempVolume;
            max = par2 || 100;

            tempVolume = range / max || volume;

            if (tempVolume > 1) tempVolume = 1;
            if (tempVolume < 0) tempVolume = 0;
            audios[audioName].volume = tempVolume;

            audios[audioName].audioObj.volume = audios[audioName].volume * volume;
        }
    }

    return {
        setDefaultSourceFolder,
        setDefaultFileType,
        setDefaults,
        create,
        get,
        play,
        pause,
        stop,
        restart,
        playLoop,
        playOnce,
        mute,
        unmute,
        togglemute,
        muteAll,
        unmuteAll,
        togglemuteAll,
        pauseAll,
        stopAll,
        getVolume,
        setVolume,
        setVolumeAll
    }
}