// estadisticas.js
function calcularPorcentajeEstadosPaneles(lecturas) {
    let total = lecturas.length;
  let conteoEstados = { 'bueno': 0, 'normal': 0, 'excelente': 0, 'defectuoso': 0 };

  for (let lectura of lecturas) {
    let estado = lectura.estado_paneles;
    if (conteoEstados.hasOwnProperty(estado)) {
      conteoEstados[estado]++;
    }
  }
  
    let porcentajes = {};
    for (let estado in conteoEstados) {
      porcentajes[estado] = ((conteoEstados[estado] / total) * 100).toFixed(2);
    }
  
    return porcentajes;
  }

  function calcularPorcentajeEstadosInversores(lecturas) {
    let total = lecturas.length;
    let conteoEstados = { 'en_mantenimiento': 0, 'dañado': 0, 'funcionando': 0 };
  
    for (let lectura of lecturas) {
      let estado = lectura.estado_inversores;
      if (conteoEstados.hasOwnProperty(estado)) {
        conteoEstados[estado]++;
      }
    }
  
    let porcentajes = {};
    for (let estado in conteoEstados) {
      porcentajes[estado] = ((conteoEstados[estado] / total) * 100).toFixed(2);
    }
  
    return porcentajes;
  }
  
  
  
// Obtén el contexto del canvas donde se dibujará la gráfica
const ctx = document.getElementById('graficoEficienciaEnergia').getContext('2d');



// Crea la gráfica
const chart = new Chart(ctx, {
  type: 'line', // Tipo de gráfica
  data: {
    labels: [], // Aquí irán las etiquetas (por ejemplo, las fechas y horas de las lecturas)
    datasets: [{
      label: 'Eficiencia de los paneles',
      data: [], // Aquí irán los datos de la eficiencia de los paneles
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1,
      pointRadius: 0, // Configura el radio del punto en 0
      fill: false, // No rellena el área bajo la línea
      showLine: true // Muestra la línea
    },
    {
      label: 'Producción de energía',
      data: [], // Aquí irán los datos de la producción de energía
      borderColor: 'rgba(255, 99, 132, 1)',
      tension: 0.1,
      pointRadius: 0, // Configura el radio del punto en 0
      fill: false, // No rellena el área bajo la línea
      showLine: true // Muestra la línea
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Hora'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Valor'
        }
      }
    }
  }
});

  
// Función para obtener los datos de la planta solar
async function obtenerDatosPlantaSolar() {
    try {
      const response = await fetch('/api/planta_solar'); // Actualiza esta URL para que coincida con la ruta del servidor Express
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Datos obtenidos de la planta solar:', data); // Verifica los datos
      return data;
    } catch (error) {
      console.error('Ha ocurrido un error al obtener los datos de la planta solar:', error);
      return null; // Devuelve null si hay un error
    }
}

// Función para actualizar la gráfica con nuevos datos
async function actualizarGrafica() {
    const datos = await obtenerDatosPlantaSolar();
    console.log('Datos recibidos:', datos); // Imprime los datos recibidos

    // Crear un nuevo array para las lecturas depuradas
    const lecturasDepuradas = [];
    const lecturasDepuradas2 = []; // Nuevo array para los estados de los paneles e inversores

    // Recorrer las lecturas y llenar los nuevos arrays
    for (const id in datos.lecturas) {
      const lectura = datos.lecturas[id];
      // Crea un nuevo objeto con solo la información relevante
      const lecturaDepurada = {
        fecha_hora: lectura.fecha_hora,
        eficiencia_paneles: parseFloat(lectura.eficiencia_paneles),
        produccion_energia: parseFloat(lectura.produccion_energia)
      };
      // Añade el nuevo objeto al array de lecturas depuradas
      lecturasDepuradas.push(lecturaDepurada);

      // Crea un nuevo objeto con los estados de los paneles e inversores
      const lecturaDepurada2 = {
        estado_paneles: lectura.estado_componentes,
        estado_inversores: lectura.estado_inversores
      };
      // Añade el nuevo objeto al array de lecturas depuradas 2
      lecturasDepuradas2.push(lecturaDepurada2);
    }
    // Calcular la sumatoria de la producción de energía
    let sumatoriaProduccionEnergia = 0;
    for (const lectura of lecturasDepuradas) {
        sumatoriaProduccionEnergia += lectura.produccion_energia;
    }

    // Redondear la sumatoria a dos decimales
    sumatoriaProduccionEnergia = sumatoriaProduccionEnergia.toFixed(2);
    // Actualizar el contenido del nuevo elemento HTML
    document.getElementById('sumatoria_produccion_energia').innerText = sumatoriaProduccionEnergia + " kWh";

    console.log('Lecturas depuradas:', lecturasDepuradas); // Imprime las lecturas depuradas

    // Crear arrays para las etiquetas y los datos de la gráfica
    const labels = lecturasDepuradas.map(lectura => lectura.fecha_hora);
    const datasets = [
      { label: 'Eficiencia de los paneles', data: lecturasDepuradas.map(lectura => lectura.eficiencia_paneles), borderColor: 'rgba(75, 192, 192, 1)', tension: 0.1 },
      { label: 'Producción de energía', data: lecturasDepuradas.map(lectura => lectura.produccion_energia), borderColor: 'rgba(255, 99, 132, 1)', tension: 0.1 }
    ];

    // Añadir los arrays a la gráfica
    chart.data.labels = labels;
    chart.data.datasets = datasets;

    // Actualiza la gráfica
    chart.update();
    console.log('Datos de la gráfica:', chart.data); // Verifica la actualización de la gráfica


    
  // Calcular los porcentajes de los estados de los paneles e inversores
  let porcentajesPaneles = calcularPorcentajeEstadosPaneles(lecturasDepuradas2);
  let porcentajesInversores = calcularPorcentajeEstadosInversores(lecturasDepuradas2);

  // Actualizar el contenido de los elementos con los porcentajes
  document.getElementById('porcentaje_estado_paneles_bueno').innerText = 'Bueno: ' + porcentajesPaneles['bueno'] + '%';
  document.getElementById('porcentaje_estado_paneles_normal').innerText = 'Normal: ' + porcentajesPaneles['normal'] + '%';
  document.getElementById('porcentaje_estado_paneles_excelente').innerText = 'Excelente: ' + porcentajesPaneles['excelente'] + '%';
  document.getElementById('porcentaje_estado_paneles_defectuoso').innerText = 'Defectuoso: ' + porcentajesPaneles['defectuoso'] + '%';

  document.getElementById('porcentaje_estado_inversores_mantenimiento').innerText = 'En mantenimiento: ' + porcentajesInversores['en_mantenimiento'] + '%';
  document.getElementById('porcentaje_estado_inversores_dañado').innerText = 'Dañado: ' + porcentajesInversores['dañado'] + '%';
  document.getElementById('porcentaje_estado_inversores_funcionando').innerText = 'Funcionando: ' + porcentajesInversores['funcionando'] + '%';
}

// Llama a la función para actualizar la gráfica con los datos de la planta solar
actualizarGrafica();



