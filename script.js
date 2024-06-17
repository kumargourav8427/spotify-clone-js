let currentSong = new Audio

function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid Input"
    }
    // Calculate the number of minutes
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds = String(remainingSeconds).padStart(2,'0');
    // Combine minutes and seconds in the desired format
    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs() {
    let a = await fetch('http://127.0.0.1:3000/songs/')
    let response = await a.text()
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    console.log(as);

    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('mp3')) {
            songs.push(element.href.split('/songs/')[1])
        }
    }
    return songs;
}

const playMusic = (track,pause=false) => {
    // let audio = new Audio("/songs/"+track)
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
        play.src = "images/pause.svg"

    }
    document.querySelector('.songInfo').innerHTML = decodeURI(track)
    document.querySelector('.songTime').innerHTML = "00/00/00"

}

async function main() {
    // 
    //get all the songs
    let songs = await getSongs()
    playMusic(songs[0],true)
    console.log(songs);

    let songUl = document.querySelector('.songList').getElementsByTagName("ul")[0]

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
            console.log(e.querySelector('.info').firstElementChild.innerHTML);
            playMusic(e.querySelector('.info').firstElementChild.innerHTML)

        }))
    });
    // Attach an event listner button  previos,play and next
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
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector('.songTime').innerHTML =
            `${convertSecondsToMinutes(currentSong.currentTime)}/
        ${convertSecondsToMinutes(currentSong.duration)}`
        document.querySelector('.circle').style.left = 
        (currentSong.currentTime/currentSong.duration) * 100 + "%";
    })

    //add event listner to seekbar

    document.querySelector('.seekbar').addEventListener("click",(e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) *100
        document.querySelector('.circle').style.left = percent * 100 + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100


    })




}
main()