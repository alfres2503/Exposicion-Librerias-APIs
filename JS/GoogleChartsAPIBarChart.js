function renderChart(){
    //metodo de la API -> google.visualization.arrayToDataTable
    var data = google.visualization.arrayToDataTable([
        ['Productos', 'Ventas'],
        ['Zapatos', 40],
        ['Sombreros', 50],
        ['Abrigos', 35],
        ['Bufandas', 20],
    ]);

    //Opcional, añadir estilos a la gráfica, en este caso, el título, los ejes y los valores
    var options = {
        title: 'Ventas de productos',
        chartArea: {width: '50%'},
        hAxis: {
            title: 'Cantidad vendida',
        },
        responsive: true
    };

    //Creacion de un objeto usando el metodo Barchart
    //Este metodo pide como parametro donde queremos mostrar el chart
    var chart = new google.visualization.BarChart(document.getElementById('chart'));

    //para mostrar este grafico, usamos el metodo draw pasandole los datos y opciones
    chart.draw(data, options);
}
//Ultimo metodo de la API, cumple la funcion de configurar la devolucion de la carga, pasandole la funcion anterior
google.setOnLoadCallback(renderChart);

window.addEventListener('resize', function() {
    renderChart();
})