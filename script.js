/* ==========================================================================
   DUA MUSIC CLUB — INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. STICKY HEADER & SCROLL BEHAVIOR */
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once at start to capture reload state


    /* 2. MOBILE NAV MENU TOGGLE */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navBookingBtn = document.getElementById('nav-booking-btn');

    const toggleMenu = () => {
        const isOpen = navMenu.classList.contains('open');
        navMenu.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', !isOpen);
    };

    const closeMenu = () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking navigation links or the action button
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    if (navBookingBtn) {
        navBookingBtn.addEventListener('click', closeMenu);
    }


    /* 3. ACTIVE SECTION HIGHLIGHT ON SCROLL */
    const sections = document.querySelectorAll('section');
    
    const navObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Triggers when the section occupies the middle zone of the screen
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));


    /* 4. SCROLL REVEAL ANIMATION */
    const revealItems = document.querySelectorAll('.reveal-up');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Triggers slightly before element enters viewport
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, revealObserverOptions);

    revealItems.forEach(item => revealObserver.observe(item));


    /* 5. EL ESPACIO: 3D COVERFLOW CAROUSEL & LIGHTBOX SYSTEM */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');

    // Build the playlist/gallery dataset array for lightbox cycling
    const galleryData = Array.from(galleryItems).map(item => {
        const catEl = item.querySelector('.gallery-category');
        return {
            src: item.getAttribute('data-src'),
            title: item.getAttribute('data-title'),
            category: catEl ? catEl.textContent : ''
        };
    });

    let activeIndex = 2; // Default starting slide: Coctelería
    let currentPhotoIndex = 0;
    let autoplayInterval = null;
    const autoplayDelay = 3500; // 3.5 seconds

    // Autoplay controller functions
    const startAutoplay = () => {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            activeIndex = (activeIndex + 1) % galleryItems.length;
            updateCarousel();
        }, autoplayDelay);
    };

    const stopAutoplay = () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    };

    const resetAutoplay = () => {
        startAutoplay();
    };

    // Coverflow update logic
    const updateCarousel = () => {
        const total = galleryItems.length;
        galleryItems.forEach((item, idx) => {
            // Clear coverflow layout classes
            item.classList.remove('active-slide', 'prev-1', 'next-1', 'prev-2', 'next-2', 'hidden-slide');

            let diff = idx - activeIndex;

            // Calculate circular distance
            diff = ((diff % total) + total) % total;
            if (diff > total / 2) {
                diff -= total;
            }

            // Assign structural layout classes
            if (diff === 0) {
                item.classList.add('active-slide');
            } else if (diff === -1) {
                item.classList.add('prev-1');
            } else if (diff === 1) {
                item.classList.add('next-1');
            } else if (diff === -2) {
                item.classList.add('prev-2');
            } else if (diff === 2) {
                item.classList.add('next-2');
            } else {
                item.classList.add('hidden-slide');
            }
        });
    };

    // Open lightbox
    const openLightbox = (index) => {
        stopAutoplay(); // Stop auto sliding when overlay is open
        currentPhotoIndex = parseInt(index);
        updateLightboxContent();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    };

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
        startAutoplay(); // Resume auto sliding
    };

    // Lightbox image loading
    const updateLightboxContent = () => {
        const photo = galleryData[currentPhotoIndex];
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImg.src = photo.src;
            lightboxImg.alt = photo.title;
            lightboxCategory.textContent = photo.category;
            lightboxTitle.textContent = photo.title;
            lightboxImg.style.opacity = '1';
        }, 150);
    };

    // Lightbox directional navigation
    const navigateLightbox = (direction) => {
        if (direction === 'next') {
            currentPhotoIndex = (currentPhotoIndex + 1) % galleryData.length;
        } else if (direction === 'prev') {
            currentPhotoIndex = (currentPhotoIndex - 1 + galleryData.length) % galleryData.length;
        }
        updateLightboxContent();
    };

    // Click behavior on items
    galleryItems.forEach((item, idx) => {
        item.addEventListener('click', (e) => {
            if (idx === activeIndex) {
                const index = item.getAttribute('data-index');
                openLightbox(index);
            } else {
                e.preventDefault();
                e.stopPropagation();
                activeIndex = idx;
                updateCarousel();
                resetAutoplay(); // Reset timer on manual navigation
            }
        });
    });

    // Arrow keys or buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            activeIndex = (activeIndex - 1 + galleryItems.length) % galleryItems.length;
            updateCarousel();
            resetAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            activeIndex = (activeIndex + 1) % galleryItems.length;
            updateCarousel();
            resetAutoplay();
        });
    }

    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox('prev');
    });
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox('next');
    });

    // Dual-purpose keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            // Lightbox navigation
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            }
        } else {
            // Space Gallery swiper navigation
            if (e.key === 'ArrowRight') {
                activeIndex = (activeIndex + 1) % galleryItems.length;
                updateCarousel();
                resetAutoplay();
            } else if (e.key === 'ArrowLeft') {
                activeIndex = (activeIndex - 1 + galleryItems.length) % galleryItems.length;
                updateCarousel();
                resetAutoplay();
            }
        }
    });

    // Fade animation setup
    lightboxImg.style.transition = 'opacity 0.2s ease-in-out';

    // Accordion Toggle Logic
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const currentItem = trigger.parentElement;
            const isOpen = currentItem.classList.contains('active');
            
            // Close other items to behave like a single-open accordion list
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                const content = item.querySelector('.accordion-content');
                if (content) content.style.maxHeight = null;
            });

            if (!isOpen) {
                currentItem.classList.add('active');
                const content = currentItem.querySelector('.accordion-content');
                if (content) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });

    // Initialize Coverflow Carousel & Autoplay
    updateCarousel();
    startAutoplay();

});
