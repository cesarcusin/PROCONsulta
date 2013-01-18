// Determine support for Geolocation
        if (navigator.geolocation) {
            // Locate position
            navigator.geolocation.getCurrentPosition(displayPosition, errorFunction);
        } else {
            alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.');
        }

// Success callback function
        function displayPosition(pos) {
            var mylat = pos.coords.latitude;
            var mylong = pos.coords.longitude;
//            var thediv = document.getElementById('locationinfo');
//            thediv.innerHTML = '<p>Your longitude is :' +
//                    mylong + ' and your latitide is ' + mylat + '</p>';

//Load Google Map
            var latlng = new google.maps.LatLng(mylat, mylong);
            var myOptions = {
                zoom: 15,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

//Add marker
            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: "You are here"
            });
        }

// Error callback function
        function errorFunction(pos) {
            alert('Error!');
        }