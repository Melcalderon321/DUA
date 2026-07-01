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
    navBookingBtn.addEventListener('click', closeMenu);


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


    /* 5. EL ESPACIO: GALLERY LIGHTBOX SYSTEM */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    // Build the playlist/gallery dataset array for quick cycling
    const galleryData = Array.from(galleryItems).map(item => ({
        src: item.getAttribute('data-src'),
        title: item.getAttribute('data-title'),
        subtitle: item.getAttribute('data-subtitle'),
        category: item.querySelector('.gallery-category').textContent
    }));

    let currentPhotoIndex = 0;

    const openLightbox = (index) => {
        currentPhotoIndex = parseInt(index);
        updateLightboxContent();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop background scroll
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scroll
    };

    const updateLightboxContent = () => {
        const photo = galleryData[currentPhotoIndex];
        
        // Add fade out animation class briefly
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImg.src = photo.src;
            lightboxImg.alt = photo.title;
            lightboxCategory.textContent = photo.category;
            lightboxTitle.textContent = photo.title;
            lightboxDesc.textContent = photo.subtitle;
            
            // Fade image back in
            lightboxImg.style.opacity = '1';
        }, 150);
    };

    const navigateLightbox = (direction) => {
        if (direction === 'next') {
            currentPhotoIndex = (currentPhotoIndex + 1) % galleryData.length;
        } else if (direction === 'prev') {
            currentPhotoIndex = (currentPhotoIndex - 1 + galleryData.length) % galleryData.length;
        }
        updateLightboxContent();
    };

    // Bind triggers to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = item.getAttribute('data-index');
            openLightbox(index);
        });
    });

    // Close controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Nav controls
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox('prev');
    });
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox('next');
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            navigateLightbox('next');
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox('prev');
        }
    });

    // Smooth transition styles for lightbox image fade
    lightboxImg.style.transition = 'opacity 0.2s ease-in-out';

});
