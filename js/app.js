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

            console.log(coord);
            return `Datos descargado de la API..`;
        } catch (e) {
            return `Error al requerir los datos ${e}`;
        }
    }
    // let position = {
    //     lat: 40.1999759,
    //     lng: -3.6953777
    // }
    // mostrarMapa(position)
    //     .then(mensaje => console.log(mensaje))
    //     .catch(err => console.log(err))