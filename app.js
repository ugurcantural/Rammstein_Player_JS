const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const songBar = document.querySelector("#songBar");
const musicDiv = document.querySelector("#music-list");
//zaten ul bir tane olduğu için direkt tanımladık
const ul = document.querySelector("ul");

songBar.addEventListener("click", () => {
    if (musicDiv.style.display == "none") { musicDiv.style.display = "block"; }
    else { musicDiv.style.display = "none"; }
});

const player = new MusicPlayer(musicList);

//sayfa load olduğunda yapılacaklar
window.addEventListener("load", () => {
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingState();
});

function displayMusic(music) {
    title.innerText = music.title;
    singer.innerText = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
};

play.addEventListener("click", () => {
    //container playing içeriyor mu?
    const isPlay = container.classList.contains("playing");
    isPlay ? pauseMusic() : playMusic();
});

prev.addEventListener("click", () => {
    prevMusic();
});

next.addEventListener("click", () => {
    nextMusic();
});

function prevMusic() {
    player.prev();
    let music = player.getMusic();
    displayMusic(music);    
    playMusic();
    isPlayingState();
}

function nextMusic() {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingState();
}

function pauseMusic() {
    container.classList.remove("playing");
    //icon değişimi
    play.classList = "fa-solid fa-circle-play";
    audio.pause();
}

function playMusic() {
    container.classList.add("playing");
    //icon değişimi
    play.classList = "fa-solid fa-circle-pause";
    audio.play();
}

const calculateTime = (toplamSaniye) => {
    const dakika = Math.floor(toplamSaniye / 60); //bölüm kısmı dakika
    const saniye = Math.floor(toplamSaniye % 60); //mod kısmı ise saniye
    const guncellenenSaniye = saniye < 10 ? `0${saniye}` : `${saniye}`;
    const sonuc = `${dakika}:${guncellenenSaniye}`;
    return sonuc;
};

//ses kontrolü için tetiklenen event;
audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});

//her saniye yazdıran event;
audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
    //bittiğinde yeni şarkının çalması
    //burada bu işlemi her saniye yapmak yerine en aşağıda event olarak tanımladık..
    // if (audio.ended == true) {
    //     nextMusic();
    // }
});

//tıklanıldığında istenilen dakikaya gitme
progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value;
});

let sesDurumu = "sesli";

let value = 100;
//volume bar (input-range) üzerinden otomatik bilgi verebiliyoruz.
volumeBar.addEventListener("click", (e) => {
    value = e.target.value;
    audio.volume = value / 100; //volume 0-1 arasından değer aldığı için 100e böldük
    if (value == 0) {
        audio.muted = true;
        sesDurumu = "sessiz";
        volume.classList = "fa-solid fa-volume-xmark";
    }
    else {
        audio.muted = false;
        sesDurumu = "sesli"
        volume.classList = "fa-solid fa-volume-high";
    }
});

//volume(range) direkt değeri veriyor
volume.addEventListener("click", () => {
    if (sesDurumu === "sesli") {
        audio.muted = true;
        sesDurumu = "sessiz";
        volume.classList = "fa-solid fa-volume-xmark";
        volumeBar.value = 0;
    }
    else {
        audio.muted = false;
        sesDurumu = "sesli"
        volume.classList = "fa-solid fa-volume-high";
        volumeBar.value = value;
    }
});

const displayMusicList = (list) => {
    for (let i = 0; i < list.length; i++) {
        
        //li için onclick ve li-index metodu verdik..Tanımlamalar aşağıda mevcut.
        //listeden müzik seçimi için
        let liTag = `<li li-index='${i}' onclick="selectedMusic(this)">
            <span>${list[i].getName()}</span>
            <span id="music-${i}" class="span-border"></span>
            <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
        </li>`;
        ul.insertAdjacentHTML("beforeend", liTag);

        let liaudioDuration = ul.querySelector(`#music-${i}`);
        let liaudioTag = ul.querySelector(`.music-${i}`);

        liaudioTag.addEventListener("loadeddata", () => {
            liaudioDuration.innerText = calculateTime(liaudioTag.duration);
        });

    }
};

const selectedMusic = (li) => {
    player.index = li.getAttribute("li-index");
    displayMusic(player.getMusic());
    playMusic();
    isPlayingState();
};

//çalan şarkının listede gözükmesi arkaplan değişimi
const isPlayingState = () => {
    //liste elemanlarını tek tek dolaş. class içerenleri kontrol et
    for (let li of ul.querySelectorAll("li")) { //uldaki bütün lileri dolaş
        if (li.classList.contains("playing")) {
            li.classList.remove("playing");
        }
        if (li.getAttribute("li-index") == player.index) {
            li.classList.add("playing");
        }
    }
};

//otomatikmen sıradaki şarkıya geçme
audio.addEventListener("ended", () => {
    nextMusic();
});