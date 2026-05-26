document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. EFECTO DE SCROLL EN HEADER
       ========================================================================== */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    /* ==========================================================================
       2. MENÚ RESPONSIVE MÓVIL
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        // Cambiar icono de barras a cruz cuando esté abierto
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('open')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars-staggered';
        }
    });

    // Cerrar menú móvil al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            menuToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
        });
    });

    /* ==========================================================================
       3. EFECTO DE ESCRITURA MÁQUINA (HERO TYPING EFFECT)
       ========================================================================== */
    const typingTextElement = document.getElementById('typing-text');
    const phrases = [
        "Especialista en Unity & Blender 3D",
        "Desarrolladora de Apps Móviles (Flutter & Java)",
        "Integración de Sistemas IoT & Hardware",
        "Técnica Superior en DAM (Multiplataforma)"
    ];
    
    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Borrando caracteres
            typingTextElement.textContent = currentPhrase.substring(0, characterIndex - 1);
            characterIndex--;
            typingSpeed = 50; // Velocidad de borrado rápida
        } else {
            // Escribiendo caracteres
            typingTextElement.textContent = currentPhrase.substring(0, characterIndex + 1);
            characterIndex++;
            typingSpeed = 100; // Velocidad normal
        }

        // Si terminó de escribir la frase
        if (!isDeleting && characterIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pausa al final de escribir la frase entera
        } 
        // Si terminó de borrar la frase
        else if (isDeleting && characterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pausa corta antes de empezar a escribir la nueva frase
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Iniciar efecto de máquina de escribir
    if (typingTextElement) {
        setTimeout(typeEffect, 1000);
    }

    /* ==========================================================================
       4. INTERSECTION OBSERVER - NAVEGACIÓN ACTIVA & TIMELINE
       ========================================================================== */
    
    // A) Actualizar enlace activo en la navegación flotante
    const sections = document.querySelectorAll('section, header');
    const navLinksList = document.querySelectorAll('.nav-link');
    
    const navObserverOptions = {
        root: null,
        threshold: 0.3, // Se activa cuando el 30% de la sección es visible
        rootMargin: "-80px 0px 0px 0px"
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                    // Caso especial para cuando estamos muy al principio (Header)
                    if (id === 'inicio' && link.getAttribute('href') === '#inicio') {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // B) Animación del Timeline de Trayectoria (Slide Up progresivo)
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserverOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                timelineObserver.unobserve(entry.target); // Detener observación tras animar
            }
        });
    }, timelineObserverOptions);

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // C) Animación de Barras de Progreso de Habilidades al entrar en vista
    const skillsSection = document.querySelector('.skills-section');
    const skillsObserverOptions = {
        root: null,
        threshold: 0.2
    };

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillsSection.classList.add('animate-skills');
                skillsObserver.unobserve(entry.target);
            }
        });
    }, skillsObserverOptions);

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    /* ==========================================================================
       5. FILTRO DINÁMICO DE PROYECTOS (PORTAFOLIO)
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase activa de todos los botones y agregarla al actual
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Efecto de desvanecimiento suave antes de filtrar
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 300);
            });
        });
    });

    /* ==========================================================================
       6. FORMULARIO DE CONTACTO (VALIDACIÓN & FEEDBACK PREMIUM)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('btn-submit');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Deshabilitar botón y cambiar a estado cargando
            submitBtn.disabled = true;
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Enviando...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            
            // Simular respuesta del servidor tras 1.5s
            setTimeout(() => {
                const nameValue = document.getElementById('name').value.trim();
                const emailValue = document.getElementById('email').value.trim();

                if (nameValue === "" || emailValue === "") {
                    // Estado de Error
                    formFeedback.className = "form-feedback error";
                    formFeedback.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Por favor, rellena todos los campos obligatorios.`;
                    
                    // Restaurar botón
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                } else {
                    // Estado de Éxito
                    formFeedback.className = "form-feedback success";
                    formFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> ¡Gracias, ${nameValue}! Tu mensaje ha sido enviado con éxito.`;
                    
                    // Limpiar Formulario
                    contactForm.reset();
                    
                    // Restaurar botón tras unos segundos
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnContent;
                        formFeedback.style.display = 'none';
                    }, 4000);
                }
            }, 1500);
        });
    }

    /* ==========================================================================
       7. CONTADORES ANIMADOS DE ESTADÍSTICAS EN SOBRE MÍ
       ========================================================================== */
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.about-stats-grid');
    let animatedStats = false;

    function animateStatsCounter() {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            let current = 0;
            const isPercentage = stat.textContent.includes('%');
            const isK = stat.textContent.includes('K');
            const hasPlus = stat.textContent.includes('+');
            
            const increment = target / 40; // Dividir en 40 iteraciones para suavidad
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    if (isPercentage) {
                        stat.textContent = Math.round(current) + '%';
                    } else if (isK) {
                        stat.textContent = (current / 1000).toFixed(1) + 'K+';
                    } else {
                        stat.textContent = Math.round(current) + (hasPlus ? '+' : '');
                    }
                    setTimeout(updateCounter, 25);
                } else {
                    if (isPercentage) {
                        stat.textContent = target + '%';
                    } else if (isK) {
                        stat.textContent = (target / 1000).toFixed(1) + 'K+';
                    } else {
                        stat.textContent = target + (hasPlus ? '+' : '');
                    }
                }
            };
            updateCounter();
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedStats) {
                animateStatsCounter();
                animatedStats = true; // Solo animar una vez
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});
