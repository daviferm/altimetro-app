export class UI {
    constructor(pos) {
        this.latLng = pos;

        this.mapa = new google.maps.Map(document.getElementById('map'), {
            center: this.latLng,
            zoom: 11,
            draggable: false,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: false
        });
        this.elevator = new google.maps.ElevationService;
    }

    mostrarPin(pos) {
        this.marker = new google.maps.Marker({
            position: pos,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6, //tamaño
                strokeColor: '#f00', //color del borde
                strokeWeight: 2, //grosor del borde
                fillColor: '#00f', //color de relleno
                fillOpacity: 1 // opacidad del relleno
            },
            map: this.mapa
        });
    }

    obtenerDireccion(coord) {
        let resp = fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coord.lat},${coord.lng}&key=AIzaSyAIEk-dF-6BRl-wSsEHXN1eQ6FV8TKjOPE`);

        return resp;

    }
    displayLocationElevation(location) {
        // Initiate the location request
        this.elevator.getElevationForLocations({
            'locations': [location]
        }, (results, status) => {
            if (status === 'OK') {
                // Retrieve the first result
                if (results[0]) {

                    this.elevacion = results[0].elevation;

                    document.getElementById('altimetro').textContent = Math.floor(this.elevacion) + ' m';
                } else {
                    console.log('No hay resultados de elevacion.');
                }
            } else {
                console.log('Servicio de elevacion fallido: ' + status);
            }
        });
    }
}