/**
 * Sitio Web Pasto Sintético - Funcionalidades JavaScript
 * Este archivo contiene todas las funcionalidades interactivas del sitio web
 */

// Esperar a que el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // === CAROUSEL FUNCTIONALITY ===
    initCarousel();
    
    // === QUOTE CALCULATOR FUNCTIONALITY ===
    initQuoteCalculator();
});

/**
 * Inicializa el carousel de imágenes
 */
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    
    // Variables para el funcionamiento del carousel
    let currentIndex = 0;
    const slideWidth = 100; // porcentaje
    let autoSlideInterval;
    
    // Función para mostrar un slide específico
    function showSlide(index) {
        // Controlar los límites (loop)
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        
        // Actualizar el índice actual
        currentIndex = index;
        
        // Mover el carousel
        carousel.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
        
        // Actualizar los indicadores (dots)
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Configurar listeners para las flechas de navegación
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentIndex - 1);
            resetAutoSlide(); // Reiniciar el temporizador
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentIndex + 1);
            resetAutoSlide(); // Reiniciar el temporizador
        });
    }
    
    // Configurar listeners para los dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
            resetAutoSlide(); // Reiniciar el temporizador
        });
    });
    
    // Función para iniciar el auto-slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 5000); // Cambiar slide cada 5 segundos
    }
    
    // Función para reiniciar el temporizador de auto-slide
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Iniciar el auto-slide
    startAutoSlide();
}

/**
 * Inicializa la calculadora de cotizaciones
 */
function initQuoteCalculator() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('quote-result');
    
    // Si no existe el botón de calcular, salir de la función
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', function() {
        const grassTypeSelect = document.getElementById('grass-type');
        const squareMetersInput = document.getElementById('square-meters');
        
        // Validar que los elementos existan
        if (!grassTypeSelect || !squareMetersInput || !resultContainer) {
            console.error('Elementos del cotizador no encontrados');
            return;
        }
        
        // Obtener los valores seleccionados
        const grassTypeValue = parseInt(grassTypeSelect.value);
        const squareMeters = parseFloat(squareMetersInput.value);
        
        // Validar que se hayan ingresado valores válidos
        if (isNaN(grassTypeValue) || grassTypeValue <= 0) {
            alert('Por favor, seleccione un tipo de pasto.');
            return;
        }
        
        if (isNaN(squareMeters) || squareMeters <= 0) {
            alert('Por favor, ingrese un área válida en metros cuadrados.');
            return;
        }
        
        // Obtener el nombre del tipo de pasto seleccionado
        const selectedOption = grassTypeSelect.options[grassTypeSelect.selectedIndex];
        const grassTypeName = selectedOption ? selectedOption.text : 'No seleccionado';
        
        // Realizar los cálculos
        const materialCost = grassTypeValue * squareMeters;
        const installationCost = materialCost * 0.2; // 20% sobre el costo del material
        const totalCost = materialCost + installationCost;
        
        // Actualizar el contenido de los resultados
        document.getElementById('result-type').textContent = grassTypeName;
        document.getElementById('result-area').textContent = squareMeters;
        document.getElementById('result-material-cost').textContent = materialCost.toLocaleString();
        document.getElementById('result-installation-cost').textContent = installationCost.toLocaleString();
        document.getElementById('result-total').textContent = totalCost.toLocaleString();
        
        // Mostrar el contenedor de resultados
        resultContainer.classList.add('active');
    });
}