// ============================================
// WAIT FOR EMAILJS TO LOAD
// ============================================

function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        console.log('EmailJS loaded successfully');
        emailjs.init({
            publicKey: '9NGXYL_cdkhH8ysY8'
        });
    } else {
        console.error('EmailJS library not found, retrying...');
        setTimeout(initEmailJS, 500);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initEmailJS);

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');

// Smooth scrolling and active link highlight
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get the target section
        const targetId = link.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Smooth scroll to section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Close mobile menu if open
        if (navLinksContainer.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});

// ============================================
// MEDICINE FILTER FUNCTIONALITY
// ============================================

const filterButtons = document.querySelectorAll('.filter-btn');
const medicineCards = document.querySelectorAll('.medicine-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter value
        const filterValue = button.getAttribute('data-filter');
        
        // Filter medicine cards
        medicineCards.forEach(card => {
            if (filterValue === 'all') {
                card.style.display = 'flex';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                const cardCategories = card.getAttribute('data-category');
                // Check if the filter value is in the card's categories
                if (cardCategories && cardCategories.includes(filterValue)) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});

// ============================================
// INTERACTIVE ENQUIRY NAVIGATION
// ============================================

function enquireAbout(productName, categoryName) {
    const enquiryMedicineType = document.getElementById('enquiryMedicineType');
    const enquiryDetails = document.getElementById('enquiryDetails');
    
    if (enquiryMedicineType) {
        enquiryMedicineType.value = categoryName;
    }
    
    if (enquiryDetails) {
        enquiryDetails.value = `I would like to enquire about: ${productName}.\nPlease provide more details on specifications, pricing, and shipping terms.`;
    }
    
    const enquirySection = document.getElementById('enquiry');
    if (enquirySection) {
        enquirySection.scrollIntoView({ behavior: 'smooth' });
    }
    
    showNotification(`Selected ${productName} for enquiry!`);
}

// Bind to window context for onclick inline triggers
window.enquireAbout = enquireAbout;

// ============================================
// SEND EMAIL FUNCTIONALITY
// ============================================

function sendEnquiryEmail(formData) {
    console.log('Sending enquiry email:', formData);

    if (typeof emailjs === 'undefined') {
        console.error('EmailJS not initialized');
        showModal('Error', 'Email service not ready. Please refresh and try again.');
        return;
    }

    const emailParams = {
        to_email: 'dipakpharmchem@gmail.com',
        from_name: formData.full_name,
        from_email: formData.email,
        phone: formData.phone,
        company: formData.company || 'Not provided',
        medicine_type: formData.medicine_type,
        quantity: formData.quantity,
        details: formData.details || 'Not provided',
        message_type: 'Medicine Enquiry'
    };

    emailjs.send('service_wx7fnbo', 'template_kbqpa3e', emailParams)
        .then(response => {
            console.log('Email sent successfully:', response);
            showModal('Enquiry Sent!', 'Your medicine enquiry has been sent successfully. Our team will contact you soon!');
        })
        .catch(error => {
            console.error('Email send failed:', error);
            showModal('Error', 'Failed to send enquiry. Please try again.');
        });
}

function sendContactEmail(user_name, user_email, subject, message) {
    console.log('Sending contact email');

    if (typeof emailjs === 'undefined') {
        console.error('EmailJS not initialized');
        showModal('Error', 'Email service not ready. Please refresh and try again.');
        return;
    }

    const emailParams = {
        to_email: 'dipakpharmchem@gmail.com',
        from_name: user_name,
        from_email: user_email,
        subject: subject,
        message: message,
        message_type: 'Contact Form'
    };

    emailjs.send('service_wx7fnbo', 'template_kbqpa3e', emailParams)
        .then(response => {
            console.log('Contact email sent successfully:', response);
            showModal('Message Sent!', 'Thank you for contacting us! Your message has been sent successfully. Our team will get back to you soon!');
        })
        .catch(error => {
            console.error('Contact email send failed:', error);
            showModal('Error', 'Failed to send message. Please try again.');
        });
}

// ============================================
// FORM SUBMISSION INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Setting up forms');

    const contactForm = document.getElementById('contactForm');
    const enquiryForm = document.getElementById('enquiryForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();

            try {
                // Get form data
                const user_name = contactForm.querySelector('input[name="user_name"]').value;
                const user_email = contactForm.querySelector('input[name="user_email"]').value;
                const subject = contactForm.querySelector('input[name="subject"]').value;
                const message = contactForm.querySelector('textarea[name="message"]').value;

                // Validate fields
                if (!user_name || !user_email || !subject || !message) {
                    showModal('Error', 'Please fill all required fields');
                    return false;
                }

                // Send email
                sendContactEmail(user_name, user_email, subject, message);

                setTimeout(() => {
                    contactForm.reset();
                }, 500);
            } catch (error) {
                console.error('Error in contact form submission:', error);
                showModal('Error', 'Something went wrong. Please try again.');
            }

            return false;
        }, true);
    }
    
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();

            try {
                // Get form data
                const formData = {
                    full_name: enquiryForm.querySelector('input[name="full_name"]').value,
                    email: enquiryForm.querySelector('input[name="email"]').value,
                    phone: enquiryForm.querySelector('input[name="phone"]').value,
                    company: enquiryForm.querySelector('input[name="company"]').value,
                    medicine_type: enquiryForm.querySelector('select[name="medicine_type"]').value,
                    quantity: enquiryForm.querySelector('input[name="quantity"]').value,
                    details: enquiryForm.querySelector('textarea[name="details"]').value
                };

                // Validate required fields
                if (!formData.full_name || !formData.email || !formData.phone || !formData.medicine_type || !formData.quantity) {
                    showModal('Error', 'Please fill all required fields');
                    return false;
                }

                // Send email
                sendEnquiryEmail(formData);

                setTimeout(() => {
                    enquiryForm.reset();
                }, 500);
            } catch (error) {
                console.error('Error in enquiry form submission:', error);
                showModal('Error', 'Something went wrong. Please try again.');
            }

            return false;
        }, true);
    }
});

// ============================================
// MODAL FUNCTIONALITY
// ============================================

const modal = document.getElementById('messageModal');
const closeBtn = document.querySelector('.close');

function showModal(title, message) {
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    
    if (modal) modal.style.display = 'block';
}

function closeModal() {
    if (modal) modal.style.display = 'none';
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'success') {
    // Remove existing notifications to prevent stack congestion
    const oldNotifications = document.querySelectorAll('.toast-notification');
    oldNotifications.forEach(n => n.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.style.cssText = `
        position: fixed;
        top: 85px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        font-family: inherit;
        font-weight: 600;
        font-size: 0.9rem;
        animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        max-width: 320px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3200);
}

// ============================================
// SCROLL-TRIGGERED OBSERVER ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.service-card, .medicine-card, .info-card, .about-glass-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });
});

// ============================================
// PARALLAX / DECORATIVE SHAPES
// ============================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shape');
    
    parallaxElements.forEach((el, index) => {
        el.style.transform = `translateY(${scrolled * 0.35}px) rotate(${scrolled * 0.05}deg)`;
    });
});

// ============================================
// SMOOTH PAGE LOAD INITIALIZATION
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const ctaBtn = document.querySelector('.cta-btn');
    
    if (heroTitle) {
        heroTitle.style.animation = 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    if (heroSubtitle) {
        heroSubtitle.style.animation = 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both';
    }
    if (ctaBtn) {
        ctaBtn.style.animation = 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both';
    }
});

// ============================================
// DYNAMIC FOOTER UTILITIES & YEAR
// ============================================

const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.textContent = `© ${currentYear} Dipak Pharm Chem. All rights reserved.`;
}

// Keyboard shortcuts for navigation: Alt + H (home), Alt + M (medicines), Alt + C (contact)
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'h') {
        document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
    }
    if (e.altKey && e.key === 'c') {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
    if (e.altKey && e.key === 'm') {
        document.getElementById('medicines')?.scrollIntoView({ behavior: 'smooth' });
    }
});

// Focus styling accessibility handler
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

console.log('Dipak Pharm Chem website loaded successfully!');
