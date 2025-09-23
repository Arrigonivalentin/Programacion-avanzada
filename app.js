const budget = 800;
const resultsDiv = document.getElementById("results");
const recommendationDiv = document.getElementById("recommendation");
const sortSelect = document.getElementById("sort");

let validFlights = []; // lo guardamos global para reordenar sin volver a cargar

// Función para renderizar los vuelos
function renderFlights(flights) {
  resultsDiv.innerHTML = "<h2>Vuelos disponibles</h2>";
  flights.forEach(f => {
    resultsDiv.innerHTML += `
      <div class="card">
        <strong>Destino:</strong> ${f.destination} <br>
        <strong>Origen:</strong> ${f.origin} <br>
        <strong>Precio Ida:</strong> $${f.price.toFixed(2)} <br>
        <strong>Precio Total (Ida y Vuelta):</strong> $${(f.price * 2).toFixed(2)} <br>
        <strong>Fecha:</strong> ${new Date(f.date).toLocaleDateString()} <br>
        <strong>Disponibilidad:</strong> ${f.availability} lugares
      </div>
    `;
  });
}

// Función para recomendar
function renderRecommendation(flights) {
  if (flights.length === 0) {
    recommendationDiv.innerHTML = "";
    return;
  }
  const bestFlight = flights[0]; // ya está ordenado según criterio
  recommendationDiv.innerHTML = `
    <h2>Recomendación de Valentina 👩‍💻</h2>
    <p>El vuelo más conveniente es a <strong>${bestFlight.destination}</strong> 
    por $${(bestFlight.price * 2).toFixed(2)} ida y vuelta, 
    el día ${new Date(bestFlight.date).toLocaleDateString()}.</p>
  `;
}

// Función para aplicar criterio de orden
function sortFlights(criteria) {
  let sorted = [...validFlights];
  if (criteria === "cheap") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (criteria === "availability") {
    sorted.sort((a, b) => b.availability - a.availability);
  } else if (criteria === "date") {
    sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  renderFlights(sorted);
  renderRecommendation(sorted);
}

// Cargar dataset.json
fetch("dataset.json")
  .then(response => response.json())
  .then(flights => {
    // Filtrar vuelos ida y vuelta dentro del presupuesto
    validFlights = flights.filter(f => f.price * 2 <= budget);

    if (validFlights.length === 0) {
      resultsDiv.innerHTML = "<p>No hay vuelos disponibles con tu presupuesto 😢</p>";
    } else {
      sortFlights("cheap"); // por defecto los más baratos
    }
  })
  .catch(err => {
    resultsDiv.innerHTML = "<p>Error cargando los datos 😵</p>";
    console.error(err);
  });

// Escuchar cambios en el selector
sortSelect.addEventListener("change", e => {
  sortFlights(e.target.value);
});
