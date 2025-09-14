// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const cursorZoom = document.getElementById('cursorZoom');
    const heroSection = document.getElementById('home');

    // Cursor Glass Zoom Effect (Hero Section Only)
    let isInHeroSection = false;

    function initCursorEffect() {
        // Track mouse movement globally
        document.addEventListener('mousemove', function(e) {
            const heroRect = heroSection.getBoundingClientRect();
            const isInHero = (
                e.clientX >= heroRect.left &&
                e.clientX <= heroRect.right &&
                e.clientY >= heroRect.top &&
                e.clientY <= heroRect.bottom
            );

            if (isInHero && !isInHeroSection) {
                // Entering hero section
                isInHeroSection = true;
                cursorZoom.classList.add('active');
            } else if (!isInHero && isInHeroSection) {
                // Leaving hero section
                isInHeroSection = false;
                cursorZoom.classList.remove('active');
            }

            if (isInHeroSection) {
                // Update cursor position
                cursorZoom.style.left = e.clientX + 'px';
                cursorZoom.style.top = e.clientY + 'px';
            }
        });

        // Hide cursor effect when mouse leaves window
        document.addEventListener('mouseleave', function() {
            isInHeroSection = false;
            cursorZoom.classList.remove('active');
        });
    }

    // Navbar scroll effect
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    }

    // Smooth scrolling for navigation links
    function smoothScrollToSection(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const targetHref = this.getAttribute('href');
        
        if (!targetHref || !targetHref.startsWith('#')) {
            return;
        }
        
        const targetId = targetHref.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const navHeight = navbar ? navbar.offsetHeight : 80;
            const elementPosition = targetElement.offsetTop;
            const offsetPosition = elementPosition - navHeight - 20;
            
            // Close mobile menu if open
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
            
            // Scroll to the target
            window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth'
            });
        }
    }

    // Mobile navigation toggle
    function toggleMobileNav(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (navMenu) {
            navMenu.classList.toggle('active');
        }
        if (navToggle) {
            navToggle.classList.toggle('active');
        }
    }

    // Active section highlighting
    function updateActiveNavLink() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const navHeight = navbar ? navbar.offsetHeight : 80;
        
        // Remove active class from all nav links first
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Find the current section
        let currentSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 50;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                currentSection = section;
            }
        });
        
        // Highlight the corresponding nav link
        if (currentSection) {
            const sectionId = currentSection.getAttribute('id');
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    // Form submission handling
    function handleFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();
        
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            alert('Thank you for your message! We\'ll get back to you soon.');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    // Animation observer for elements
    function initAnimations() {
        const animatedElements = document.querySelectorAll(
            '.feature-item, .service-bar, .portfolio-item, .section-title, .hero-text > *'
        );
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    // Service bar hover effects
    function initServiceBarEffects() {
        const serviceBars = document.querySelectorAll('.service-bar');
        
        serviceBars.forEach(bar => {
            bar.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(12px)';
            });
            
            bar.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        });
    }

    // Mobile hamburger animation
    function initMobileToggleAnimation() {
        if (navToggle) {
            navToggle.addEventListener('click', function() {
                const bars = this.querySelectorAll('.bar');
                
                if (this.classList.contains('active')) {
                    // Close animation
                    bars[0].style.transform = 'rotate(0) translate(0)';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'rotate(0) translate(0)';
                } else {
                    // Open animation
                    bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    bars[1].style.opacity = '0';
                    bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                }
            });
        }
    }

    // Portfolio item subtle hover effects
    function initPortfolioEffects() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-6px)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }

    // Enhanced button hover effects
    function initButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }

    // Initialize everything
    try {
        // Initialize cursor effect
        initCursorEffect();

        // Scroll event with throttling
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(handleScroll, 10);
        }, { passive: true });

        // Navigation links
        navLinks.forEach((link) => {
            link.addEventListener('click', smoothScrollToSection);
        });

        // Mobile toggle
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileNav);
        }

        // Form submission
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmission);
        }

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu && navMenu.classList.contains('active')) {
                if (!navbar.contains(e.target)) {
                    navMenu.classList.remove('active');
                    if (navToggle) {
                        navToggle.classList.remove('active');
                    }
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (navToggle) {
                    navToggle.classList.remove('active');
                }
            }
        });

        // Initialize all effects
        initAnimations();
        initServiceBarEffects();
        initMobileToggleAnimation();
        initPortfolioEffects();
        initButtonEffects();

        // Initial calls
        handleScroll();

        console.log('Landing page initialized successfully');

    } catch (error) {
        console.error('Error initializing landing page:', error);
    }

    // Smooth scroll polyfill check
    if (!('scrollBehavior' in document.documentElement.style)) {
        // Fallback for browsers that don't support smooth scroll
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navHeight = navbar ? navbar.offsetHeight : 80;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - navHeight - 20;
                    
                    // Animated scroll fallback
                    const start = window.pageYOffset;
                    const distance = offsetPosition - start;
                    const duration = 800;
                    let startTime = null;
                    
                    function animateScroll(currentTime) {
                        if (!startTime) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        const progress = Math.min(timeElapsed / duration, 1);
                        
                        // Easing function
                        const ease = progress * (2 - progress);
                        
                        window.scrollTo(0, start + (distance * ease));
                        
                        if (progress < 1) {
                            requestAnimationFrame(animateScroll);
                        }
                    }
                    
                    requestAnimationFrame(animateScroll);
                }
            });
        });
    }

    // Performance monitoring
    window.addEventListener('load', function() {
        // Re-initialize animations after everything is loaded
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-text > *');
            heroElements.forEach((el, index) => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, 100);
    });
});