const getClima = async(lat, lng) => {

    //asiox
    let resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&&appid=2f90935de188b93e6aad487fc49adae5`)

    return resp;
}