document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('header-scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    });

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = menuToggle.querySelector('i');
        icon.className = navMenu.classList.contains('open')
            ? 'fa-solid fa-xmark'
            : 'fa-solid fa-bars-staggered';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            menuToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
        });
    });

    const typingTextElement = document.getElementById('typing-text');
    const phrases = [
        "Especializado en Unity & Blender 3D",
        "Desarrollador de Apps Móviles (Flutter & Java)",
        "Integración de Sistemas IoT & Hardware",
        "Bases de datos, backend & metodologías ágiles",
        "Programador curioso de toda tecnología nueva",
        "Técnico Superior en DAM (Multiplataforma)"
    ];

    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingTextElement.textContent = currentPhrase.substring(0, characterIndex - 1);
            characterIndex--;
            typingSpeed = 50;
        } else {
            typingTextElement.textContent = currentPhrase.substring(0, characterIndex + 1);
            characterIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && characterIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && characterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typingTextElement) setTimeout(typeEffect, 1000);

    const sections = document.querySelectorAll('section, header');
    const navObserverOptions = {
        root: null,
        threshold: 0.3,
        rootMargin: "-80px 0px 0px 0px"
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    const timelineItems = document.querySelectorAll('.timeline-item');
    if ('IntersectionObserver' in window) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        timelineItems.forEach(item => timelineObserver.observe(item));
    } else {
        timelineItems.forEach(item => item.classList.add('show'));
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                card.style.opacity = '0';

                setTimeout(() => {
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 300);
            });
        });
    });

    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('btn-submit');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Enviando...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            setTimeout(() => {
                if (!data.name || !data.email) {
                    formFeedback.className = "form-feedback error";
                    formFeedback.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Por favor, rellena todos los campos obligatorios.`;
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                } else {
                    formFeedback.className = "form-feedback success";
                    formFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> ¡Gracias, ${data.name}! Tu mensaje ha sido enviado con éxito.`;
                    contactForm.reset();
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnContent;
                        formFeedback.style.display = '';
                    }, 4000);
                }
            }, 1500);
        });
    }
});
