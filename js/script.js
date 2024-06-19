let currentSong = new Audio
let songs;
let currFolder;
let cardConatiner = document.querySelector('.cardContainer')

function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00/00"
    }
    // Calculate the number of minutes
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    // Combine minutes and seconds in the desired format
    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    console.log(as);

    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    //get all the songs in playlist

    let songUl = document.querySelector('.songList').getElementsByTagName("ul")[0]
    songUl.innerHTML = ""


    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> <img class="invert" src="/images/music.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ")}</div>
                                    <div>Sonu Nigam</div>
                                </div>
                                <div class="playNow">
                                    <span>Play Now</span>
                                    <img class="invert" src="images/play.svg" alt="palynow">
                                </div>
            </li>`
    }
    // Attach ean event listner
    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', ((element) => {
            playMusic(e.querySelector('.info').firstElementChild.innerHTML)

        }))
    });
    return songs

}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "images/pause.svg"

    }
    document.querySelector('.songInfo').innerHTML = decodeURI(track)
    document.querySelector('.songTime').innerHTML = "00/00/00"

}

async function displayAlbhums() {
    let a = await fetch(`/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs/")) {
            let folder = (e.href.split("/").slice(-2)[0]);
            // Get the metadata of the folder

            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json()
            console.log(response);
            cardConatiner.innerHTML = cardConatiner.innerHTML + `
                    <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <!-- Circle background -->
                                <circle cx="12" cy="12" r="12" fill="green" />
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="black" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="" />
                        <h3>${response.title}</h3>
                        <p>${response.descriptions}</p>
                    </div>
            `


        }

    }
    //Load the playlist when clicked on card 

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}


async function main() {
    // Attach an event listner button  previos,play and next
    await getSongs("songs/cs")
    playMusic(songs[0], true)
    // console.log(songs);

    // Display all the albhum on the page
    displayAlbhums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause.svg"
        } else {
            currentSong.pause()
            play.src = "images/play.svg"

        }
    })

    //  Listen to timeupdate

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector('.songTime').innerHTML =
            `${convertSecondsToMinutes(currentSong.currentTime)}/
        ${convertSecondsToMinutes(currentSong.duration)}`
        document.querySelector('.circle').style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //add event listner to seekbar

    document.querySelector('.seekbar').addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector('.circle').style.left = percent * 100 + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100


    })
    //add event listner to hamburger

    document.querySelector('.hamburger').addEventListener("click", (e) => {
        document.querySelector('.left').style.left = "0"

    })

    //add event listner for close button

    document.querySelector('.close').addEventListener("click", (e) => {
        document.querySelector('.left').style.left = "-130%"

    })
    //add event listner for pre and next 
    previos.addEventListener("click", () => {
        console.log("Previos clicked !!");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log(index);
        if ((index - 1) >= 0) {
            playMusic(songs[index + 1])
        }
        console.log(currentSong);


    })
    next.addEventListener("click", () => {
        console.log("next clicked !!");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log(index);
        if ((index + 1) < songs.length - 1) {
            playMusic(songs[index + 1])
        }
    })

    //add event to volume
    document.querySelector('.range').getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume ", e.target.value, "/100");
        currentSong.volume = parseInt(e.target.value) / 100
    })


    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })


}
main()