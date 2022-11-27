async function obtenerDatosDiaActual (){
    const res = await fetch('https://mindicador.cl/api');
    const data = await res.json();

    return data;
}

async function obtenerDatosHistoricos (moneda, fecha) {
    const res = await fetch(`https://mindicador.cl/api/${moneda}/${fecha}`);
    const data = await res.json();

    return data;
}

async function construyeSelect () {
    const data = await obtenerDatosDiaActual();

    const monedas = (Object.keys(data));
    let html = '<select name="moneda" id="moneda">';
    for (const codigo_moneda of monedas){
        const moneda = data[codigo_moneda];
        if (moneda.unidad_medida =='Pesos'){
            html += `<option valeu="${moneda.codigo}-${moneda.cvalor}">${moneda.nombre}</option>`;
        }
    }
    html += '</select>';

    const selector = document.querySelector('#selector');
    selector.innerHTML = html;

}


 //gráfico
 function dibujaGrafico(fecha, valores){
    const ctx = document.querySelector('#grafico');
    
    const data = {
        labels: fechas,
        datasets: [{
            label: 'Histórico',
            data: valores,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
  }]
};

new Chart(ctx, {
    type: 'line',
    data: data,
  });

}

 //boton
 const btnCalcular = document.querySelector('#btnCalcular');

 btnCalcular.addEventListener('click', async function(){
     const valor = document.querySelector('#valor').value;
     tasaYMoneda = document.querySelector('#moneda').value.split('-');
 
     const valorConvertido = valor / tasaYMoneda[1];
 
     document.querySelector('#resultado').innerHTML = valorConvertido.toFixed(2);

     const codigoMoneda = tasaYMoneda[0];
     const fechaActual = new Date();

     let fechas = [];
     let valores = [];

     let ultimoValor = 0;
     for (i = 10;i > 0;i--) {
        const dia = fechaActual.getDate()-i;
        const mes = fechaActual.getMonth()+1;
        const aso = fechaActual.getFullYear();

        const fechaConsulta = `${dia}-${mes}-${aso}`;

        const dataHistorica = await obtenerDatosHistoricos (codigoMoneda,fechaConsulta);

        fechas.push(fechaConsulta);
        if (dataHistorica.serie.length > 0) {
            valores.push(dataHistorica.serie[0].valor);
            ultimoValor = dataHistorica.serie[0].valor;
        } else {
            valores.push(ultimoValor);
        }
     }

     dibujaGrafico(fechas,valores);
 
 });

construyeSelect();