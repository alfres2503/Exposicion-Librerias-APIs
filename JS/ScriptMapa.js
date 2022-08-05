// Variables Globales
var mapa;
var marker;
var geoLoc = navigator.geolocation;; //Geolocation

//Renderizar rutas
var directionsService;
var directionsDisplay;

var LatLng; //Latitud y Longitud 
var output = document.querySelector("#output"); //Div que muestra la información










//Función que "enciende" el mapa
function initMap() {
  LatLng = { lat: 10.0078377, lng: -84.216385 }; //Objeto Coordenadas de la UTN

  //Creamos el mapa que recibe del HTML y un objeto con el zoom y coordenadas
  mapa = new google.maps.Map(document.getElementById("map"), {
    center: LatLng,
    zoom: 17,
    mapTypeId: 'roadmap',
  });

  //marcador por defecto
  marker = new google.maps.Marker({
    position: LatLng,
    map: mapa,
    title: "UTN",
  });

  //Creamos objetos para renderizar rutas
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  //Autocompletado de direcciones
  var from = new google.maps.places.Autocomplete(document.getElementById("from"));
  var to = new google.maps.places.Autocomplete(document.getElementById("to"));
}











//Función que obtiene la localización actual del usuario con el objeto Geolocation
function getPosition() {
  if (navigator.geolocation) //Preguntamos si el navegador soporta la geolocalización
  { 
    //1er parametro: Función que se ejecuta cuando se obtiene la localización
    //2do parametro: Función que se ejecuta cuando no se puede obtener la localización (opcional)
    //3er parametro: Objeto con opciones de configuración (opcional)
    geoLoc.getCurrentPosition(showLocationOnMap, errorHandler, {enableHighAccuracy: true});

    //Geo Loctation también permite obtener la localización en tiempo real
    //geoLoc.watchPosition(showLocationOnMap, errorHandler, {enableHighAccuracy: true, timeout: 5000}); //5 segundos
    //geoLoc.clearWatch(watchID); //Este método detiene la observación de la localización
  } else {
    alert("Su navegador no soporta geolocalización");
  }
}

//Función que muestra la localización actual del usuario en el mapa
function showLocationOnMap(position) {
  var latitud = position.coords.latitude;
  var longitud = position.coords.longitude;
  console.log("Latitud: " + latitud + " Longitud: " + longitud);

  var myLatLng = { lat: latitud, lng: longitud };
  marker.setPosition(myLatLng);
  marker.setTitle("Tu ubicación");
  mapa.setCenter(myLatLng);
}

//Función que muestra un error en caso de que no se pueda obtener la localización
function errorHandler(err) {
  if (err.code == 1) {
    output.innerHTML ="<div style='color: red'><i class='fas fa-exclamation-triangle'></i> Acceso a localización denegado.</div>";
  } else if (err.code == 2) {
    output.innerHTML ="<div style='color: red'><i class='fas fa-exclamation-triangle'></i> Posición no disponible.</div>";
  }
}














function calcRoute() {
  var request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
    unitSystem: google.maps.UnitSystem.METRIC, //IMPERIAL, METRIC
  };

  directionsDisplay.setMap(mapa); //Se vincula el mapa pasado

  directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) 
    {  
         //legs[] contiene una matriz de objetos DirectionsLeg, 
      //cada uno de los cuales contiene información sobre un tramo de la
      // ruta, desde dos ubicaciones dentro de la ruta dada
      //Muestra tiempo y distancia
      output.innerHTML =
        " Distancia: <i class='fas fa-road'></i> : " +
        result.routes[0].legs[0].distance.text +
        ". Duración: <i class='fas fa-hourglass-start'></i> : " +
        result.routes[0].legs[0].duration.text +
        ".</div>";

      //mostrar ruta
      directionsDisplay.setDirections(result);  //Debido a que el renderizador es un MVCObject, detectará 
                                                //automáticamente cualquier cambio en sus propiedades y 
                                                //actualizará el mapa cuando sus direcciones asociadas hayan cambiado.
    } 
    else 
    {
      //Mensaje de error
      output.innerHTML =
        "<div style='color: red'><i class='fas fa-exclamation-triangle'></i> No se pudo calcular la distancia.</div>";
    }
  });
}
