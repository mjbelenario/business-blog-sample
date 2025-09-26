// TechFlow Website JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeNewsletterForms();
    
    // Add loading class to body
    document.body.classList.add('loaded');
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Handle navbar background on scroll
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.backgroundColor = '';
                navbar.style.backdropFilter = '';
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
    
    // Update active nav link based on current page
    updateActiveNavLink();
}

// Update active navigation link
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateContactForm()) {
                // Show loading state
                showFormLoading(true);
                
                // Simulate form submission
                setTimeout(() => {
                    showFormSuccess();
                    contactForm.reset();
                    showFormLoading(false);
                }, 2000);
            }
        });
        
        // Real-time validation
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    }
}

// Form validation
function validateContactForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${field.labels[0]?.textContent.replace('*', '').trim() || 'This field'} is required.`;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation (optional, only if filled)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    // Update field state
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        
        // Update error message
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = errorMessage;
        }
    }
    
    return isValid;
}

// Show form loading state
function showFormLoading(loading) {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Send Message';
    }
}

// Show form success message
function showFormSuccess() {
    // Create success alert
    const alertHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle me-2"></i>
            <strong>Message sent successfully!</strong> We'll get back to you within 24 hours.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    const form = document.getElementById('contactForm');
    form.insertAdjacentHTML('beforebegin', alertHTML);
    
    // Remove success classes from form fields
    const formFields = form.querySelectorAll('.is-valid');
    formFields.forEach(field => {
        field.classList.remove('is-valid');
    });
}

// Newsletter form functionality
function initializeNewsletterForms() {
    const newsletterForms = document.querySelectorAll('form');
    
    newsletterForms.forEach(form => {
        if (form.querySelector('input[type="email"][placeholder*="email"]')) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = this.querySelector('input[type="email"]');
                const email = emailInput.value.trim();
                
                if (validateEmail(email)) {
                    showNewsletterSuccess(this);
                    emailInput.value = '';
                } else {
                    showNewsletterError(this, 'Please enter a valid email address.');
                }
            });
        }
    });
}

// Newsletter success message
function showNewsletterSuccess(form) {
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    button.textContent = 'Subscribed!';
    button.classList.remove('btn-primary');
    button.classList.add('btn-success');
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
        button.disabled = false;
    }, 3000);
}

// Newsletter error message
function showNewsletterError(form, message) {
    const emailInput = form.querySelector('input[type="email"]');
    emailInput.classList.add('is-invalid');
    
    // Create or update error message
    let feedback = form.querySelector('.invalid-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        emailInput.parentNode.appendChild(feedback);
    }
    feedback.textContent = message;
    
    // Remove error after 3 seconds
    setTimeout(() => {
        emailInput.classList.remove('is-invalid');
        if (feedback) feedback.remove();
    }, 3000);
}

// Email validation helper
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.animate-fade-in, .card, .feature-icon');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add animate-in styles
    if (!document.querySelector('#animate-styles')) {
        const style = document.createElement('style');
        style.id = 'animate-styles';
        style.textContent = `
            .animate-in {
                animation: slideInUp 0.6s ease-out forwards;
            }
            
            @keyframes slideInUp {
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
}

// Utility function to debounce events
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Handle window resize events
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Recalculate any dynamic layouts if needed
        updateLayoutCalculations();
    }, 250);
});

// Update layout calculations
function updateLayoutCalculations() {
    // Update any dynamic calculations that depend on viewport size
    const stickyElements = document.querySelectorAll('.sticky-top');
    stickyElements.forEach(el => {
        // Recalculate sticky positioning if needed
    });
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Page became visible - restart any paused animations
        console.log('Page became visible');
    } else {
        // Page became hidden - pause any running animations
        console.log('Page became hidden');
    }
});

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.log('Image failed to load:', e.target.src);
        // Optionally replace with placeholder image
        // e.target.src = 'path/to/placeholder.jpg';
    }
}, true);

// Initialize tooltips and popovers (if Bootstrap JS is loaded)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Initialize Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    if (typeof bootstrap !== 'undefined' && bootstrap.Popover) {
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
});

// Theme toggle functionality (if implemented in future)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme toggle button if it exists
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = newTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
        }
    }
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
});

// Export functions for external use if needed
window.TechFlow = {
    validateEmail,
    toggleTheme,
    showFormLoading,
    showFormSuccess,
    debounce
};