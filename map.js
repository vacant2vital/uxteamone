var map, browserSupportFlag, initialLocation;
var center = {lat: 35.7796, lng: -78.6382};
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,//Raleigh Latitude and longitude
    zoom: 14,
  });
  getUserPosition();
  initMyPosition();
  drawPlots();
}

function getUserPosition() {
  var browserSupportFlag;
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }
}

function initMyPosition() {
  var centerControlDiv = document.createElement('div');
  var icon = document.createElement('i');
  icon.className = "fa fa-dot-circle-o icon";
  centerControlDiv.appendChild(icon);
  centerControlDiv.className = "centerDiv";
  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

  centerControlDiv.addEventListener('click', function() {
    if(initialLocation) {
        map.setCenter(initialLocation);
    } else {
        map.setCenter(center);
    }
    map.setZoom(16);

    var marker = new google.maps.Marker({//simple markers
      position: initialLocation,
      map: map,
      title: 'Here you are!'
    });
  });
}

function handleNoGeolocation(errorFlag) {
  console.log("Location Disabled");
}

function drawPlots() {
  var coords =  [[
    {lat:35.776916,lng: -78.697443},
    {lat:35.776811,lng: -78.695168},
    {lat:35.772842,lng: -78.693194},
    {lat:35.774583,lng: -78.695555},
    {lat:35.774652,lng: -78.697486}
  ],
  [
    {lat:35.783401,lng: -78.677019},
    {lat:35.783166,lng: -78.676536},
    {lat:35.782531,lng: -78.676912},
    {lat:35.781652,lng: -78.674787},
    {lat:35.781974,lng: -78.671719},
    {lat:35.783810,lng: -78.676461}

  ]];
  for(var i = 0; i < coords.length; i++) {
    var bermudaTriangle = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });
    bermudaTriangle.setMap(map);
    // Add a listener for the click event.
    bermudaTriangle.addListener('click', showArrays);
    infoWindow = new google.maps.InfoWindow;
  }
}


function showArrays(event) {
  // Since this polygon has only one path, we can call getPath() to return the
  // MVCArray of LatLngs.
  var vertices = this.getPath();

  var contentString = '<b>Bermuda Triangle polygon</b><br>' +
      'Clicked location: <br>' + event.latLng.lat() + ',' + event.latLng.lng() +
      '<br>';

  // Iterate over the vertices.
  for (var i =0; i < vertices.getLength()-1; i++) {
    var xy = vertices.getAt(i);
    contentString += '<br>' + 'Coordinate ' + i + ':<br>' + xy.lat() + ',' +
        xy.lng();
  }

  // Replace the info window's content and position.
  infoWindow.setContent(contentString);
  infoWindow.setPosition(event.latLng);

  infoWindow.open(map);
}
