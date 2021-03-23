const { leerInput, inquirerMenu, inquirerPausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
require('dotenv').config();


const main = async() => {

    let opt;
    const busquedas = new Busquedas();

    while (opt !== 0) {

        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar mensaje
                const lugar = await leerInput('Ingrese ciudad: ');

                //Buscar los lugares
                const lugares = await busquedas.ciudad(lugar);

                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id);

                //Guardar en BD
                busquedas.agregarHistorial(lugarSel.nombre);

                //Clima
                const climaSel = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

                //Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad:\n'.green);
                console.log('Ciudad: ', lugarSel.nombre.green);
                console.log('Lat: ', lugarSel.lat);
                console.log('Lng: ', lugarSel.lng);
                console.log('Temperatura: ', climaSel.temp);
                console.log('Mínima: ', climaSel.min);
                console.log('Máxima: ', climaSel.max);
                console.log('Estado: ', climaSel.estado);
                break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ lugar }`, );
                });
                //console.log(busquedas.historialCapitalizado());


                break;
            case 0:
                break;
        }

        if (opt !== 0) await inquirerPausa();
    }
}

main();