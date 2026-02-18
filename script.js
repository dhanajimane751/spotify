console.log("lets start");
let folder = [];
let songhref = [];
let songlist = [];
let currsongidx;
let currsongname;
let prevfoldername;
let currfoldername;
let audio = new Audio();
async function delay() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 10000);
    })
}

async function getfolder() {
    let a = await fetch("http://127.0.0.1:3000/songs");
    let song = await a.text();
    let parser = new DOMParser();
    let html = parser.parseFromString(song, "text/html");
    let songs = html.getElementsByTagName("a");
    for (song of songs) {
        if (song.href.includes("%")) {
            let b = decodeURIComponent(song.href).split("\\")[2];
            folder.push(b);

        }
    }
}
async function getsong(folder) {
    let a = await fetch(`http://127.0.0.1:3000/songs/${folder}`);
    let song = await a.text();
    let parser = new DOMParser();
    let html = parser.parseFromString(song, "text/html");
    let songs = html.getElementsByTagName("a");
    songhref = [];
    songlist = [];
    for (song of songs) {
        if (song.href.includes(".mp3")) {
            songhref.push(decodeURIComponent(song.href).replace(/\\/g, "/")
            );

            songlist.push(song.innerHTML);

        }
    }
}
function lefthtml() {

    document.querySelector(".songlist").innerHTML = ``;
    songlist.forEach((songname, songno) => {


        document.querySelector(".songlist").innerHTML = document.querySelector(".songlist").innerHTML + `<div class="song" data-index="${songno}">
                    <span class="songimg">
                        <img class="invert" src="images/music.svg" alt="Error">
                    </span>
                    <span class="songname">
                        ${songname}
                    </span>
                    <span class="playimg">
                        <img class="invert" src="images/play.svg" alt="Error">
                    </span>
                </div>`

    });

}
async function righthtml() {
    for (f of folder) {
        document.querySelector(".allcard").innerHTML = document.querySelector(".allcard").innerHTML + `<div class="card" data-folder="${f}" >
                    <div class="coverimg">
                        <img src="songs/${f}coverimg.jpg" alt="">
                    </div>
                    <h5 class="fname">
                        ${f.slice(0, -1)}
                    </h5>
                    <div class="info">
                        ${await getinfo(f)}
                    </div>
                    <img class="playcircle" src="images/playcircle.svg" alt="Error">
                </div>`
    }
}
async function getinfo(f) {
    try {
        let a = await fetch(`http://127.0.0.1:3000/songs/${f}new.json`);
        let b = await a.json();
        return b.info;
    }
    catch (e) {
        console.log(e);

    }
}
async function changetheme(songno) {
    lefthtml();
    document.querySelectorAll(".song")[songno].style.backgroundColor = " rgba(0, 221, 255, 0.76)";
    // document.querySelectorAll(".song")[songno].querySelector(".songname").style.color = "black";
    document.querySelectorAll(".song")[songno].querySelector(".playimg img").src = "images/pause2.svg";
}

async function playsong(songno) {
    changetheme(songno);
    //  audio.volume=document.querySelsector(".range").value/100;
    if (currsongidx == songno && currfoldername == prevfoldername) {
        audio.play();
    }
    else {
        audio.src = songhref[songno];
        audio.play();
        console.log("CLicked on the body");
        currsongidx = songno;
        currsongname = songlist[currsongidx];
        document.querySelector(".playingsongname").innerHTML = '. . . ' + `${currsongname}`;
        audio.volume = document.querySelector(".volrange").value / 100;
        prevfoldername = currfoldername;
    }

}

// songlist
document.querySelector(".songlist").addEventListener("click", async (e) => {
    let songdiv = e.target.closest(".song");
    let songno = Number(songdiv.dataset.index);
    console.log(songno);
    playsong(songno);
    document.querySelector(".pause").src = "images/pause.svg";
    let songdivarray = document.getElementsByClassName("song");
    // for(x of songdivarray){
    //     x.style.background="none";
    //     };
    console.log("i am executing");




});

// allcard event
document.querySelector(".allcard").addEventListener("click", async (e) => {
    let carddiv = e.target.closest(".card");
    let foldername = carddiv.dataset.folder;
    console.log(foldername);
    currfoldername = foldername;

    await getsong(foldername);
    lefthtml();
    let carddivarray = document.getElementsByClassName("card");
    for (x of carddivarray) {
        x.style.background = "none";
    };
    console.log("i am executing");

    carddiv.style.backgroundColor = " rgba(76, 164, 76, 0.405)";

});

// pause event
document.querySelector(".pause").addEventListener("click", () => {
    console.log("clicked");
    if (document.querySelector(".pause").src.includes("images/playbut.svg")) {
        document.querySelector(".pause").src = "images/pause.svg";

        if (currsongidx == null) {
            playsong(0);
        }
        else {
            playsong(currsongidx);

        }
        document.querySelector(`[data-index="${currsongidx}"]`).querySelector(".playimg img").src = "images/pause.svg"

    }
    else {
        document.querySelector(".pause").src = "images/playbut.svg";
        audio.pause();
        console.log("else clicked");
        document.querySelector(`[data-index="${currsongidx}"]`).querySelector(".playimg img").src = "images/play.svg"

    }


});

// prev event
document.querySelector(".prev").addEventListener("click", () => {
    if (currsongidx > 0) {
        playsong(currsongidx - 1);
    }
})
// next event
document.querySelector(".next").addEventListener("click", () => {
    console.log("I am triggered");

    if (currsongidx < (songlist.length - 1)) {
        playsong(currsongidx + 1);
    }
});

// volume range event
document.querySelector(".volrange").addEventListener("input", (e) => {
    console.log("volume range is clicked");
    console.log(e.value);

    audio.volume = e.target.value / 100;

});
// currtime format
function currtimeformat(current){
    let min=Math.floor(current/60);
    let sec=Math.floor(current%60);
    if(min<10){
        min='0'+min;
    }
     if(sec<10){
        sec='0'+sec;
    }
    return min+':'+sec;
}
//duration time format
function durtimeformat(duration){
    let min=Math.floor(duration/60);
    let sec=Math.floor(duration%60);
    if(min<10){
        min='0'+min;
    }
     if(sec<10){
        sec='0'+sec;
    }
    return min+':'+sec;
}

// timeupdate of seekbar
audio.addEventListener("timeupdate", (e) => {
    console.log(currtimeformat(audio.currentTime)+'/'+durtimeformat(audio.duration));
    document.querySelector(".timer").innerHTML=currtimeformat(audio.currentTime)+'/'+durtimeformat(audio.duration);
    document.querySelector(".seekbar").value = audio.currentTime / audio.duration * 100;
    document.querySelector(".seekbar").value;
    if ((audio.currentTime / audio.duration) * 100 > 99.5) {
        document.querySelector(".next").click();
        if(audio.paused==true){
           document.querySelector(".pause").src = "images/playbut.svg"; 
        }
        else{
            document.querySelector(".pause").src = "images/pause.svg";
        }
    }
});

//seekbar event
document.querySelector(".seekbar").addEventListener("input", async (e) => {
    //  await delay();
    audio.currentTime = (e.target.value / 100) * audio.duration;
    console.log(audio.currentTime);


})

// mute event
document.querySelector(".volume").getElementsByTagName("button")[0].addEventListener("click", () => {
    if (document.querySelector(".volmute").src.includes("images/vol.svg")) {
        console.log("mute secton clicked");
        document.querySelector(".volmute").src = "images/mute.svg";
        audio.muted = true;
        let volrange = document.querySelector(".volrange");
        console.log("rangestyle changed");

    }
    else {
        console.log("unmute secton clicked");
        document.querySelector(".volmute").src = "images/vol.svg";
        audio.muted = false;
    }
});
// search event
document.querySelector(".searchbox").addEventListener("input", (e) => {
    console.log("Searching...");

    let searchText = e.target.value.toLowerCase();
    console.log(searchText);

    let allsonglistdiv = document.querySelectorAll(".song");
    allsonglistdiv.forEach((songDiv) => {

        let songName = songDiv.querySelector(".songname").innerText.toLowerCase();
        console.log(songName);


        if (songName.includes(searchText)) {
            songDiv.style.display = "flex";
        } else {
            songDiv.style.display = "none";
        }

    });

});


async function main() {
    await getfolder();
    // console.log(folder[0]);

    // console.log(songhref[0]);
    await getsong("Bolo Har Har Har/");
    lefthtml();

    righthtml();


}
main();