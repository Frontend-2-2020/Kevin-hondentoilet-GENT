import axios from 'Axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/index.scss';

const map = L.map('map', {
    //Where the map is centered (location)
    center: [51.051123, 3.713242],
    //Zoom ratio
    zoom: 13
});

//Create icon / markerImg
const pawIcon = L.icon({
	iconUrl: './public/poo.png',
	iconSize:     [50, 55], // size of the icon
	iconAnchor:   [25, 55], // point of the icon which will correspond to marker's location 
	popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

//Generates the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

//Call Gent DB hondentoiletten
//Set markers and next ask for position user
axios.get('https://datatank.stad.gent/4/infrastructuur/hondenvoorzieningen.geojson')
  .then(response => {
    const {coordinates} = response.data;

    //Call function to set all markers
    setMarkers(coordinates);

    //Ask for location & set marker
    getPosition();
  });

  // Function to set (all) markers
const setMarkers = (data) =>{
  data.forEach((el) => {
    L.marker([el[1],el[0]], {icon: pawIcon}).addTo(map);
  });
};

const getPosition = () =>{
  navigator.geolocation.getCurrentPosition(success);
};

const success = (pos) =>{
  const {latitude, longitude} = pos.coords;
  L.marker([latitude,longitude], {icon: pawIcon}).addTo(map);
  centerToLocation(latitude, longitude);

  //const position = [[longitude, latitude]];
  //setMarkers(position);
};

const centerToLocation = (lat, long) =>{
  map.panTo(new L.LatLng(lat, long));
};