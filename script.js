// script.js

// Developer signature - KnDjoshua
console.log('HOREMOW Website - Developed by KnDjoshua');

// Events Calendar Class with Public Google Calendar Integration


// ========== MAIN DOM CONTENT LOADED ==========
document.addEventListener('DOMContentLoaded', function () {
    console.log('HOREMOW Website - Initializing...');

    // Initialize Events Calendar (ONLY ONCE)
    window.eventsCalendar = new EventsCalendar();

    // Update last sync time every minute
    setInterval(() => {
        if (window.eventsCalendar) {
            window.eventsCalendar.updateLastSync();
        }
    }, 60000);

    // Mobile Navigation Toggle

// Fix Hamburger Menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    // Debug: Check if elements exist
    console.log('Hamburger found:', hamburger);
    console.log('Nav list found:', navList);
    console.log('Nav links found:', navLinks.length);
    
    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            console.log('Hamburger clicked');
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle classes
            this.classList.toggle('active');
            navList.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Toggle aria-expanded for accessibility
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            
            // Prevent scrolling when menu is open
            if (navList.classList.contains('active')) {
                body.style.overflow = 'hidden';
                body.style.position = 'fixed';
                body.style.width = '100%';
                body.style.height = '100%';
            } else {
                body.style.overflow = '';
                body.style.position = '';
                body.style.width = '';
                body.style.height = '';
            }
        });
    }
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Nav link clicked:', this.textContent);
            
            // Close mobile menu
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
                body.style.position = '';
                body.style.width = '';
                body.style.height = '';
                
                hamburger.setAttribute('aria-expanded', 'false');
            }
            
            // Update active class for all links
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navList.contains(e.target) && !hamburger.contains(e.target)) {
            if (navList.classList.contains('active')) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
                body.style.position = '';
                body.style.width = '';
                body.style.height = '';
                
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (navList.classList.contains('active')) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
                body.style.position = '';
                body.style.width = '';
                body.style.height = '';
                
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Handle window resize - close menu if resized to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (navList.classList.contains('active')) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
                body.style.position = '';
                body.style.width = '';
                body.style.height = '';
                
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });
});
</script>























    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (hamburger) hamburger.classList.remove('active');
            if (navList) navList.classList.remove('active');
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Accordion functionality for beliefs section
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', function () {
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        }
    });

    // Form submission
    const contactForm = document.getElementById('messageForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }

            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'var(--white)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        }
    });

    // Set active nav link based on scroll position
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;

            if (window.scrollY >= (sectionTop - headerHeight - 50)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);

    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.aim-card, .pastor-card, .sermon-card, .book-card');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 150) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Set initial state for animated elements
    document.querySelectorAll('.aim-card, .pastor-card, .sermon-card, .book-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Initialize other managers
    if (typeof ChaptersManager !== 'undefined') {
        new ChaptersManager();
    }
    if (typeof ContactManager !== 'undefined') {
        new ContactManager();
    }
});

// ========== OTHER FUNCTIONALITY ==========

// Sermons Filtering and Search Functionality
document.addEventListener('DOMContentLoaded', function () {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sermonCards = document.querySelectorAll('.sermon-card');
    const searchInput = document.getElementById('sermonSearch');
    const loadMoreBtn = document.getElementById('loadMoreSermons');

    if (filterBtns.length > 0 && sermonCards.length > 0) {
        let visibleSermons = 4;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const filter = this.getAttribute('data-filter');
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                sermonCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-preacher') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => card.classList.remove('hidden'), 10);
                    } else {
                        card.classList.add('hidden');
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });

                visibleSermons = 4;
                updateLoadMoreButton();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', function () {
                const searchTerm = this.value.toLowerCase();
                sermonCards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const description = card.querySelector('.sermon-description').textContent.toLowerCase();
                    const preacher = card.querySelector('.sermon-preacher').textContent.toLowerCase();

                    if (title.includes(searchTerm) || description.includes(searchTerm) || preacher.includes(searchTerm)) {
                        card.style.display = 'block';
                        setTimeout(() => card.classList.remove('hidden'), 10);
                    } else {
                        card.classList.add('hidden');
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            });
        }

        function updateLoadMoreButton() {
            const visibleCards = document.querySelectorAll('.sermon-card:not(.hidden)');
            if (loadMoreBtn) {
                if (visibleCards.length <= visibleSermons) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'block';
                }

                visibleCards.forEach((card, index) => {
                    if (index < visibleSermons) {
                        card.style.display = 'block';
                        setTimeout(() => card.classList.remove('hidden'), 10);
                    } else {
                        card.classList.add('hidden');
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            }
        }

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function () {
                visibleSermons += 4;
                updateLoadMoreButton();
            });
        }

        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const card = this.closest('.sermon-card');
                const title = card.querySelector('h3').textContent;
                if (navigator.share) {
                    navigator.share({
                        title: title,
                        url: window.location.href
                    });
                } else {
                    alert(`Share "${title}" with others!`);
                }
            });
        });

        updateLoadMoreButton();
    }
});

// Chapters Section Interactivity
class ChaptersManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupSearch();
        this.setupFilters();
        this.setupContactButtons();
    }

    setupSearch() {
        const searchInput = document.getElementById('chapterSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                this.filterChapters(searchTerm);
            });
        }
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.applyFilter(filter);
            });
        });
    }

    setupContactButtons() {
        document.querySelectorAll('.contact-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const phone = e.target.getAttribute('data-phone');
                window.open(`tel:${phone}`, '_self');
            });
        });

        document.querySelectorAll('.whatsapp-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const phone = e.target.getAttribute('data-phone');
                const message = "Hello, I'm interested in learning more about HOREMOW";
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
            });
        });

        document.querySelectorAll('.directions-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const address = "Lugala, Kampala, Uganda";
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
            });
        });
    }

    filterChapters(searchTerm) {
        const activeGrid = document.querySelector('.chapters-grid.active');
        if (activeGrid) {
            const chapters = activeGrid.querySelectorAll('.chapter-card');
            let visibleCount = 0;

            chapters.forEach(chapter => {
                const text = chapter.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    chapter.style.display = 'block';
                    visibleCount++;
                } else {
                    chapter.style.display = 'none';
                }
            });

            this.toggleNoResults(visibleCount === 0);
        }
    }

    applyFilter(filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        document.querySelectorAll('.chapters-grid').forEach(grid => {
            grid.classList.remove('active');
        });

        if (filter === 'all') {
            const ugandaGrid = document.querySelector('[data-region="uganda"]');
            if (ugandaGrid) ugandaGrid.classList.add('active');
        } else {
            const regionGrid = document.querySelector(`[data-region="${filter}"]`);
            if (regionGrid) regionGrid.classList.add('active');
        }

        const searchInput = document.getElementById('chapterSearch');
        if (searchInput) {
            searchInput.value = '';
        }
        this.filterChapters('');
    }

    toggleNoResults(show) {
        const noResults = document.querySelector('.no-results');
        const activeGrid = document.querySelector('.chapters-grid.active');

        if (show) {
            if (noResults) noResults.style.display = 'block';
            if (activeGrid) activeGrid.style.display = 'none';
        } else {
            if (noResults) noResults.style.display = 'none';
            if (activeGrid) activeGrid.style.display = 'grid';
        }
    }
}

// Contact Section Interactivity
class ContactManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupForm();
        this.setupMapInteractions();
    }

    setupForm() {
        const form = document.getElementById('messageForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        }
    }

    setupMapInteractions() {
        const mapPin = document.querySelector('.map-pin');
        if (mapPin) {
            mapPin.addEventListener('click', () => {
                window.open('https://maps.app.goo.gl/HkKAkGMo2Xk9Mzxi9', '_blank');
            });
        }
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            this.showSuccessMessage();
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showSuccessMessage() {
        const notification = document.createElement('div');
        notification.className = 'form-success';
        notification.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <div>
                    <h4>Message Sent Successfully!</h4>
                    <p>Thank you for contacting HOREMOW. We'll get back to you within 24 hours.</p>
                </div>
            </div>
        `;

        document.body.appendChild(notification);
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--white);
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            border-left: 4px solid var(--primary);
            z-index: 1000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Copy address function
function copyAddress() {
    const address = "HOREMOW Uganda, Lugala, Kampala, Uganda";
    navigator.clipboard.writeText(address).then(() => {
        const btn = event.target.closest('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    });
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .form-success .success-content {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .form-success i {
        color: var(--primary);
        font-size: 1.5rem;
        margin-top: 0.2rem;
    }
    
    .form-success h4 {
        color: var(--primary);
        margin-bottom: 0.5rem;
    }
    
    .form-success p {
        color: var(--text-light);
        margin: 0;
        font-size: 0.9rem;
    }
`;
document.head.appendChild(style);



// chartbot javascript

// DOM Elements
const chatbotIcon = document.getElementById('chatbotIcon');
const chatbotContainer = document.getElementById('chatbotContainer');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const quickReplies = document.getElementById('quickReplies');
const popupNotification = document.getElementById('popupNotification');
const closePopup = document.getElementById('closePopup');
const startChat = document.getElementById('startChat');
const notificationBadge = document.getElementById('notificationBadge');

// Bot responses database
const botResponses = {
    'greeting': 'Hello! Welcome to our church. How can I help you today?',
    'service times': 'We have services on Sundays at 9:00 AM and 11:00 AM. Sunday School is at 10:00 AM. We also have Wednesday Bible Study at 7:00 PM.',
    'location': 'We are located at 123 Faith Avenue, Kampala, Uganda. Plenty of parking is available at the rear of the building.',
    'events': 'This week we have: Men\'s Prayer Breakfast (Saturday, 8:00 AM), Women\'s Fellowship (Saturday, 2:00 PM), and Children\'s Ministry Training (Sunday, 12:30 PM).',
    'prayer': 'We believe in the power of prayer. Our prayer team is ready to intercede for you. For personal prayer requests, please contact us directly on WhatsApp.',
    'beliefs': 'We believe in the core truths of Christianity: the authority of the Bible, the Trinity, salvation by grace through faith, and the mission of the church.',
    'pastor': 'For matters requiring pastoral care, our team would be happy to assist you directly. Please contact us on WhatsApp to schedule a conversation.',
    'default': 'I\'m sorry, I didn\'t understand that. Could you please rephrase? For more specific assistance, you can contact us directly on WhatsApp.'
};

// Keywords mapping to responses
const keywordMap = {
    'hello': 'greeting',
    'hi': 'greeting',
    'service': 'service times',
    'time': 'service times',
    'sunday': 'service times',
    'when': 'service times',
    'where': 'location',
    'address': 'location',
    'map': 'location',
    'event': 'events',
    'activity': 'events',
    'pray': 'prayer',
    'prayer': 'prayer',
    'believe': 'beliefs',
    'faith': 'beliefs',
    'doctrine': 'beliefs',
    'pastor': 'pastor',
    'counsel': 'pastor',
    'help': 'pastor'
};

// Auto-popup functionality
let popupShown = false;
let popupTimer;

function showPopup() {
    if (!popupShown) {
        popupTimer = setTimeout(() => {
            popupNotification.classList.add('active');
            notificationBadge.style.display = 'flex';
            popupShown = true;
        }, 3000); // Show popup after 3 seconds
    }
}

function hidePopup() {
    popupNotification.classList.remove('active');
    notificationBadge.style.display = 'none';
}

// Event Listeners
chatbotIcon.addEventListener('click', () => {
    chatbotContainer.classList.toggle('active');
    hidePopup();
    notificationBadge.style.display = 'none';
});

closeChat.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
});

closePopup.addEventListener('click', () => {
    hidePopup();
});

startChat.addEventListener('click', () => {
    chatbotContainer.classList.add('active');
    hidePopup();
    notificationBadge.style.display = 'none';
});

// Chat functionality
function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';

    // Process and respond
    setTimeout(() => {
        processUserMessage(message);
    }, 1000);
}

function sendQuickReply(reply) {
    addMessage(reply, 'user');

    setTimeout(() => {
        processUserMessage(reply);
    }, 1000);
}

function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    let responseKey = 'default';

    // Check for keywords
    for (const [keyword, key] of Object.entries(keywordMap)) {
        if (lowerMessage.includes(keyword)) {
            responseKey = key;
            break;
        }
    }

    // Special case for complex queries
    if (message.length > 30 ||
        lowerMessage.includes('problem') ||
        lowerMessage.includes('issue') ||
        lowerMessage.includes('crisis') ||
        lowerMessage.includes('marriage') ||
        lowerMessage.includes('family')) {
        responseKey = 'pastor';
    }

    const response = botResponses[responseKey];
    addMessage(response, 'bot');

    // Show WhatsApp prompt for certain responses
    if (responseKey === 'pastor' || responseKey === 'prayer') {
        setTimeout(() => {
            addMessage("For more personalized assistance, feel free to contact our team directly on WhatsApp. We're here to help!", 'bot');
        }, 1500);
    }

    // Scroll to bottom of chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Initialize chatbot
function initChatbot() {
    // Show auto-popup after delay
    showPopup();

    // Add welcome message after a short delay
    setTimeout(() => {
        addMessage("You can ask me about service times, location, events, or how to get connected with our church community.", 'bot');
    }, 2000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initChatbot);

// Close popup if user clicks outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.chatbot-widget') &&
        !event.target.closest('.popup-notification')) {
        hidePopup();
    }
});