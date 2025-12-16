// Variables globales
let airlines = [];
let airports = [];
let bundles = [];

// Cargar datos al iniciar
fetch('./bundles.json')
  .then(res => res.json())
  .then(data => {
    airlines = data.airlines;
    airports = data.airports;
    bundles = data.bundles;
    
    // Cargar aerolíneas en el select
    loadAirlines();
  })
  .catch(error => {
    console.error('Error al cargar datos:', error);
  });

// Función para cargar las aerolíneas en el select
function loadAirlines() {
  const select = document.getElementById('airlineSelect');
  
  if (!select) {
    console.error('No se encontró el elemento airlineSelect');
    return;
  }
  
  select.innerHTML = '<option value="">Selecciona una aerolínea</option>';

  airlines.forEach(airline => {
    const option = document.createElement('option');
    option.value = airline.id;
    option.textContent = `${airline.name} (${airline.code})`;
    select.appendChild(option);
  });
}

// Variable global para unidades
let isMetric = true; // true = CM/KG, false = Inches/LBS
let rowCounter = 1; // Contador para IDs de filas

// Event listener para cuando cambie la aerolínea seleccionada
document.addEventListener('DOMContentLoaded', () => {
  const airlineSelect = document.getElementById('airlineSelect');
  
  if (airlineSelect) {
    airlineSelect.addEventListener('change', (e) => {
      const selectedId = parseInt(e.target.value);
      const selectedAirline = airlines.find(a => a.id === selectedId);
      
      if (selectedAirline) {
        console.log('Aerolínea seleccionada:', selectedAirline);
        // Aquí puedes agregar lógica adicional cuando se seleccione una aerolínea
      }
    });
  }
  
  // Toggle de unidades
  setupUnitToggle();
  
  // Calcular perímetro en todas las filas existentes
  calculateAllPerimeters();
  
  // Agregar event listeners a los inputs de la primera fila
  attachInputListeners();
  
  // Botón para agregar filas
  const addRowBtn = document.getElementById('addRowBtn');
  if (addRowBtn) {
    addRowBtn.addEventListener('click', addMerchandiseRow);
  }
  
  // Botón para generar bundle
  const generateBundleBtn = document.getElementById('generateBundleBtn');
  if (generateBundleBtn) {
    generateBundleBtn.addEventListener('click', generateBundle);
  }
  
  // Botón para resetear
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetForm);
  }
});

// Configurar el toggle de unidades
function setupUnitToggle() {
  const toggle = document.getElementById('unitToggle');
  const label = document.getElementById('unitLabel');
  
  if (toggle) {
    toggle.addEventListener('click', () => {
      isMetric = !isMetric;
      
      // Actualizar estilos del toggle
      if (isMetric) {
        toggle.classList.remove('bg-orange-600');
        toggle.classList.add('bg-blue-600');
        label.textContent = 'CM';
        toggle.querySelector('span:last-child').classList.remove('translate-x-12');
        toggle.querySelector('span:last-child').classList.add('translate-x-1');
      } else {
        toggle.classList.remove('bg-blue-600');
        toggle.classList.add('bg-orange-600');
        label.textContent = 'IN';
        label.classList.remove('left-2');
        label.classList.add('right-2', 'left-auto');
        toggle.querySelector('span:last-child').classList.remove('translate-x-1');
        toggle.querySelector('span:last-child').classList.add('translate-x-12');
      }
      
      // Actualizar etiquetas de unidades
      updateUnitLabels();
      
      // Convertir valores existentes
      convertAllValues();
    });
  }
}

// Actualizar las etiquetas de unidades en la tabla
function updateUnitLabels() {
  const lengthUnit = document.getElementById('lengthUnit');
  const widthUnit = document.getElementById('widthUnit');
  const heightUnit = document.getElementById('heightUnit');
  const weightUnit = document.getElementById('weightUnit');
  const perimeterUnit = document.getElementById('perimeterUnit');
  
  if (isMetric) {
    lengthUnit.textContent = '(cm)';
    widthUnit.textContent = '(cm)';
    heightUnit.textContent = '(cm)';
    weightUnit.textContent = '(kg)';
    perimeterUnit.textContent = '(cm)';
  } else {
    lengthUnit.textContent = '(in)';
    widthUnit.textContent = '(in)';
    heightUnit.textContent = '(in)';
    weightUnit.textContent = '(lbs)';
    perimeterUnit.textContent = '(in)';
  }
}

// Convertir todos los valores cuando cambia la unidad
function convertAllValues() {
  const rows = document.querySelectorAll('#merchandiseTableBody tr');
  
  rows.forEach(row => {
    const lengthInput = row.querySelector('.length-input');
    const widthInput = row.querySelector('.width-input');
    const heightInput = row.querySelector('.height-input');
    const weightInput = row.querySelector('.weight-input');
    
    if (lengthInput) lengthInput.value = convertValue(lengthInput.value);
    if (widthInput) widthInput.value = convertValue(widthInput.value);
    if (heightInput) heightInput.value = convertValue(heightInput.value);
    if (weightInput) weightInput.value = convertWeight(weightInput.value);
    
    calculatePerimeter(row);
  });
}

// Convertir valor de distancia
function convertValue(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return '';
  
  if (isMetric) {
    // Convertir de inches a cm
    return (num * 2.54).toFixed(2);
  } else {
    // Convertir de cm a inches
    return (num / 2.54).toFixed(2);
  }
}

// Convertir peso
function convertWeight(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return '';
  
  if (isMetric) {
    // Convertir de lbs a kg
    return (num * 0.453592).toFixed(2);
  } else {
    // Convertir de kg a lbs
    return (num / 0.453592).toFixed(2);
  }
}

// Calcular perímetro de una fila
function calculatePerimeter(row) {
  const lengthInput = row.querySelector('.length-input');
  const widthInput = row.querySelector('.width-input');
  const heightInput = row.querySelector('.height-input');
  const perimeterInput = row.querySelector('.perimeter-input');
  
  const length = parseFloat(lengthInput.value) || 0;
  const width = parseFloat(widthInput.value) || 0;
  const height = parseFloat(heightInput.value) || 0;
  
  // Fórmula: Perímetro = Longitud + 2 × (Ancho + Alto)
  const perimeter = length + 2 * (width + height);
  
  perimeterInput.value = perimeter.toFixed(2);
}

// Calcular perímetro en todas las filas
function calculateAllPerimeters() {
  const rows = document.querySelectorAll('#merchandiseTableBody tr');
  rows.forEach(row => calculatePerimeter(row));
}

// Agregar event listeners a los inputs de una fila
function attachInputListeners(row = null) {
  const rows = row ? [row] : document.querySelectorAll('#merchandiseTableBody tr');
  
  rows.forEach(row => {
    const dimensionInputs = row.querySelectorAll('.length-input, .width-input, .height-input');
    
    dimensionInputs.forEach(input => {
      input.addEventListener('input', () => calculatePerimeter(row));
    });
  });
}

// Agregar nueva fila de mercancía
function addMerchandiseRow() {
  const tbody = document.getElementById('merchandiseTableBody');
  const rowId = String.fromCharCode(65 + rowCounter); // A, B, C, etc.
  rowCounter++;
  
  const newRow = document.createElement('tr');
  newRow.className = 'border-t';
  newRow.innerHTML = `
    <td class="p-3 font-medium">${rowId}</td>
    <td class="p-3"><input type="number" class="input border rounded px-2 py-1 w-20" value="1" min="1" /></td>
    <td class="p-3"><input type="number" class="length-input border rounded px-2 py-1 w-20" value="0" step="0.1" /></td>
    <td class="p-3"><input type="number" class="width-input border rounded px-2 py-1 w-20" value="0" step="0.1" /></td>
    <td class="p-3"><input type="number" class="height-input border rounded px-2 py-1 w-20" value="0" step="0.1" /></td>
    <td class="p-3"><input type="number" class="weight-input border rounded px-2 py-1 w-20" value="0" step="0.1" /></td>
    <td class="p-3"><input type="number" class="perimeter-input border rounded px-2 py-1 w-20" value="0" step="0.1" readonly /></td>
  `;
  
  tbody.appendChild(newRow);
  
  // Agregar event listeners a la nueva fila
  attachInputListeners(newRow);
  
  // Calcular perímetro inicial
  calculatePerimeter(newRow);
}

// Generar Bundle - Calcular totales
function generateBundle() {
  const airlineSelect = document.getElementById('airlineSelect');
  
  // Validar que se haya seleccionado una aerolínea
  if (!airlineSelect.value) {
    alert('Por favor selecciona una aerolínea');
    return;
  }
  
  let totalCheckin = 0;
  let totalOversize = 0;
  let totalOverweight = 0;
  let totalPieces = 0;
  
  // Obtener todas las filas de mercancía
  const rows = document.querySelectorAll('#merchandiseTableBody tr');
  
  rows.forEach(row => {
    const quantityInput = row.querySelector('input[type="number"]');
    const quantity = parseInt(quantityInput.value) || 0;
    
    // Por ahora, todas las piezas van a check-in
    // (En el futuro podrías agregar lógica para detectar oversize/overweight)
    totalCheckin += quantity;
    totalPieces += quantity;
  });
  
  // Actualizar la UI con los resultados
  updateResults(totalCheckin, totalOversize, totalOverweight, totalPieces);
  
  // Scroll suave hacia los resultados
  document.getElementById('checkinCount').parentElement.parentElement.parentElement.scrollIntoView({ 
    behavior: 'smooth',
    block: 'nearest'
  });
}

// Actualizar los resultados en la UI
function updateResults(checkin, oversize, overweight, total) {
  const checkinCount = document.getElementById('checkinCount');
  const oversizeCount = document.getElementById('oversizeCount');
  const overweightCount = document.getElementById('overweightCount');
  const totalPiecesCount = document.getElementById('totalPieces');
  
  // Animación de contador
  animateCount(checkinCount, checkin);
  animateCount(oversizeCount, oversize);
  animateCount(overweightCount, overweight);
  animateCount(totalPiecesCount, total);
  
  // Aplicar color rojo si hay overweight
  if (overweight > 0) {
    overweightCount.classList.add('text-red-600');
  } else {
    overweightCount.classList.remove('text-red-600');
  }
  
  // Aplicar color naranja si hay oversize
  if (oversize > 0) {
    oversizeCount.classList.add('text-orange-600');
  } else {
    oversizeCount.classList.remove('text-orange-600');
  }
}

// Animar el contador
function animateCount(element, target) {
  const current = parseInt(element.textContent) || 0;
  
  // Si ya está en el valor objetivo, no hacer nada
  if (current === target) return;
  
  const increment = target > current ? 1 : -1;
  const duration = 300; // ms
  const steps = Math.abs(target - current);
  const stepDuration = steps > 0 ? Math.max(duration / steps, 10) : 0;
  
  let count = current;
  
  const timer = setInterval(() => {
    count += increment;
    element.textContent = count;
    
    // Detener cuando alcanzamos el objetivo
    if ((increment > 0 && count >= target) || (increment < 0 && count <= target)) {
      element.textContent = target; // Asegurar valor exacto
      clearInterval(timer);
    }
  }, stepDuration);
}

// Resetear el formulario
function resetForm() {
  // Resetear select de aerolínea
  const airlineSelect = document.getElementById('airlineSelect');
  if (airlineSelect) {
    airlineSelect.value = '';
  }
  
  // Limpiar todas las filas excepto la primera
  const tbody = document.getElementById('merchandiseTableBody');
  const rows = tbody.querySelectorAll('tr');
  
  // Eliminar filas adicionales
  for (let i = rows.length - 1; i > 0; i--) {
    rows[i].remove();
  }
  
  // Resetear la primera fila
  if (rows[0]) {
    rows[0].querySelector('input[type="number"]').value = 1;
    rows[0].querySelector('.length-input').value = 0;
    rows[0].querySelector('.width-input').value = 0;
    rows[0].querySelector('.height-input').value = 0;
    rows[0].querySelector('.weight-input').value = 0;
    rows[0].querySelector('.perimeter-input').value = 0;
  }
  
  // Resetear contador de filas
  rowCounter = 1;
  
  // Resetear resultados
  updateResults(0, 0, 0, 0);
  
  // Volver a unidades métricas si está en inches
  if (!isMetric) {
    document.getElementById('unitToggle').click();
  }
}
