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
                console.log('Temperatura: ' + resp.main.temp + ' Cº');
                console.log('Velocidad de viento: ' + resp.wind.speed + ' Km/h');
            })

        return `Datos descargado de la API..`;
    } catch (e) {
        return `Error al requerir los datos ${e}`;
    }
}