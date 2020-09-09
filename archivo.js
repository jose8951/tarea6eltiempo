/**
 * Contaminación y el tiempo. 
 * Tarea 06 dwec
 */

//cargamos la página y preparamos los button
$(function () {
    $("#buton1").on('click', estado_actual_tiempo);
    $("#buton2").on('click', estado_polucion);
});

//variable para guardar la ciudad
var localidad = null;
//variable para guardr el key
var elkey = "ac6217e7ac544574bb63029ef38d42fa";            

/**
 * function para mostrar el estado actual del tiempo
 */
function estado_actual_tiempo() {
    //comprobamos que la localidad existe
    if ($('#localidad').val() != "") {
        //si todo es correcto ocultamos el mensaje de error
        // $('#error').hide();
        //recuperamos el valor de la ciudad
        localidad = $("#localidad").val();
        //pasamos los valores a ajax
        $.ajax({
            url: "https://api.weatherbit.io/v2.0/current?city=" + localidad + "&key=" + elkey,          
            type: "GET",
            dataType: "jsonp",
            success: function (datos_devueltos) {
                //creamos una function para pasar los datos
                mostrarDatos(datos_devueltos);
            },

            // Si la petición falla
            error: function (xhr, estado, error_producido) {
                console.log("Error producido: " + error_producido);
                //console.log("Estado: " + estado);                
                $("#error").html("Error producido: " + error_producido);
            },
        });
    } else {
        //mostramos el error si el campo esta vacío
        $("#error").html("Este campo City name no puede estar vacío.");
    }
}

/**
 * function para mostrar el estado de la polución
 */
function estado_polucion() {
    //pasamos los valores a ajax
    $.ajax({
        url: "https://api.weatherbit.io/v2.0/current/airquality?city=" + localidad + "&key="+elkey,
        type: "GET",
        dataType: "jsonp",
        success: function (datos_devueltos2) {
            mostrarDatos2(datos_devueltos2);
        },
        // Si la petición falla
        error: function (xhr, estado, error_producido) {
            console.log("Error producido: " + error_producido);
            //console.log("Estado: " + estado);                
            $("#error").html("Error producido: " + error_producido);
        },
    });
}

//variable  para crear el Índice de calidad del aire: 
var aqi = null;
/**
 * Function para mostar el estado altual del tiempo 
 * @param {*} datos_devueltos //le pasamos un parametro con los valores
 */
function mostrarDatos(datos_devueltos) {
    //recuperamos el valor de Índice de calidad del aire:  y los demas valores
    aqi = datos_devueltos.data[0].aqi;
    let hayViento = datos_devueltos.data[0].wind_spd;
    let iconoFoto = './img/' + datos_devueltos.data[0].weather.icon + '.png';
    let city_name = datos_devueltos.data[0].city_name;
    //si no hay viento ocultamos los datos
    if (hayViento <= 0) {
        $("#viento").hide();
        $("#direccion").hide();
    }
    //mostramos lo valores por pantalla
    $("#lugarConsultar").html("Lugar a consultar: " + datos_devueltos.data[0].city_name);
    $("#temperatura").html("Temperatura actual: " + datos_devueltos.data[0].temp);
    $("#viento").html("Viento: " + hayViento + " m/s ");
    $("#direccion").html("La direccion es " + datos_devueltos.data[0].wind_dir + " º ");
    $("#estado_tiempo").html('Estado del tiempo: ' + datos_devueltos.data[0].weather.description);
    //icono de la la imagen 
    $(".muestra_icono").html("<img src='" + iconoFoto + "'>");
    $("#presionAtmosferica").html("Presión atmosférica. " + datos_devueltos.data[0].pres);
    $("#gradoNubosidad").html("Grado de nubosidad. " + datos_devueltos.data[0].clouds + " %");
    $("#country_code").html("Código de país: " + datos_devueltos.data[0].country_code);


    //variables de la cordenadas del mapa
    let variable_lon = datos_devueltos.data[0].lon;
    let variable_lat = datos_devueltos.data[0].lat;

    //mostramos el boton de ver mapa
    $('#buton3').css('visibility', 'visible');
    $('#buton3').html('Ver mapa de ' + city_name);
    //si pulsamos el button3 mostramos el mapa
    $("#buton3").click(function () {
        window.open('https://www.openstreetmap.org/#map=15/' + variable_lat + '/' + variable_lon + '', "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=200,left=300,width=400,height=400");
    });
}

/**
 * Function para mostar el estado de la polución
 * @param {*} datos_devueltos2 //le pasamos un parametro con los valores
 */
function mostrarDatos2(datos_devueltos2) {
    $("#concentracion_superficie").html("Concentración de superficie:  " + datos_devueltos2.data[0].o3 + " (µg / m³)");
    $("#indice_calidad_aire").html(" Índice de calidad del aire: " + aqi);
    $("#concentracion_SO2_superficial").html("Concentración SO2 superficial:  " + datos_devueltos2.data[0].so2 + " (µg / m³)");
    $("#concentracion_NO2_superficial").html("Concentración NO2 superficial:  " + datos_devueltos2.data[0].no2 + "  (µg / m³)");
    $("#concentracion_particulas").html("Concent. particulas: " + datos_devueltos2.data[0].pm10 + " <10 micras (µg / m³)");

}