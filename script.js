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


    /* 2. HERO PARALLAX */
    const heroBgImage = document.querySelector('.hero-bg-image');
    let rafParallax = null;

    const updateParallax = () => {
        if (!heroBgImage) return;
        const scrollY = window.scrollY;
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        // Only apply while the hero is visible
        if (scrollY <= heroBottom) {
            // Shift the background down slightly on scroll (parallax),
            // starting from 15% so the singer's head is never clipped
            const offset = 15 + scrollY * 0.015;
            heroBgImage.style.backgroundPositionY = `${offset}%`;
        }
        rafParallax = null;
    };

    window.addEventListener('scroll', () => {
        if (!rafParallax) {
            rafParallax = requestAnimationFrame(updateParallax);
        }
    }, { passive: true });



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

    let currentPhotoIndex = 0;
    let currentIndex = 0;

    const getVisibleItemsCount = () => {
        const width = window.innerWidth;
        if (width > 991) return 3;
        if (width > 575) return 2;
        return 1;
    };

    const updateCarouselPosition = () => {
        const visibleCount = getVisibleItemsCount();
        const maxIndex = Math.max(0, galleryItems.length - visibleCount);
        
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        const track = document.querySelector('.gallery-carousel-track');
        if (!track || galleryItems.length === 0) return;

        const itemWidth = galleryItems[0].getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        const amountToMove = currentIndex * (itemWidth + gap);
        
        track.style.transform = `translateX(-${amountToMove}px)`;

        // Update button opacity and interactive states
        if (prevBtn) {
            prevBtn.style.opacity = currentIndex === 0 ? '0.35' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        }
        if (nextBtn) {
            nextBtn.style.opacity = currentIndex === maxIndex ? '0.35' : '1';
            nextBtn.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
        }
    };

    // Open lightbox
    const openLightbox = (index) => {
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
    };

    // Lightbox image loading
    const updateLightboxContent = () => {
        const photo = galleryData[currentPhotoIndex];
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImg.src = photo.src;
            lightboxImg.alt = photo.title;
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
        item.addEventListener('click', () => {
            const index = item.getAttribute('data-index');
            openLightbox(index);
        });
    });

    // Arrow navigation for carousel
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const visibleCount = getVisibleItemsCount();
            const maxIndex = Math.max(0, galleryItems.length - visibleCount);
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarouselPosition();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex > 0) {
                currentIndex--;
                updateCarouselPosition();
            }
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

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            }
        }
    });

    // Handle carousel resize adjustments
    window.addEventListener('resize', updateCarouselPosition);

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

    // Split Banner Swap Logic (swaps only once on first hover)
    const splitBanner = document.querySelector('.split-banner-container');
    if (splitBanner) {
        splitBanner.addEventListener('mouseenter', () => {
            splitBanner.classList.add('swapped');
        }, { once: true });
    }

    // Initialize Flat Carousel Position
    updateCarouselPosition();

});
