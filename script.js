**
 * Sitio Web Pasto Sintético - Funcionalidades JavaScript
 * Este archivo contiene todas las funcionalidades interactivas del sitio web
 */

// Esperar a que el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // === CAROUSEL FUNCTIONALITY ===
    initCarousel();
    
    // === QUOTE CALCULATOR FUNCTIONALITY ===
    initQuoteCalculator();
    
    // === FORM SUBMISSION HANDLING ===
    initFormSubmission();
    
    // === LAZY LOADING PARA IMÁGENES ===
    initLazyLoading();
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
    
    // Si no se encuentra el carousel, salir de la función
    if (!carousel || !slides.length) return;
    
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
        
        // Precargar la imagen del siguiente slide (para mejorar rendimiento)
        const nextIndex = (currentIndex + 1) % slides.length;
        const nextSlideImg = slides[nextIndex].querySelector('img');
        if (nextSlideImg && nextSlideImg.getAttribute('data-src')) {
            nextSlideImg.src = nextSlideImg.getAttribute('data-src');
            nextSlideImg.removeAttribute('data-src');
        }
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
    
    // Asegurarse de que la primera imagen esté cargada
    const firstSlideImg = slides[0].querySelector('img');
    if (firstSlideImg && !firstSlideImg.complete) {
        firstSlideImg.onload = () => {
            // Iniciar el auto-slide una vez que la primera imagen esté cargada
            startAutoSlide();
        };
    } else {
        // Si la imagen ya está cargada o no hay imagen, iniciar el auto-slide
        startAutoSlide();
    }
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
        
        // Mostrar el contenedor de resultados con animación
        resultContainer.classList.add('active');
        resultContainer.style.animation = 'fadeIn 0.5s ease-in-out';
        
        // Hacer scroll hasta el contenedor de resultados
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

/**
 * Inicializa la funcionalidad de envío del formulario
 * con integración a webhook
 */
function initFormSubmission() {
    const quoteForm = document.getElementById('quoteForm');
    
    // Si no existe el formulario, salir
    if (!quoteForm) return;
    
    // Añadir validación al formulario
    quoteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validar el formulario antes de enviar
        if (validateForm()) {
            // Recopilar los datos del formulario
            const formData = {
                fullname: document.getElementById('fullname').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                contactPreference: document.getElementById('contact-preference').value,
                grassType: document.getElementById('grass-type').value,
                grassTypeName: document.getElementById('grass-type').options[document.getElementById('grass-type').selectedIndex].text,
                squareMeters: document.getElementById('square-meters').value,
                comments: document.getElementById('comments').value,
                estimatedTotal: document.getElementById('result-total').textContent || 'No calculado'
            };
            
            // Aquí iría la integración con el webhook
            sendToWebhook(formData);
        }
    });
    
    /**
     * Valida todos los campos del formulario
     * @returns {boolean} - True si el formulario es válido, false en caso contrario
     */
    function validateForm() {
        let isValid = true;
        const requiredFields = [
            'fullname', 
            'email', 
            'phone', 
            'contact-preference',
            'grass-type',
            'square-meters'
        ];
        
        // Restablecer mensajes de error
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.style.display = 'none';
        });
        
        document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        // Validar campos requeridos
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Mostrar mensaje de error si existe
                const errorMsg = field.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.style.display = 'block';
                }
            }
        });
        
        // Validar formato de email
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            isValid = false;
            emailField.classList.add('error');
            
            // Mostrar mensaje de error específico para email inválido
            const errorMsg = emailField.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.textContent = 'Por favor, ingrese un correo electrónico válido.';
                errorMsg.style.display = 'block';
            }
        }
        
        return isValid;
    }
    
    /**
     * Valida el formato de un email
     * @param {string} email - Email a validar
     * @returns {boolean} - True si el email es válido, false en caso contrario
     */
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    /**
     * Envía los datos del formulario al webhook
     * @param {Object} data - Datos a enviar al webhook
     */
    function sendToWebhook(data) {
        // URL del webhook (a reemplazar con la URL real)
        const webhookUrl = 'https://tu-webhook-url.com/endpoint';
        
        // Mostrar indicador de carga
        const submitButton = document.getElementById('submit-quote');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        // Simular envío con setTimeout (reemplazar con fetch real)
        setTimeout(() => {
            // Este código simula una respuesta exitosa
            // En producción, reemplazar con fetch real al webhook
            
            /*
            // Código de ejemplo para envío real con fetch:
            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(responseData => {
                showSuccessMessage();
                resetForm();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al enviar el formulario. Por favor, inténtelo nuevamente.');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
            */
            
            // Código simulado: Mostrar éxito y resetear formulario
            showSuccessMessage();
            resetForm();
            
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }, 1500);
    }
    
    /**
     * Muestra un mensaje de éxito después de enviar el formulario
     */
    function showSuccessMessage() {
        let successMsg = document.querySelector('.success-message');
        
        // Si no existe el mensaje de éxito, crearlo
        if (!successMsg) {
            successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.innerHTML = '<p><strong>¡Solicitud enviada correctamente!</strong></p>' +
                                 '<p>Gracias por su interés. Nos pondremos en contacto a la brevedad.</p>';
            
            // Insertar después del formulario
            quoteForm.parentNode.insertBefore(successMsg, quoteForm.nextSibling);
        }
        
        // Mostrar mensaje
        successMsg.classList.add('active');
        
        // Hacer scroll hasta el mensaje
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    /**
     * Resetea el formulario a su estado inicial
     */
    function resetForm() {
        quoteForm.reset();
        
        // Ocultar los resultados del cálculo
        const resultContainer = document.getElementById('quote-result');
        if (resultContainer) {
            resultContainer.classList.remove('active');
        }
    }
}

/**
 * Inicializa la carga diferida de imágenes (lazy loading)
 * para mejorar el rendimiento del sitio
 */
function initLazyLoading() {
    // Verificar si el navegador soporta IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Si la imagen tiene el atributo data-src, cargamos la imagen
                    if (img.getAttribute('data-src')) {
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                    }
                    
                    // Dejar de observar la imagen una vez cargada
                    observer.unobserve(img);
                }
            });
        });
        
        // Observar todas las imágenes que tengan el atributo data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imgObserver.observe(img);
        });
    } else {
        // Fallback para navegadores que no soportan IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}