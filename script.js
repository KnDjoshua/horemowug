// script.js

// Developer signature - KnDjoshua
console.log('HOREMOW Website - Developed by KnDjoshua');

document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');

    hamburger.addEventListener('click', function () {
        this.classList.toggle('active');
        navList.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navList.classList.remove('active');

            // Update active nav link
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Accordion functionality for beliefs section
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', function () {
            // Close all other accordion items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Tab functionality for chapters section
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to current button and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Form submission
    const contactForm = document.getElementById('messageForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }

            // In a real application, you would send this data to a server
            // For now, we'll just show a success message
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
                const headerHeight = document.querySelector('.header').offsetHeight;
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
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'var(--white)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Set active nav link based on scroll position
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('.header').offsetHeight;

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
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
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
    // Trigger once on load
    animateOnScroll();
});




// sermon
// Sermons Filtering and Search Functionality
document.addEventListener('DOMContentLoaded', function () {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sermonCards = document.querySelectorAll('.sermon-card');
    const searchInput = document.getElementById('sermonSearch');
    const loadMoreBtn = document.getElementById('loadMoreSermons');

    let visibleSermons = 4; // Initial number of sermons to show

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter sermons
            sermonCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-preacher') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.remove('hidden'), 10);
                } else {
                    card.classList.add('hidden');
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });

            // Reset visible count when filtering
            visibleSermons = 4;
            updateLoadMoreButton();
        });
    });

    // Search functionality
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

    // Load more functionality
    function updateLoadMoreButton() {
        const visibleCards = document.querySelectorAll('.sermon-card:not(.hidden)');
        if (visibleCards.length <= visibleSermons) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }

        // Show/hide sermons based on count
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

    loadMoreBtn.addEventListener('click', function () {
        visibleSermons += 4;
        updateLoadMoreButton();
    });

    // Share button functionality
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.sermon-card');
            const title = card.querySelector('h3').textContent;
            const url = window.location.href;

            // Simple share functionality (can be enhanced with Web Share API)
            if (navigator.share) {
                navigator.share({
                    title: title,
                    url: url
                });
            } else {
                // Fallback: copy to clipboard or show share options
                alert(`Share "${title}" with others!`);
            }
        });
    });

    // Initialize
    updateLoadMoreButton();
});


// events google calender

// Google Calendar Integration
// Events Calendar Functionality
class EventsCalendar {
    constructor() {
        this.currentDate = new Date();
        this.events = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateCalendar();
        this.loadSampleEvents(); // Replace with Google Calendar API later
    }

    setupEventListeners() {
        // View toggle buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.getAttribute('data-view'));
            });
        });

        // Month navigation
        document.querySelector('.prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.generateCalendar();
        });

        document.querySelector('.next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.generateCalendar();
        });

        // Modal close
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside
        document.getElementById('event-modal').addEventListener('click', (e) => {
            if (e.target.id === 'event-modal') {
                this.closeModal();
            }
        });
    }

    switchView(view) {
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Show selected view
        document.querySelectorAll('.month-view, .list-view, .upcoming-view').forEach(view => {
            view.classList.remove('active');
        });
        document.querySelector(`.${view}-view`).classList.add('active');

        // Refresh data for the view
        if (view === 'list') {
            this.renderListView();
        } else if (view === 'upcoming') {
            this.renderUpcomingView();
        }
    }

    generateCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        calendarGrid.innerHTML = '';

        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Update month header
        document.getElementById('current-month').textContent =
            this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        // Get first day of month and number of days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        // Add empty days for previous month
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of current month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';

            // Check if this is today
            if (this.currentDate.getMonth() === today.getMonth() &&
                this.currentDate.getFullYear() === today.getFullYear() &&
                day === today.getDate()) {
                dayElement.classList.add('today');
            }

            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayElement.appendChild(dayNumber);

            const dayEvents = document.createElement('div');
            dayEvents.className = 'day-events';

            // Add events for this day
            const dayDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const dayEventsData = this.getEventsForDate(dayDate);

            dayEventsData.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'calendar-event';
                eventElement.textContent = event.title;
                eventElement.addEventListener('click', () => this.showEventDetails(event));
                dayEvents.appendChild(eventElement);
            });

            dayElement.appendChild(dayEvents);
            calendarGrid.appendChild(dayElement);
        }
    }

    loadSampleEvents() {
        // Sample events - Replace with Google Calendar API later
        this.events = [
            {
                id: 1,
                title: 'Sunday Service',
                description: 'Join us for our weekly Sunday service with worship and preaching from God\'s word.',
                date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 10, 0),
                duration: 120,
                location: 'Lugala Chapter',
                type: 'service',
                preacher: 'Pastor Anthony Azi'
            },
            {
                id: 2,
                title: 'Bible Study',
                description: 'Mid-week Bible study focusing on the Book of Romans. All are welcome.',
                date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 4, 18, 0),
                duration: 90,
                location: 'Lugala Chapter',
                type: 'study',
                preacher: 'Pastor Susan Azi'
            },
            {
                id: 3,
                title: 'Prayer Meeting',
                description: 'Corporate prayer meeting for the needs of the church and community.',
                date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7, 17, 0),
                duration: 60,
                location: 'Lugala Chapter',
                type: 'prayer',
                preacher: 'Brother Benedict'
            },
            {
                id: 4,
                title: 'Holiness Conference',
                description: 'Annual holiness conference with special guest speakers and revival meetings.',
                date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 14, 9, 0),
                duration: 480,
                location: 'Main Auditorium',
                type: 'conference',
                preacher: 'Pastor Paul Rika'
            },
            {
                id: 5,
                title: 'Youth Fellowship',
                description: 'Special gathering for young people with worship, teaching, and fellowship.',
                date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 16, 15, 0),
                duration: 120,
                location: 'Youth Hall',
                type: 'fellowship',
                preacher: 'Sister Grace'
            }
        ];

        this.renderListView();
        this.renderUpcomingView();
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear();
        });
    }

    renderListView() {
        const eventsList = document.getElementById('events-list');
        eventsList.innerHTML = '';

        // Sort events by date
        const sortedEvents = [...this.events].sort((a, b) => new Date(a.date) - new Date(b.date));

        sortedEvents.forEach(event => {
            const eventDate = new Date(event.date);
            const eventElement = document.createElement('div');
            eventElement.className = 'event-list-item';
            eventElement.innerHTML = `
                <div class="event-list-date">
                    <div class="event-list-day">${eventDate.getDate()}</div>
                    <div class="event-list-month">${eventDate.toLocaleString('default', { month: 'short' })}</div>
                </div>
                <div class="event-list-details">
                    <h4>${event.title}</h4>
                    <div class="event-list-meta">
                        <div><i class="far fa-clock"></i> ${this.formatTime(event.date)}</div>
                        <div><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
                        <div><i class="fas fa-user"></i> ${event.preacher}</div>
                    </div>
                </div>
                <div class="event-list-actions">
                    <button class="btn btn-primary" onclick="eventsCalendar.showEventDetails(${event.id})">Details</button>
                </div>
            `;
            eventsList.appendChild(eventElement);
        });
    }

    renderUpcomingView() {
        const upcomingEvents = document.getElementById('upcoming-events');
        upcomingEvents.innerHTML = '';

        // Get next 5 events
        const now = new Date();
        const upcoming = this.events
            .filter(event => new Date(event.date) > now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);

        upcoming.forEach(event => {
            const eventDate = new Date(event.date);
            const eventElement = document.createElement('div');
            eventElement.className = 'upcoming-event-card';
            eventElement.innerHTML = `
                <div class="upcoming-event-date">
                    <i class="far fa-calendar"></i>
                    ${eventDate.toLocaleDateString()} • ${this.formatTime(event.date)}
                </div>
                <h4>${event.title}</h4>
                <div class="upcoming-event-meta">
                    <div><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
                    <div><i class="fas fa-user"></i> ${event.preacher}</div>
                    <div><i class="far fa-clock"></i> ${this.formatDuration(event.duration)}</div>
                </div>
                <div class="upcoming-event-actions">
                    <button class="btn btn-primary" onclick="eventsCalendar.showEventDetails(${event.id})">View Details</button>
                </div>
            `;
            upcomingEvents.appendChild(eventElement);
        });
    }

    showEventDetails(eventId) {
        const event = typeof eventId === 'object' ? eventId : this.events.find(e => e.id === eventId);
        if (!event) return;

        const modal = document.getElementById('event-modal');
        const modalContent = document.getElementById('modal-content');
        const eventDate = new Date(event.date);

        modalContent.innerHTML = `
            <h3>${event.title}</h3>
            <div class="event-details-meta">
                <p><strong>Date & Time:</strong> ${eventDate.toLocaleDateString()} at ${this.formatTime(event.date)}</p>
                <p><strong>Duration:</strong> ${this.formatDuration(event.duration)}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Speaker:</strong> ${event.preacher}</p>
                <p><strong>Event Type:</strong> ${this.formatEventType(event.type)}</p>
            </div>
            <div class="event-description">
                <p>${event.description}</p>
            </div>
            <div class="event-actions">
                <button class="btn btn-primary" onclick="eventsCalendar.addToCalendar(${event.id})">
                    <i class="far fa-calendar-plus"></i> Add to Calendar
                </button>
                <button class="btn btn-secondary" onclick="eventsCalendar.shareEvent(${event.id})">
                    <i class="fas fa-share"></i> Share Event
                </button>
            </div>
        `;

        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('event-modal').classList.remove('active');
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }

    formatEventType(type) {
        const types = {
            'service': 'Church Service',
            'study': 'Bible Study',
            'prayer': 'Prayer Meeting',
            'conference': 'Conference',
            'fellowship': 'Fellowship'
        };
        return types[type] || type;
    }

    addToCalendar(eventId) {
        const event = this.events.find(e => e.id === eventId);
        // In real implementation, this would create .ics file or Google Calendar link
        alert(`Adding "${event.title}" to your calendar...`);
    }

    shareEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: event.description,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${event.title} - ${window.location.href}`);
            alert('Event link copied to clipboard!');
        }
    }
}

// Initialize the calendar when DOM is loaded
let eventsCalendar;

document.addEventListener('DOMContentLoaded', function () {
    eventsCalendar = new EventsCalendar();

    // Update last sync time
    setInterval(() => {
        const lastSync = document.getElementById('last-sync');
        lastSync.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    }, 60000); // Update every minute
});




// Enhanced homepage interaction Hero section
// Homepage Enhancements JavaScript
class HomepageEnhancements {
    constructor() {
        this.currentTestimonial = 0;
        this.init();
    }

    init() {
        this.setupTestimonialCarousel();
        this.setupLiveStream();
        this.setupSmoothScrolling();
    }

    setupTestimonialCarousel() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            slides[index].classList.add('active');
            dots[index].classList.add('active');
            this.currentTestimonial = index;
        };

        // Next button
        nextBtn.addEventListener('click', () => {
            let nextIndex = this.currentTestimonial + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            showSlide(nextIndex);
        });

        // Previous button
        prevBtn.addEventListener('click', () => {
            let prevIndex = this.currentTestimonial - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1;
            showSlide(prevIndex);
        });

        // Dot clicks
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        // Auto-advance
        setInterval(() => {
            let nextIndex = this.currentTestimonial + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            showSlide(nextIndex);
        }, 5000);
    }

    setupLiveStream() {
        // Simulate live stream stats updates
        setInterval(() => {
            const watchingElement = document.querySelector('.stream-stats span:first-child');
            const currentWatching = Math.floor(Math.random() * 50) + 200;
            watchingElement.innerHTML = `<i class="fas fa-eye"></i> ${currentWatching} watching now`;
        }, 10000);

        // Simulate chat messages
        const chatMessages = [
            "Praise God for this service!",
            "Amen to that message!",
            "Praying for everyone here",
            "This worship is powerful",
            "Thank you Pastor for the word"
        ];

        setInterval(() => {
            const chatContainer = document.querySelector('.chat-messages');
            const users = ['Sarah', 'David', 'Grace', 'Michael', 'Esther', 'Joshua'];
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomMessage = chatMessages[Math.floor(Math.random() * chatMessages.length)];

            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.innerHTML = `
                <span class="user">${randomUser}:</span>
                <span class="text">${randomMessage}</span>
            `;

            chatContainer.appendChild(messageElement);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 8000);
    }

    setupSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize homepage enhancements
document.addEventListener('DOMContentLoaded', function () {
    new HomepageEnhancements();

    // Update live indicator with current service
    function updateLiveService() {
        const now = new Date();
        const day = now.getDay();
        const hours = now.getHours();

        let service = '';
        if (day === 0) { // Sunday
            service = 'Sunday Service';
        } else if (day === 2) { // Tuesday
            service = 'Bible Study';
        } else if (day === 4) { // Thursday
            service = 'Prayer Meeting';
        } else {
            service = 'Fellowship';
        }

        const liveText = document.querySelector('.live-text');
        if (liveText) {
            liveText.textContent = `Live Now: ${service}`;
        }
    }

    updateLiveService();
    setInterval(updateLiveService, 60000); // Update every minute
});


// youtube API for sermon videos
// YouTube API Integration Class
class YouTubeAPI {
    constructor() {
        this.API_KEY = 'YOUR_YOUTUBE_API_KEY'; // You'll get this from Google Cloud Console
        this.CHANNEL_ID = 'YOUR_YOUTUBE_CHANNEL_ID'; // Your YouTube channel ID
        this.liveVideoId = null;
        this.isChecking = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkLiveStatus(); // Initial check
        this.startAutoRefresh();
        this.loadChannelStats();
        this.loadRecentVideos();
    }

    setupEventListeners() {
        // Manual refresh button
        document.addEventListener('click', (e) => {
            if (e.target.closest('[onclick="checkLiveStatus()"]')) {
                this.checkLiveStatus();
            }
        });
    }

    async checkLiveStatus() {
        if (this.isChecking) return;

        this.isChecking = true;
        this.showLoadingState();
        this.updateLastChecked();

        try {
            // Check for live broadcasts
            const liveResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${this.CHANNEL_ID}&eventType=live&type=video&key=${this.API_KEY}`
            );

            if (!liveResponse.ok) {
                throw new Error('YouTube API request failed');
            }

            const liveData = await liveResponse.json();

            if (liveData.items && liveData.items.length > 0) {
                // Channel is live!
                this.liveVideoId = liveData.items[0].id.videoId;
                await this.showLiveStream(this.liveVideoId);
            } else {
                // Channel is offline
                this.showOfflineState();
            }

        } catch (error) {
            console.error('Error checking live status:', error);
            this.showErrorState();
        } finally {
            this.isChecking = false;
        }
    }

    async showLiveStream(videoId) {
        try {
            // Get video details
            const videoResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails,statistics&id=${videoId}&key=${this.API_KEY}`
            );

            const videoData = await videoResponse.json();
            const video = videoData.items[0];

            // Update UI for live state
            this.showStatus('live');
            this.hideAllContainers();
            document.querySelector('.live-stream-embed').style.display = 'block';

            // Create YouTube embed
            const embedContainer = document.getElementById('youtube-embed');
            embedContainer.innerHTML = `
                <iframe 
                    width="100%" 
                    height="400" 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;

            // Update stream info
            document.getElementById('stream-title').textContent = video.snippet.title;
            document.getElementById('stream-description').textContent = video.snippet.description;

            // Update viewer count and time
            if (video.liveStreamingDetails) {
                this.updateViewerCount(video.statistics.viewCount);
                this.updateStreamTime(video.liveStreamingDetails.actualStartTime);
            }

        } catch (error) {
            console.error('Error loading live stream:', error);
            this.showErrorState();
        }
    }

    showOfflineState() {
        this.showStatus('offline');
        this.hideAllContainers();
        document.querySelector('.offline-state').style.display = 'block';
    }

    showErrorState() {
        this.showStatus('error');
        this.hideAllContainers();
        document.querySelector('.error-state').style.display = 'block';
    }

    showLoadingState() {
        this.showStatus('loading');
        this.hideAllContainers();
        document.querySelector('.stream-loading').style.display = 'block';
    }

    showStatus(status) {
        // Hide all status indicators
        const statusIndicators = document.querySelectorAll('.api-status-indicator > div');
        statusIndicators.forEach(indicator => indicator.style.display = 'none');

        // Show current status
        document.querySelector(`.status-${status}`).style.display = 'flex';
    }

    hideAllContainers() {
        const containers = document.querySelectorAll('.stream-loading, .live-stream-embed, .offline-state, .error-state');
        containers.forEach(container => container.style.display = 'none');
    }

    updateViewerCount(viewCount) {
        const countElement = document.querySelector('.count');
        if (viewCount) {
            countElement.textContent = this.formatNumber(viewCount);
        }
    }

    updateStreamTime(startTime) {
        const timeElement = document.querySelector('.time');
        if (startTime) {
            const start = new Date(startTime);
            const now = new Date();
            const diffMs = now - start;
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins < 60) {
                timeElement.textContent = `${diffMins} minutes`;
            } else {
                const diffHours = Math.floor(diffMins / 60);
                timeElement.textContent = `${diffHours} hours`;
            }
        }
    }

    updateLastChecked() {
        const lastChecked = document.getElementById('last-checked');
        lastChecked.textContent = `Last checked: ${new Date().toLocaleTimeString()}`;
    }

    async loadChannelStats() {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${this.CHANNEL_ID}&key=${this.API_KEY}`
            );

            const data = await response.json();
            const channel = data.items[0];

            // Update channel stats
            document.getElementById('sub-count').textContent = this.formatNumber(channel.statistics.subscriberCount);
            document.getElementById('video-count').textContent = this.formatNumber(channel.statistics.videoCount);
            document.getElementById('view-count').textContent = this.formatNumber(channel.statistics.viewCount);

        } catch (error) {
            console.error('Error loading channel stats:', error);
        }
    }

    async loadRecentVideos() {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${this.CHANNEL_ID}&maxResults=3&order=date&type=video&key=${this.API_KEY}`
            );

            const data = await response.json();
            const videosContainer = document.getElementById('recent-videos-list');

            videosContainer.innerHTML = data.items.map(video => `
                <div class="video-item">
                    <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                    <div class="video-info">
                        <h5>${video.snippet.title}</h5>
                        <p>${new Date(video.snippet.publishedAt).toLocaleDateString()}</p>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Error loading recent videos:', error);
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num;
    }

    startAutoRefresh() {
        // Check every 30 seconds
        setInterval(() => {
            if (!this.isChecking) {
                this.checkLiveStatus();
            }
        }, 30000);
    }
}

// Global function for manual refresh
function checkLiveStatus() {
    if (window.youtubeAPI) {
        window.youtubeAPI.checkLiveStatus();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.youtubeAPI = new YouTubeAPI();
});


// chapter section interactivity js
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
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.filterChapters(searchTerm);
        });
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
        // Phone call buttons
        document.querySelectorAll('.contact-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const phone = e.target.getAttribute('data-phone');
                window.open(`tel:${phone}`, '_self');
            });
        });

        // WhatsApp buttons
        document.querySelectorAll('.whatsapp-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const phone = e.target.getAttribute('data-phone');
                const message = "Hello, I'm interested in learning more about HOREMOW";
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
            });
        });

        // Directions buttons
        document.querySelectorAll('.directions-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // For Lugala headquarters
                const address = "Lugala, Kampala, Uganda";
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
            });
        });
    }

    filterChapters(searchTerm) {
        const activeGrid = document.querySelector('.chapters-grid.active');
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

    applyFilter(filter) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Show appropriate grid
        document.querySelectorAll('.chapters-grid').forEach(grid => {
            grid.classList.remove('active');
        });

        if (filter === 'all') {
            document.querySelector('[data-region="uganda"]').classList.add('active');
        } else {
            document.querySelector(`[data-region="${filter}"]`).classList.add('active');
        }

        // Clear search
        document.getElementById('chapterSearch').value = '';
        this.filterChapters('');
    }

    toggleNoResults(show) {
        const noResults = document.querySelector('.no-results');
        const activeGrid = document.querySelector('.chapters-grid.active');

        if (show) {
            noResults.style.display = 'block';
            activeGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            activeGrid.style.display = 'grid';
        }
    }
}

// Initialize chapters manager
document.addEventListener('DOMContentLoaded', function () {
    new ChaptersManager();
});




// contact interactivity
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
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });
    }

    setupMapInteractions() {
        // Add click handler for map pin
        const mapPin = document.querySelector('.map-pin');
        mapPin.addEventListener('click', () => {
            window.open('https://maps.app.goo.gl/HkKAkGMo2Xk9Mzxi9', '_blank');
        });
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            this.showSuccessMessage();
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showSuccessMessage() {
        // Create success notification
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
        
        // Add styles for notification
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
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Copy address function
function copyAddress() {
    const address = "HOREMOW Uganda, Lugala, Kampala, Uganda";
    navigator.clipboard.writeText(address).then(() => {
        // Show copy confirmation
        const btn = event.target.closest('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    });
}

// Initialize contact manager
document.addEventListener('DOMContentLoaded', function() {
    new ContactManager();
});

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
