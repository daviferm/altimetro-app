let getPosicion = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            position = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            mostrarMapa(position)
                .then(mensaje => console.log(mensaje))
                .catch(err => console.log(err))
        });

    } else {
        throw error = new Error('Necesitas habilitar GPS');
    }
}


getPosicion();

let mostrarMapa = async(coord) => {

    try {
        let ui = await new UI(coord);
        await ui.mostrarPin(coord);
        await ui.displayLocationElevation(coord);
        let direccion = await ui.obtenerDireccion(coord);
        direccion.json()
            .then(res => {
                const respuesta = res.results[1].formatted_address;
                document.getElementById('direccion').textContent = respuesta;
                console.log(respuesta);
            })

        return `Datos descargado de la API..`;
    } catch (e) {
        return `Error al requerir los datos ${e}`;
    }
}

let lat = 40.1999759,
    lng = -3.6953777,
    cnt = 5;
const getClima = async(lat, lng) => {

    //asiox
    let resp = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&&appid=2f90935de188b93e6aad487fc49adae5`)



    return resp;
    // return resp.data.main.temp;
}

// getClima(lat, lng)
//     .then(res => {
//         return res.json();
//     })
//     .then(resp => {
//         console.log(resp);
//     })

let coordenadas = {
    lat: 40.1999759,
    lng: -3.6953777
}
const getDirection = async(coord) => {

    let resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coord.lat},${coord.lng}&key=AIzaSyAIEk-dF-6BRl-wSsEHXN1eQ6FV8TKjOPE`);

    return resp;
}