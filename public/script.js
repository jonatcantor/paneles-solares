// script.js

// Función para cargar los datos a Firebase utilizando una solicitud HTTP POST
async function cargarDatosAFirebase(datos) {
  // Iterar sobre los datos y cargarlos en Firebase
  for (let dato of datos) {
    // Hacer una solicitud POST para cada dato
    await fetch('/api/planta_solar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dato),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }
}


// Función para mostrar una vista y ocultar la otra
function mostrarVista(vistaId) {
  const vistas = document.querySelectorAll('.view');
  vistas.forEach(vista => {
    if (vista.id === vistaId) {
      vista.style.display = 'block';
    } else {
      vista.style.display = 'none';
    }
  });
}


document.addEventListener('DOMContentLoaded', function() {
  // Función para mostrar una vista y ocultar la otra
  function mostrarVista(vistaId) {
    const vistas = document.querySelectorAll('.view');
    vistas.forEach(vista => {
      if (vista.id === vistaId) {
        vista.style.display = 'block';
      } else {
        vista.style.display = 'none';
      }
    });
  }

  // Mostrar la vista de Monitoreo por defecto
  mostrarVista('monitoreo');

  // Datos iniciales
  let lecturas = {
    "-NyWpQhG0F_AKx5xe6hS": {
      "eficiencia_paneles": "3",
      "estado_componentes": "bueno",
      "estado_inversores": "en_mantenimiento",
      "fecha_hora": "2024-05-07T01:01",
      "produccion_energia": "3"
    },
    // ...resto de los datos
  };

// Array para almacenar los datos generados
let datosGenerados = [];


// Función para generar datos aleatorios
function generarDatos() {
  const horaDelDia = new Date().getHours();
  const variacion = Math.random() * 20 - 10; // Genera un número aleatorio entre -10 y 10
  const produccionEnergia = (Math.sin(horaDelDia / 12 * Math.PI) * 50 + 50) + variacion; // Añade la variación al valor existente

  return {
    "eficiencia_paneles": Math.floor(Math.random() * 6).toString(), // Genera un número entre 0 y 5
    "estado_componentes": ["bueno", "normal", "excelente", "defectuoso"][Math.floor(Math.random() * 4)], // Selecciona un estado al azar
    "estado_inversores": ["funcionando", "en_mantenimiento", "dañado"][Math.floor(Math.random() * 3)], // Selecciona un estado al azar
    "fecha_hora": new Date().toISOString(),
    "produccion_energia": produccionEnergia.toFixed(2) // Usa el valor calculado para la producción de energía
  };
}

// Función para agregar los datos generados a las lecturas
function agregarDatos() {
  const id = "-" + Math.random().toString(36).substr(2, 9); // Genera un ID único
  const datos = generarDatos();
  lecturas[id] = datos;
  
  // Agrega los datos al array
  datosGenerados.push(datos);
  
  // Actualiza los elementos en el HTML con los nuevos datos
  document.getElementById('produccion_energia').innerText = lecturas[id].produccion_energia + " kWh";
  document.getElementById('estado_componentes').innerText = lecturas[id].estado_componentes;
  document.getElementById('estado_inversores').innerText = lecturas[id].estado_inversores;
  document.getElementById('eficiencia_paneles').innerText = lecturas[id].eficiencia_paneles; 
  document.getElementById('fecha_hora').innerText = new Date(lecturas[id].fecha_hora).toLocaleString();
  
  // Llama a la misma función después de 1 segundo
  setTimeout(agregarDatos, 1000);
}

// Agrega un evento de clic al botón para iniciar la generación de datos
document.getElementById('startButton').addEventListener('click', () => {
  // Inicia la generación de datos
  agregarDatos();

  // Detiene la generación de datos y los carga a la API después de 2 minutos
  setTimeout(() => {
    clearTimeout(agregarDatos);
    cargarDatosAFirebase(datosGenerados);
  }, 60000);
});
});
