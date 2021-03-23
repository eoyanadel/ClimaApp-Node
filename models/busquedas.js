const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get paramsMapbox() {

        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        };
    }


    get paramsOpenWeather() {

        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    get historialCapitalizado() {

        return this.historial.map(lugar => {

            const lugarArr = lugar.split(' ');
            /* let lugarCap = '';
            lugarArr.forEach(palabra => {
                lugarCap += `${ palabra[0].toLocaleUpperCase() + palabra.substring(1)} `;
            })

            return lugarCap; */
            let palabras = lugarArr.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');

        });
    }


    async ciudad(lugar = '') {

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            //peticion http
            const resp = await instance.get();

            /* Retorna un nuevo arreglo con los lugares encontrados, utilizando el método map.
                - La función dentro del map que tiene la forma map(lugar => ({})) retorna un arreglo implicito, de esta forma,
                  se ahorra de poner el return dentro de la funció del map.*/
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            console.log(error);
        }
    }

    async climaLugar(lat, lon) {

        try {

            this.latitud = lat;
            this.longitud = lon;

            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsOpenWeather, lat, lon }
            });

            //peticion http
            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                estado: weather[0].description,
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max
            }

        } catch (error) {
            console.log(error);
        }
    }


    agregarHistorial(lugar = '') {

        //TODO: pevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        //guardar en BD
        this.guardarDB();
    }


    guardarDB() {

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }


    leerDB() {

        if (!fs.existsSync(this.dbPath)) {
            return null;
        }

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
        this.historial = data.historial;

    }
}

module.exports = Busquedas;