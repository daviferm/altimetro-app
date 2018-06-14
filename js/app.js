let getPosicion = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                position = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log(position);

                let latitud = position.lat;
                let longitud = position.lng;
                const latUtm = convertirCoordenadar(latitud);
                const lngUtm = convertirCoordenadar(longitud);
                document.getElementById('coordN').textContent = latUtm;
                document.getElementById('coordO').textContent = lngUtm;
                console.log(latUtm);
                console.log(lngUtm);

                mostrarMapa(position)
                    .then(mensaje => console.log(mensaje))
                    .catch(err => console.log(err))
            });

        } else {
            throw error = new Error('Necesitas habilitar GPS');
        }
    }
    //Función para convertir las coordenadas GPS en grados, minutos...
let convertirCoordenadar = (coord) => {
    coord = coord.toString();
    let grados;
    if (coord.startsWith('-')) {

        grados = '0' + coord.substr(1, 1);

    } else {
        grados = coord.substr(0, 2);
    }

    let string = '0' + (coord.toString().substr(coord.toString().indexOf('.'), coord.toString().length));

    let floatMin = String(string * 60);
    let minutos = floatMin.substr(0, 2);

    string = '0' + (floatMin.toString().substr(floatMin.toString().indexOf('.'), floatMin.toString().length));
    let segundos = Math.floor(string * 60);

    let html;
    if (coord.startsWith('-')) {
        html += `O ${grados}° ${minutos}' ${segundos}"`
        return `O ${grados}° ${minutos}' ${segundos}"`;

    } else {
        html += `N ${grados}° ${minutos}' ${segundos}"`

        return `N ${grados}° ${minutos}' ${segundos}"`;
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
            .catch(e => console.log('Error al optener direccion-' + e))

        let clima = await getClima(coord.lat, coord.lng)
            .then(res => {
                return res.json();
            })
            .then(resp => {
                console.log(resp);
                let temperatura = resp.main.temp + ' Cº';
                document.getElementById('temp').textContent = temperatura;
                let viento = resp.wind.speed + ' Km/h';
                document.getElementById('viento').textContent = viento;
                // console.log('Temperatura: ' + resp.main.temp + ' Cº');
                // console.log('Velocidad de viento: ' + resp.wind.speed + ' Km/h');
            })

        return `Datos descargado de la API..`;
    } catch (e) {
        return `Error al requerir los datos ${e}`;
    }
}