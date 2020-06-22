function fullScreenImage(id) {
    let img = document.getElementById(id)
    if (img.requestFullscreen) {
        img.requestFullscreen();
    } else if (img.mozRequestFullScreen) { /* Firefox */
        img.mozRequestFullScreen();
    } else if (img.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        img.webkitRequestFullscreen();
    } else if (img.msRequestFullscreen) { /* IE/Edge */
        img.msRequestFullscreen();
    }
}