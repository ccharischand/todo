// Slider functionality
const slides = document.querySelector(".slides");
const dots = document.querySelectorAll(".dots div");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");

let index = 0;
let totalSlides = 3;

function updateSlider() {
    slides.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
}

function nextSlide() {
    index = (index + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    index = (index - 1 + totalSlides) % totalSlides;
    updateSlider();
}

// Auto slide
let slideInterval = setInterval(nextSlide, 6000);

// Arrows
rightArrow.addEventListener("click", () => {
    nextSlide();
    resetInterval();
});
leftArrow.addEventListener("click", () => {
    prevSlide();
    resetInterval();
});

// Dots
dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        index = i;
        updateSlider();
        resetInterval();
    });
});

function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 6000);
}

// Ensure slider is centered on load
updateSlider();

// Counter animation
(function() {
    const counters = Array.from(document.querySelectorAll('.cc-counter__num'));
    if (!counters.length) return;

    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function animateCounter(el, target, duration = 1500) {
        const start = performance.now();
        const initial = Number(el.textContent.replace(/,/g, '')) || 0;
        const delta = target - initial;

        function step(now) {
            const t = Math.min(1, (now - start) / duration);
            el.textContent = Math.floor(initial + delta * easeOut(t)).toLocaleString();
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(step);
    }

    // Use IntersectionObserver so counters animate once when visible
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numEl = entry.target;
                const target = parseFloat(numEl.getAttribute('data-target')) || 0;
                // optional: allow decimals (if target includes .)
                const isFloat = String(numEl.getAttribute('data-target')).includes('.');
                if (isFloat) {
                    animateCounterDecimals(numEl, target, 1500);
                } else {
                    animateCounter(numEl, Math.round(target), 1500);
                }
                obs.unobserve(numEl);
            }
        });
    }, {
        threshold: 0.4
    });

    // support for decimal targets (keeps two decimals)
    function animateCounterDecimals(el, target, duration = 1500) {
        const start = performance.now();
        const initial = parseFloat(el.textContent) || 0;
        const delta = target - initial;

        function step(now) {
            const t = Math.min(1, (now - start) / duration);
            const value = initial + delta * easeOut(t);
            el.textContent = value.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = Number(target).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
        }
        requestAnimationFrame(step);
    }

    counters.forEach(el => io.observe(el));
})();

// Footer year and enhancements
(function() {
    var y = new Date().getFullYear();
    var el = document.getElementById('cc-year');
    if (el) el.textContent = y;

    // Add smooth scroll for footer links
    const footerLinks = document.querySelectorAll('.cc-footer a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effects for footer columns
    const footerCols = document.querySelectorAll('.cc-col');
    footerCols.forEach(col => {
        col.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';

            // Add subtle glow effect
            this.style.boxShadow = '0 10px 30px rgba(66, 153, 225, 0.1)';
        });

        col.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Enhanced social links animations
    const socialLinks = document.querySelectorAll('.cc-social__link');
    socialLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
            this.style.boxShadow = '0 10px 25px rgba(66, 153, 225, 0.5)';

            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                width: 50px;
                height: 50px;
                left: 50%;
                top: 50%;
                margin-left: -25px;
                margin-top: -25px;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 25px rgba(66, 153, 225, 0.3)';
        });
    });

    // Add floating animation to footer logo
    const footerLogo = document.querySelector('.cc-footer__logo');
    if (footerLogo) {
        footerLogo.addEventListener('mouseenter', function() {
            this.style.animation = 'logoFloat 2s ease-in-out infinite';
        });

        footerLogo.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    }

    // Add typing effect for footer tagline
    const footerTagline = document.querySelector('.cc-footer__tagline');
    if (footerTagline) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const text = entry.target.textContent;
                    entry.target.textContent = '';

                    let i = 0;
                    const typeWriter = () => {
                        if (i < text.length) {
                            entry.target.textContent += text.charAt(i);
                            i++;
                            setTimeout(typeWriter, 50);
                        }
                    };

                    setTimeout(typeWriter, 500);
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(footerTagline);
    }

    // Add CSS animations dynamically
    if (!document.querySelector('#footer-animations')) {
        const style = document.createElement('style');
        style.id = 'footer-animations';
        style.textContent = `
            @keyframes logoFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Animate footer sections on scroll
    const footerSections = document.querySelectorAll('.cc-col, .cc-footer__brand');
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }, index * 100);
                footerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    footerSections.forEach(section => {
        section.style.opacity = '0';
        footerObserver.observe(section);
    });

})();

// Counter animation for statistics section
(function() {
    const counters = Array.from(document.querySelectorAll('.counter-number'));
    if (!counters.length) return;

    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function animateCounter(el, target, duration = 2000) {
        const start = performance.now();
        const initial = 0;
        const delta = target - initial;

        function step(now) {
            const t = Math.min(1, (now - start) / duration);
            const value = Math.floor(initial + delta * easeOut(t));
            el.textContent = value.toLocaleString();

            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString();
            }
        }
        requestAnimationFrame(step);
    }

    // Use IntersectionObserver to trigger counter animation when visible
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'), 10);

                if (Number.isFinite(target)) {
                    // Reset counter to 0 before animation
                    counter.textContent = '0';

                    // Start animation with slight delay for visual effect
                    setTimeout(() => {
                        animateCounter(counter, target, 2000);
                    }, 100);
                }

                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-50px'
    });

    // Observe all counter elements
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
})();

(function() {
    var y = new Date().getFullYear();
    var el = document.getElementById('cc-year');
    if (el) el.textContent = y;
})();

/* ========================================
   ADDITIONAL SCRIPTS MOVED FROM HTML
   ======================================== */

// Document Ready Functions
document.addEventListener('DOMContentLoaded', function() {

    // Initialize footer year
    initializeFooterYear();

    // Initialize container hover effects
    initializeContainerHoverEffects();

    // Initialize service card hover effects
    initializeServiceCardHoverEffects();

    // Initialize testimonial animations
    initializeTestimonialAnimations();

    // Initialize devices showcase animations
    initializeDevicesShowcaseAnimations();

    // Initialize click me button
    initializeClickMeButton();

    // Initialize what's new section animations
    initializeWhatsNewAnimations();

    // Initialize start now section animations
    initializeStartNowAnimations();

    // Initialize comprehensive footer animations
    initializeComprehensiveFooterAnimations();

});

/**
 * Initialize Footer Year Display
 * Sets the current year in the footer copyright
 */
function initializeFooterYear() {
    const yearElement = document.getElementById('cc-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Initialize Container Hover Effects
 * Handles the interactive hover effects for result containers
 */
function initializeContainerHoverEffects() {
    const containers = ['container1', 'container2', 'container3', 'container4'];

    containers.forEach(containerId => {
        const container = document.getElementById(containerId);

        if (!container) return;

        // Mouse enter event
        container.addEventListener('mouseenter', function() {
            // Fade out other containers
            containers.forEach(id => {
                const element = document.getElementById(id);
                if (id !== containerId && element) {
                    element.style.opacity = '0.3';
                    element.style.transform = 'scale(0.95)';
                }
            });

            // Highlight current container with purple color
            this.style.opacity = '1';
            this.style.transform = 'scale(1.05)';
            this.style.background = '#b8c7e6ff';
            this.style.boxShadow = '0 8px 25px rgba(156,39,176,0.15)';
        });

        // Mouse leave event
        container.addEventListener('mouseleave', function() {
            // Reset all containers to normal state
            containers.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                    element.style.boxShadow = 'none';

                    // Reset all containers to white background
                    element.style.background = '#f8f8f8';
                }
            });
        });
    });
}

/**
 * Initialize Service Card Hover Effects
 * Handles the interactive hover effects for service cards with logo images
 */
function initializeServiceCardHoverEffects() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        const logo = card.querySelector('.service-logo');
        const iconContainer = card.querySelector('.service-icon');

        // Ensure logos are always visible - remove error handling that hides them
        if (logo) {
            logo.style.display = 'block';
            logo.style.opacity = '1';

            // Remove any error handlers that might hide the logo
            logo.removeEventListener('error', function() {});
        }

        // Mouse enter event
        card.addEventListener('mouseenter', function() {
            // Transform card
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            this.style.background = '#2196F3';

            // Update text colors for better contrast
            const h3 = this.querySelector('h3');
            const button = this.querySelector('button');
            const iconBg = this.querySelector('.service-icon');

            if (h3) h3.style.color = '#ffffff';
            if (button) {
                button.style.background = '#ffffff';
                button.style.color = '#2196F3';
                button.style.textDecoration = 'none';
                button.style.boxShadow = 'none';
                button.style.outline = 'none';
            }
            if (iconBg) iconBg.style.background = 'rgba(255,255,255,0.2)';


        });

        // Mouse leave event
        card.addEventListener('mouseleave', function() {
            // Reset card appearance
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            this.style.background = 'white';

            // Reset text colors
            const h3 = this.querySelector('h3');
            const button = this.querySelector('button');
            const iconBg = this.querySelector('.service-icon');

            if (h3) h3.style.color = '#333';
            if (button) {
                button.style.background = 'transparent';
                button.style.color = '#2196F3';
                button.style.textDecoration = 'underline';
                button.style.boxShadow = 'none';
                button.style.outline = 'none';
            }
            if (iconBg) iconBg.style.background = '#e3f2fd';

            // Reset logo filter but keep it visible
            if (logo) {
                logo.style.filter = 'none';
                logo.style.transform = 'scale(1)';
                logo.style.display = 'block';
                logo.style.opacity = '1';
            }
        });

        // Handle button clicks without affecting logo visibility
        const button = card.querySelector('.service-btn');
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                this.style.outline = 'none';
                this.style.boxShadow = 'none';
                this.style.border = 'none';

                // Keep logo visible even after click
                if (logo) {
                    logo.style.display = 'block';
                    logo.style.opacity = '1';
                }
            });

            button.addEventListener('focus', function() {
                this.style.outline = 'none';
                this.style.boxShadow = 'none';
            });

            button.addEventListener('blur', function() {
                this.style.outline = 'none';
                this.style.boxShadow = 'none';
            });
        }
    });
}

/**
 * Initialize Testimonial Section Animations
 * Handles the scroll-triggered animations for the testimonial section
 */
function initializeTestimonialAnimations() {
    const testimonialSection = document.querySelector('.testimonial-section');

    if (!testimonialSection) return;

    const testimonialAvatar = testimonialSection.querySelector('.testimonial-avatar');
    const testimonialQuoteBox = testimonialSection.querySelector('.testimonial-quote-box');
    const testimonialQuote = testimonialSection.querySelector('.testimonial-quote');
    const testimonialAuthor = testimonialSection.querySelector('.testimonial-author');

    // Create intersection observer for testimonial animations
    const testimonialObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate avatar
                if (testimonialAvatar) {
                    setTimeout(() => {
                        testimonialAvatar.style.opacity = '1';
                        testimonialAvatar.style.transform = 'translateY(0) scale(1)';
                        testimonialAvatar.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    }, 200);
                }

                // Animate quote box
                if (testimonialQuoteBox) {
                    setTimeout(() => {
                        testimonialQuoteBox.style.opacity = '1';
                        testimonialQuoteBox.style.transform = 'translateX(0) scale(1)';
                        testimonialQuoteBox.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    }, 600);
                }

                // Animate quote text with typewriter effect
                if (testimonialQuote) {
                    setTimeout(() => {
                        const quoteText = testimonialQuote.textContent;
                        testimonialQuote.textContent = '';
                        testimonialQuote.style.opacity = '1';

                        let i = 0;
                        const typeWriter = () => {
                            if (i < quoteText.length) {
                                testimonialQuote.textContent += quoteText.charAt(i);
                                i++;
                                setTimeout(typeWriter, 50);
                            }
                        };
                        typeWriter();
                    }, 1000);
                }

                // Animate author info
                if (testimonialAuthor) {
                    setTimeout(() => {
                        testimonialAuthor.style.opacity = '1';
                        testimonialAuthor.style.transform = 'translateY(0)';
                        testimonialAuthor.style.transition = 'all 0.6s ease';
                    }, 1800);
                }

                testimonialObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    // Set initial states
    if (testimonialAvatar) {
        testimonialAvatar.style.opacity = '0';
        testimonialAvatar.style.transform = 'translateY(30px) scale(0.8)';
    }

    if (testimonialQuoteBox) {
        testimonialQuoteBox.style.opacity = '0';
        testimonialQuoteBox.style.transform = 'translateX(-50px) scale(0.95)';
    }

    if (testimonialQuote) {
        testimonialQuote.style.opacity = '0';
    }

    if (testimonialAuthor) {
        testimonialAuthor.style.opacity = '0';
        testimonialAuthor.style.transform = 'translateY(20px)';
    }

    // Start observing
    testimonialObserver.observe(testimonialSection);

    // Add hover effects for the quote box
    if (testimonialQuoteBox) {
        testimonialQuoteBox.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(0) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(33, 150, 243, 0.4)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });

        testimonialQuoteBox.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(33, 150, 243, 0.3)';
        });
    }

    // Add click effect for avatar
    if (testimonialAvatar) {
        testimonialAvatar.addEventListener('click', function() {
            this.style.transform = 'translateY(0) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
            }, 150);
        });
    }
}

/**
 * Initialize Devices Showcase Section Animations
 * Handles the scroll-triggered animations for the devices showcase section
 */
function initializeDevicesShowcaseAnimations() {
    const devicesSection = document.querySelector('.devices-showcase-section');

    if (!devicesSection) return;

    const combinedDevicesImage = devicesSection.querySelector('.combined-devices-image');
    const devicesTitle = devicesSection.querySelector('.devices-title');

    // Create intersection observer for devices animations
    const devicesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate combined devices image
                if (combinedDevicesImage) {
                    setTimeout(() => {
                        combinedDevicesImage.style.opacity = '1';
                        combinedDevicesImage.style.transform = 'translateY(0) scale(1)';
                        combinedDevicesImage.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    }, 200);
                }

                // Animate title
                if (devicesTitle) {
                    setTimeout(() => {
                        devicesTitle.style.opacity = '1';
                        devicesTitle.style.transform = 'translateY(0)';
                        devicesTitle.style.transition = 'all 0.8s ease';
                    }, 800);
                }

                devicesObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Set initial states
    if (combinedDevicesImage) {
        combinedDevicesImage.style.opacity = '0';
        combinedDevicesImage.style.transform = 'translateY(50px) scale(0.9)';
    }

    if (devicesTitle) {
        devicesTitle.style.opacity = '0';
        devicesTitle.style.transform = 'translateY(30px)';
    }

    // Start observing
    devicesObserver.observe(devicesSection);

    // Add floating animation to the combined image
    if (combinedDevicesImage) {
        combinedDevicesImage.style.animation = 'deviceFloat 6s ease-in-out infinite';

        // Add hover effects
        combinedDevicesImage.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'translateY(0) scale(1.02)';
            this.style.filter = 'drop-shadow(0 25px 80px rgba(0, 0, 0, 0.2))';
            this.style.transition = 'all 0.3s ease';
        });

        combinedDevicesImage.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = 'translateY(0) scale(1)';
            this.style.filter = 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.15))';
        });
    }

    // Add CSS animations dynamically
    if (!document.querySelector('#devices-animations')) {
        const style = document.createElement('style');
        style.id = 'devices-animations';
        style.textContent = `
            @keyframes deviceFloat {
                0%, 100% { 
                    transform: translateY(0px); 
                }
                50% { 
                    transform: translateY(-10px); 
                }
            }
            
            @keyframes titlePulse {
                0%, 100% { 
                    color: #2196F3; 
                }
                50% { 
                    color: #1976D2; 
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add title pulse animation on hover
    if (devicesTitle) {
        devicesTitle.addEventListener('mouseenter', function() {
            this.style.animation = 'titlePulse 2s ease-in-out infinite';
        });

        devicesTitle.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    }
}

/**
 * Initialize Click Me Button Functionality
 * Handles the click event for the green button
 */
function initializeClickMeButton() {
    const clickMeBtn = document.querySelector('.click-me-btn');

    if (clickMeBtn) {
        clickMeBtn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';

            // Reset animation after a short delay
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            // You can add your custom functionality here
            alert('Button clicked! You can add your custom functionality here.');
        });

        // Add ripple effect on click
        clickMeBtn.addEventListener('mousedown', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    }
}

/**
 * Initialize What's New Section Animations
 * Handles the scroll-triggered animations for the what's new section
 */
function initializeWhatsNewAnimations() {
    const whatsNewSection = document.querySelector('.whats-new-section');

    if (!whatsNewSection) return;

    const whatsNewTitle = whatsNewSection.querySelector('.whats-new-title');
    const newsCards = whatsNewSection.querySelectorAll('.news-card');

    // Create intersection observer for what's new animations
    const whatsNewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate title
                if (whatsNewTitle) {
                    setTimeout(() => {
                        whatsNewTitle.style.opacity = '1';
                        whatsNewTitle.style.transform = 'translateY(0)';
                        whatsNewTitle.style.transition = 'all 0.8s ease';
                    }, 200);
                }

                // Animate news cards with staggered timing
                newsCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    }, 600 + (index * 200));
                });

                whatsNewObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Set initial states
    if (whatsNewTitle) {
        whatsNewTitle.style.opacity = '0';
        whatsNewTitle.style.transform = 'translateY(50px)';
    }

    newsCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
    });

    // Start observing
    whatsNewObserver.observe(whatsNewSection);

    // Add hover effects for news cards
    newsCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        });

        // Add click ripple effect
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(30, 136, 229, 0.2);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

/**
 * Initialize Start Now Section Animations
 * Handles the scroll-triggered animations for the start now section
 */
function initializeStartNowAnimations() {
    const startNowSection = document.querySelector('.start-now-section');

    if (!startNowSection) return;

    const startNowTitle = startNowSection.querySelector('.start-now-title');
    const startNowSubtitle = startNowSection.querySelector('.start-now-subtitle');
    const actionItems = startNowSection.querySelectorAll('.action-item');

    // Create intersection observer for start now animations
    const startNowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate title
                if (startNowTitle) {
                    setTimeout(() => {
                        startNowTitle.style.opacity = '1';
                        startNowTitle.style.transform = 'translateY(0)';
                        startNowTitle.style.transition = 'all 0.8s ease';
                    }, 200);
                }

                // Animate subtitle
                if (startNowSubtitle) {
                    setTimeout(() => {
                        startNowSubtitle.style.opacity = '1';
                        startNowSubtitle.style.transform = 'translateY(0)';
                        startNowSubtitle.style.transition = 'all 0.8s ease';
                    }, 400);
                }

                // Animate action items with staggered timing
                actionItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                        item.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    }, 600 + (index * 150));
                });

                startNowObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Set initial states
    if (startNowTitle) {
        startNowTitle.style.opacity = '0';
        startNowTitle.style.transform = 'translateY(30px)';
    }

    if (startNowSubtitle) {
        startNowSubtitle.style.opacity = '0';
        startNowSubtitle.style.transform = 'translateY(30px)';
    }

    actionItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px) scale(0.9)';
    });

    // Start observing
    startNowObserver.observe(startNowSection);

    // Add click functionality to action items
    actionItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'translateY(-5px) scale(0.95)';

            setTimeout(() => {
                this.style.transform = 'translateY(-5px) scale(1)';
            }, 150);

            // Get action text for different actions
            const actionText = this.querySelector('.action-text').textContent;

            if (actionText.includes('Schedule a Demo')) {
                console.log('Schedule Demo clicked');
                // Add your demo scheduling logic here
            } else if (actionText.includes('Chat With Us')) {
                console.log('Chat clicked');
                // Add your chat logic here
            } else if (actionText.includes('Connect with Sales')) {
                console.log('Sales connection clicked');
                // Add your sales connection logic here
            } else if (actionText.includes('Request an Analysis')) {
                console.log('Analysis request clicked');
                // Add your analysis request logic here
            }
        });

        // Add ripple effect on click
        item.addEventListener('mousedown', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(25, 118, 210, 0.2);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

/**
 * Initialize Comprehensive Footer Animations
 * Handles the scroll-triggered animations for the comprehensive footer
 */
function initializeComprehensiveFooterAnimations() {
    const comprehensiveFooter = document.querySelector('.comprehensive-footer');

    if (!comprehensiveFooter) return;

    const footerColumns = comprehensiveFooter.querySelectorAll('.footer-column');
    const footerBottom = comprehensiveFooter.querySelector('.footer-bottom');

    // Create intersection observer for footer animations
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate footer columns with staggered timing
                footerColumns.forEach((column, index) => {
                    setTimeout(() => {
                        column.style.opacity = '1';
                        column.style.transform = 'translateY(0)';
                        column.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    }, index * 100);
                });

                // Animate footer bottom
                if (footerBottom) {
                    setTimeout(() => {
                        footerBottom.style.opacity = '1';
                        footerBottom.style.transform = 'translateY(0)';
                        footerBottom.style.transition = 'all 0.6s ease';
                    }, footerColumns.length * 100 + 200);
                }

                footerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Set initial states
    footerColumns.forEach(column => {
        column.style.opacity = '0';
        column.style.transform = 'translateY(30px)';
    });

    if (footerBottom) {
        footerBottom.style.opacity = '0';
        footerBottom.style.transform = 'translateY(30px)';
    }

    // Start observing
    footerObserver.observe(comprehensiveFooter);

    // Add hover effects for social icons
    const socialIcons = comprehensiveFooter.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.1)';
        });

        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px) scale(1)';
        });
    });

    // Add hover effects for footer links
    const footerLinks = comprehensiveFooter.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.paddingLeft = '5px';
        });

        link.addEventListener('mouseleave', function() {
            this.style.paddingLeft = '0';
        });
    });

    // Add click effects for certification images
    const certImages = comprehensiveFooter.querySelectorAll('.cert-image');
    certImages.forEach(img => {
        img.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}