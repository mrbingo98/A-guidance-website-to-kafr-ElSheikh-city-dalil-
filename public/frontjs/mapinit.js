function initMap() {
    // The location of kafr elsheikh
    var kafr_elsheikh = { lat: 31.11188, lng: 30.93612 };

    // The map, centered at kafr elsheikh31.11188 30.93612
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 16, center: kafr_elsheikh });
    // The marker, positioned at kafr elsheikh
    var marker = new google.maps.Marker({ position: kafr_elsheikh, map: map });

};
MapOptions.streetViewControl == true;
MapOptions.rotateControl == true;