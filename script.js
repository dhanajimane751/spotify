console.log("Auto Spotify Started");

// ===== EDIT ONLY IF YOUR REPO NAME CHANGES =====
const username = "dhanajimane751";
const repo = "spotify";
// ===============================================

let folder = [];
let songhref = [];
let songlist = [];
let currsongidx = null;
let currfoldername = null;
let audio = new Audio();


// ===============================
// FETCH FOLDERS FROM GITHUB
// ===============================
async function getfolder() {

    folder = [];

    let res = await fetch(
        `https://api.github.com/repos/${username}/${repo}/contents/songs`
    );

    let data = await res.json();

    for (let item of data) {
        if (item.type === "dir") {
            folder.push(item.name);
        }
    }
}


// ===============================
// FETCH SONGS FROM SELECTED FOLDER
// ===============================
async function getsong(foldername) {

    songhref = [];
    songlist = [];

    let res = await fetch(
        `https://api.github.com/repos/${username}/${repo}/contents/songs/${foldername}`
    );

    let data = await res.json();

    for (let item of data) {
        if (item.name.endsWith(".mp3")) {
            songlist.push(item.name);
            songhref.push(item.download_url);
        }
    }
}


// ===============================
// CREATE RIGHT FOLDER CARDS
// ===============================
function righthtml() {

    let container = document.querySelector(".allcard");
    container.innerHTML = "";

    for (let f of folder) {

        container.innerHTML += `
            <div class="card" data-folder="${f}">
                <div class="coverimg">
                    <img src="songs/${f}/coverimg.jpg">
                </div>
                <h5>${f}</h5>
            </div>
        `;
    }
}


// ===============================
// CREATE SONG LIST
// ===============================
function lefthtml() {

    let container = document.querySelector(".songlist");
    container.innerHTML = "";

    songlist.forEach((song, index) => {

        container.innerHTML += `
            <div class="song" data-index="${index}">
                <span class="songname">${song}</span>
            </div>
        `;
    });
}


// ===============================
// PLAY SONG
// ===============================
function playsong(index) {

    currsongidx = index;

    audio.src = songhref[index];
    audio.play();

    document.querySelector(".playingsongname").innerHTML =
        "Now Playing: " + songlist[index];
}


// ===============================
// EVENTS
// ===============================

document.querySelector(".allcard").addEventListener("click", async (e) => {

    let card = e.target.closest(".card");
    if (!card) return;

    currfoldername = card.dataset.folder;

    await getsong(currfoldername);
    lefthtml();
});


document.querySelector(".songlist").addEventListener("click", (e) => {

    let song = e.target.closest(".song");
    if (!song) return;

    playsong(Number(song.dataset.index));
});


document.querySelector(".pause").addEventListener("click", () => {
    audio.paused ? audio.play() : audio.pause();
});


document.querySelector(".next").addEventListener("click", () => {
    if (currsongidx < songlist.length - 1) {
        playsong(currsongidx + 1);
    }
});


document.querySelector(".prev").addEventListener("click", () => {
    if (currsongidx > 0) {
        playsong(currsongidx - 1);
    }
});


document.querySelector(".volrange").addEventListener("input", (e) => {
    audio.volume = e.target.value / 100;
});


// ===============================
// START
// ===============================
async function main() {

    await getfolder();
    righthtml();

}

main();
