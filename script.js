// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    navMenu.classList.toggle('mobile-active');
    
    // Change icon
    const icon = menuToggle.querySelector('i');
    if (navMenu.classList.contains('mobile-active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (navMenu) {
        navMenu.classList.remove('mobile-active');
    }
    
    if (menuToggle) {
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Carousel functionality (only runs if carousel exists on page)
if (document.querySelector('.carousel-slide')) {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        if (index >= slides.length) currentSlideIndex = 0;
        if (index < 0) currentSlideIndex = slides.length - 1;
        
        slides[currentSlideIndex].classList.add('active');
        indicators[currentSlideIndex].classList.add('active');
    }

    function currentSlide(index) {
        currentSlideIndex = index;
        showSlide(currentSlideIndex);
    }

    function nextSlide() {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }

    // Auto-advance carousel
    setInterval(nextSlide, 5000);

    // Make currentSlide function globally accessible
    window.currentSlide = currentSlide;
}

// Header scroll effect
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Skip if it's just "#" or contains a different page
        if (href === '#' || href.includes('.html#')) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler
function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;

    const templateParams = {
        from_name: form.name.value,
        from_email: form.email.value,
        from_phone: form.phone.value || "Not provided",
        message: form.message.value
    };

    // Check if emailjs is loaded
    if (typeof emailjs !== 'undefined') {
        emailjs.send("service_qgaeugb", "template_ayjq84s", templateParams)
            .then(() => {
                alert("Thank you for reaching out to Queueless. Your message has been successfully sent. Our team will review your request and get back to you shortly.");
                form.reset();
            })
            .catch((error) => {
                console.error("EmailJS Error:", error);
                alert("We apologize, but there was an issue submitting your message. Please try again later or contact us directly at +91 7698000747.");
            });
    } else {
        alert("We apologize, but there was an issue submitting your message. Please try again later or contact us directly at +91 7698000747.");
    }
}

// Make handleSubmit globally accessible
window.handleSubmit = handleSubmit;

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements when they come into view
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.solution-card, .stat-card, .compare-card, .benefit-card, .value-card, .step-card, .testimonial-card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});