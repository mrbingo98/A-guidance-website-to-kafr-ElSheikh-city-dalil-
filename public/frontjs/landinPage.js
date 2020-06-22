var images = new Array('/s1.jpg', '/s2.jpg', '/s3.jpg', '/s4.jpg', '/s5.jpg');
var nextimage = 0;
doSlideshow();

function doSlideshow() {
    if (nextimage >= images.length) { nextimage = 0; }
    $('body')
        .css('background-image', 'url("' + images[nextimage++] + '")').css('background-size', 'cover')
        .fadeIn(500, function() {
            setTimeout(doSlideshow, 4000);
        });
}

document.getElementById('mapTrigger').addEventListener('click', function() {
    document.getElementById('mapContainer').classList.toggle('disabeled')
    document.getElementById('headerWelcome').classList.toggle('disabeled')
})