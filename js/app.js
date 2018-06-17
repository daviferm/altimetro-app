import { getClima } from './clima.js';
import { UI } from './map.js';

//Variables y constantes 
const btnCompartir = document.getElementById('compartir');
const btnCerrar = document.getElementById('cerrar');
const divRedes = document.querySelector('.redesSociales');
const imgBrujula = document.getElementById('imgBrujula');
const coordBrujula = document.getElementById('brujula');

// Funciones
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

                mostrarInfo(position)
                    .then(mensaje => {
                        document.querySelector('.main').style.display = 'flex';
                        setTimeout(function() {
                            document.getElementById('imgPortada').style.display = 'none';
                        }, 1000);
                        console.log(mensaje);
                    })
                    .catch(err => console.log(err))
            });

        } else {
            throw error = new Error('Necesitas habilitar GPS');
        }
    }
    //Función para convertir las coordenadas GPS en grados, minutos y segundos
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

    if (coord.startsWith('-')) {
        return `O ${grados}° ${minutos}' ${segundos}"`;
    } else {
        return `N ${grados}° ${minutos}' ${segundos}"`;
    }

}


let mostrarInfo = async(coord) => {

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

                let timeAmanecer = new Date(resp.sys.sunrise * 1000);
                let amanecer = `${timeAmanecer.getHours()}:${timeAmanecer.getMinutes()}`;
                let timeAtardecer = new Date(resp.sys.sunset * 1000);
                let atardecer = `${timeAtardecer.getHours()}:${timeAtardecer.getMinutes()}`;

                document.getElementById('amanecer').textContent = amanecer;
                document.getElementById('atardecer').textContent = atardecer;

                btnCompartir.addEventListener('click', compartirMapa);

            })

        return `Datos descargado de la API..`;
    } catch (e) {
        return `Error al requerir los datos ${e}`;
    }
}

getPosicion();

//Funciones para abrir o cerrar modal para compartir mi posición
function compartirMapa() {
    divRedes.style.transform = 'translateY(-50%)';
    btnCerrar.addEventListener('click', cerrarCompartir);
}

function cerrarCompartir() {
    divRedes.style.transform = 'translateY(0%)';
}

if (!window.DeviceOrientationEvent) {

    alert("Device Orientation no soportadas por tu navegador");

} else {

    window.addEventListener("deviceorientation", handleOrientation, true);
}


function handleOrientation(event) {
    var absolute = event.absolute;
    var alpha = event.alpha;
    var beta = event.beta;
    var gamma = event.gamma;

    // resto del codigo, aqui se rotaran elementos u otra operacion
    imgBrujula.style.transform = "rotate(" + alpha + "deg)";



    if (alpha >= 0) coordBrujula.textContent = 'N';
    if (alpha > 22) coordBrujula.textContent = 'NO';
    if (alpha > 66) coordBrujula.textContent = 'O';
    if (alpha > 112) coordBrujula.textContent = 'SO';
    if (alpha > 156) coordBrujula.textContent = 'S';
    if (alpha > 202) coordBrujula.textContent = 'SE';
    if (alpha > 246) coordBrujula.textContent = 'E';
    if (alpha > 292) coordBrujula.textContent = 'NE';
    if (alpha > 337) coordBrujula.textContent = 'N';

    // coordBrujula.innerHTML = Math.floor(alpha) + "°";
}