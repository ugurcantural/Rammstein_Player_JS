class Music {
    constructor (title, singer, img, file) {
        this.title = title;
        this.singer = singer;
        this.img = img;
        this.file = file;
    }

    getName() {
        return this.title + " - " + this.singer;
    }
}

//servis üzerinden de çağrılabilir fakat daha öğrenmedik
const musicList = [
    new Music("Deutschland", "Rammstein", "1.png", "1.mp3"),
    new Music("Du Hast", "Rammstein", "2.jpg", "2.mp3"),
    new Music("Büch Dich", "Rammstein", "3.jpg", "3.mp3")
];