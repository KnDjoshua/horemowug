// script.js

// Developer signature - KnDjoshua
console.log('HOREMOW Website - Developed by KnDjoshua');

// Events Calendar Class with Public Google Calendar Integration
class EventsCalendar {
    constructor() {
        this.currentDate = new Date();
        this.events = [];
        // Your church calendar ID
        this.calendarId = '9e8b3abdbc26f014002e5648281b6fcfd763c91e84540d9df3130a0e13ddfb97@group.calendar.google.com';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateCalendar();
        this.loadGoogleCalendarEvents();
    }

    setupEventListeners() {
        // View toggle buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.getAttribute('data-view'));
            });
        });

        // Month navigation
        const prevMonthBtn = document.querySelector('.prev-month');
        const nextMonthBtn = document.querySelector('.next-month');

        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.generateCalendar();
                this.loadGoogleCalendarEvents();
            });
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.generateCalendar();
                this.loadGoogleCalendarEvents();
            });
        }

        // Modal close
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal when clicking outside
        const eventModal = document.getElementById('event-modal');
        if (eventModal) {
            eventModal.addEventListener('click', (e) => {
                if (e.target.id === 'event-modal') {
                    this.closeModal();
                }
            });
        }

        // Refresh events
        const refreshBtn = document.getElementById('refresh-events');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshCalendar();
            });
        }

        // Calendar subscription
        const googleCalendarLink = document.getElementById('google-calendar-link');
        if (googleCalendarLink) {
            googleCalendarLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openGoogleCalendarSubscription();
            });
        }

        const downloadIcal = document.getElementById('download-ical');
        if (downloadIcal) {
            downloadIcal.addEventListener('click', () => {
                this.downloadICal();
            });
        }
    }

    async loadGoogleCalendarEvents() {
        console.log('Loading events from Google Calendar...');
        this.showLoading(true);

        try {
            // Get date range for current month view
            const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
            const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

            // Format dates for API
            const timeMin = firstDay.toISOString();
            const timeMax = lastDay.toISOString();

            console.log('Fetching events from:', timeMin, 'to', timeMax);
            console.log('Calendar ID:', this.calendarId);

            // For public calendars - no API key needed
            const response = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events?` +
                `timeMin=${timeMin}&` +
                `timeMax=${timeMax}&` +
                `singleEvents=true&` +
                `orderBy=startTime&` +
                `maxResults=50`
            );

            console.log('API Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Events received:', data.items?.length || 0);

                if (data.items && data.items.length > 0) {
                    this.processGoogleEvents(data.items);
                    this.updateConnectionStatus(true, `Loaded ${data.items.length} events from Google Calendar`);
                } else {
                    console.log('No events found in calendar, using sample events');
                    this.loadSampleEvents();
                    this.updateConnectionStatus(true, 'No events found - using sample events');
                }
            } else {
                console.error('Calendar API error:', response.status, response.statusText);
                throw new Error(`Calendar not accessible: ${response.status}`);
            }

        } catch (error) {
            console.error('Error loading Google Calendar events:', error);
            this.loadSampleEvents();
            this.updateConnectionStatus(false, 'Using sample events - calendar not accessible');
        } finally {
            this.showLoading(false);
            this.updateLastSync();
        }
    }

    processGoogleEvents(googleEvents) {
        console.log('Processing Google events:', googleEvents);

        this.events = googleEvents.map((event, index) => {
            const startDate = event.start.dateTime || event.start.date;
            const endDate = event.end.dateTime || event.end.date;

            // Calculate duration
            const start = new Date(startDate);
            const end = new Date(endDate);
            const duration = Math.round((end - start) / (1000 * 60));

            // Extract event details with defaults
            const location = event.location || 'Lugala Chapter';
            const description = event.description || 'Join us for this church event!';

            // Smart preacher detection
            let preacher = this.extractPreacherFromDescription(description);

            // Smart event type classification
            const type = this.classifyEventType(event.summary, description);

            console.log('Processed event:', event.summary, 'on', startDate);

            return {
                id: event.id || `event-${index}`,
                title: event.summary || 'Church Event',
                description: description,
                date: new Date(startDate),
                endDate: new Date(endDate),
                duration: duration,
                location: location,
                type: type,
                preacher: preacher,
                googleEvent: true,
                htmlLink: event.htmlLink
            };
        });

        console.log('Final events array:', this.events);

        // Update all views
        this.generateCalendar();
        this.renderListView();
        this.renderUpcomingView();
        this.updateEventsCount();
    }

    extractPreacherFromDescription(description) {
        if (!description) return 'To be announced';

        const preacherPatterns = [
            /(?:preacher|speaker|pastor)[:\s]+([^\n.<]+)/i,
            /(?:with|by)\s+([^\n.<]+?)(?:\s+leading|\s+preaching|$)/i,
            /Pastor\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/
        ];

        for (const pattern of preacherPatterns) {
            const match = description.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }

        return 'To be announced';
    }

    classifyEventType(title, description) {
        const text = (title + ' ' + (description || '')).toLowerCase();

        if (text.includes('sunday service') || text.includes('worship service')) return 'service';
        if (text.includes('bible study') || text.includes('study')) return 'study';
        if (text.includes('prayer') || text.includes('praying')) return 'prayer';
        if (text.includes('conference') || text.includes('revival')) return 'conference';
        if (text.includes('fellowship') || text.includes('youth')) return 'fellowship';
        if (text.includes('wedding')) return 'wedding';
        if (text.includes('funeral')) return 'funeral';

        return 'service';
    }

    loadSampleEvents() {
        console.log('Loading sample events...');

        // Create sample events for the current month
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        this.events = [
            {
                id: 1,
                title: 'Sunday Service',
                description: 'Join us for our weekly Sunday service with worship and preaching from God\'s word.',
                date: new Date(currentYear, currentMonth, 15, 10, 0), // 15th of current month
                duration: 120,
                location: 'Lugala Chapter',
                type: 'service',
                preacher: 'Pastor Anthony Azi',
                googleEvent: false
            },
            {
                id: 2,
                title: 'Bible Study',
                description: 'Mid-week Bible study focusing on the Book of Romans. All are welcome.',
                date: new Date(currentYear, currentMonth, 18, 18, 0), // 18th of current month
                duration: 90,
                location: 'Lugala Chapter',
                type: 'study',
                preacher: 'Pastor Susan Azi',
                googleEvent: false
            },
            {
                id: 3,
                title: 'Prayer Meeting',
                description: 'Corporate prayer meeting for the needs of the church and community.',
                date: new Date(currentYear, currentMonth, 22, 17, 0), // 22nd of current month
                duration: 60,
                location: 'Lugala Chapter',
                type: 'prayer',
                preacher: 'Brother Benedict',
                googleEvent: false
            }
        ];

        this.generateCalendar();
        this.renderListView();
        this.renderUpcomingView();
        this.updateEventsCount();
    }

    switchView(view) {
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-view="${view}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Show selected view
        document.querySelectorAll('.month-view, .list-view, .upcoming-view').forEach(viewEl => {
            viewEl.classList.remove('active');
        });
        const activeView = document.querySelector(`.${view}-view`);
        if (activeView) {
            activeView.classList.add('active');
        }

        if (view === 'list') {
            this.renderListView();
        } else if (view === 'upcoming') {
            this.renderUpcomingView();
        }
    }

    generateCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        if (!calendarGrid) {
            console.error('Calendar grid element not found!');
            return;
        }

        calendarGrid.innerHTML = '';

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        const monthHeader = document.getElementById('current-month');
        if (monthHeader) {
            monthHeader.textContent = this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        }

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
        if (!eventsList) return;

        eventsList.innerHTML = '';

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
                    <button class="btn btn-primary">Details</button>
                </div>
            `;
            const detailsBtn = eventElement.querySelector('.btn');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', () => this.showEventDetails(event));
            }
            eventsList.appendChild(eventElement);
        });
    }

    renderUpcomingView() {
        const upcomingEvents = document.getElementById('upcoming-events');
        if (!upcomingEvents) return;

        upcomingEvents.innerHTML = '';

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
                    <button class="btn btn-primary">View Details</button>
                </div>
            `;
            const detailsBtn = eventElement.querySelector('.btn');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', () => this.showEventDetails(event));
            }
            upcomingEvents.appendChild(eventElement);
        });
    }

    showEventDetails(event) {
        const modal = document.getElementById('event-modal');
        const modalContent = document.getElementById('modal-content');
        if (!modal || !modalContent) return;

        const eventDate = new Date(event.date);

        let googleCalendarButton = '';
        if (event.googleEvent && event.htmlLink) {
            googleCalendarButton = `
                <button class="btn btn-google">
                    <i class="fab fa-google"></i> Open in Google Calendar
                </button>
            `;
        }

        modalContent.innerHTML = `
            <h3>${event.title}</h3>
            <div class="event-details-meta">
                <p><strong>Date & Time:</strong> ${eventDate.toLocaleDateString()} at ${this.formatTime(event.date)}</p>
                <p><strong>Duration:</strong> ${this.formatDuration(event.duration)}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Speaker:</strong> ${event.preacher}</p>
                <p><strong>Event Type:</strong> ${this.formatEventType(event.type)}</p>
                ${event.googleEvent ? '<p><strong>Source:</strong> Google Calendar</p>' : '<p><strong>Source:</strong> Sample Event</p>'}
            </div>
            <div class="event-description">
                <p>${event.description}</p>
            </div>
            <div class="event-actions">
                ${googleCalendarButton}
                <button class="btn btn-primary">
                    <i class="far fa-calendar-plus"></i> Add to My Calendar
                </button>
                <button class="btn btn-secondary">
                    <i class="fas fa-share"></i> Share Event
                </button>
            </div>
        `;

        // Add event listeners to modal buttons
        if (event.googleEvent && event.htmlLink) {
            const googleBtn = modalContent.querySelector('.btn-google');
            if (googleBtn) {
                googleBtn.addEventListener('click', () => this.openGoogleCalendar(event.htmlLink));
            }
        }

        const addToCalendarBtn = modalContent.querySelector('.btn-primary');
        if (addToCalendarBtn) {
            addToCalendarBtn.addEventListener('click', () => this.addToCalendar(event.id));
        }

        const shareBtn = modalContent.querySelector('.btn-secondary');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareEvent(event.id));
        }

        modal.classList.add('active');
    }

    openGoogleCalendar(url) {
        window.open(url, '_blank');
    }

    addToCalendar(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event.googleEvent && event.htmlLink) {
            window.open(event.htmlLink, '_blank');
        } else {
            // For sample events, create a Google Calendar URL
            const startTime = event.date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');
            const endTime = new Date(event.date.getTime() + event.duration * 60000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');

            const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

            window.open(googleCalendarUrl, '_blank');
        }
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
            navigator.clipboard.writeText(`${event.title} - ${window.location.href}`);
            alert('Event link copied to clipboard!');
        }
    }

    openGoogleCalendarSubscription() {
        const googleUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(this.calendarId)}`;
        window.open(googleUrl, '_blank');
    }

    downloadICal() {
        // Simple iCal file creation
        let icalContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//HOREMOW Church//EN'
        ];

        this.events.forEach(event => {
            const start = this.formatDateForICal(event.date);
            const end = this.formatDateForICal(new Date(event.date.getTime() + event.duration * 60000));

            icalContent.push(
                'BEGIN:VEVENT',
                `DTSTART:${start}`,
                `DTEND:${end}`,
                `SUMMARY:${event.title}`,
                `DESCRIPTION:${event.description}`,
                `LOCATION:${event.location}`,
                'END:VEVENT'
            );
        });

        icalContent.push('END:VCALENDAR');

        const blob = new Blob([icalContent.join('\n')], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'horemow-events.ics';
        a.click();
        URL.revokeObjectURL(url);
    }

    formatDateForICal(date) {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');
    }

    closeModal() {
        const modal = document.getElementById('event-modal');
        if (modal) {
            modal.classList.remove('active');
        }
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

    updateConnectionStatus(connected, message) {
        const statusElement = document.getElementById('connection-status');
        if (!statusElement) return;

        const indicator = statusElement.querySelector('.status-indicator');
        if (indicator) {
            if (connected) {
                statusElement.className = 'connection-status connected';
                indicator.innerHTML = '<i class="fas fa-wifi"></i> Connected';
            } else {
                statusElement.className = 'connection-status error';
                indicator.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Disconnected';
            }
        }

        // Update status details
        const eventsLoaded = document.getElementById('events-loaded');
        if (eventsLoaded) {
            eventsLoaded.textContent = `• ${this.events.length} events loaded`;
        }
    }

    updateEventsCount() {
        const countElement = document.getElementById('events-count');
        if (countElement) {
            countElement.textContent = `${this.events.length} events`;
        }
    }

    showLoading(show) {
        const statusElement = document.getElementById('connection-status');
        if (statusElement && show) {
            const indicator = statusElement.querySelector('.status-indicator');
            if (indicator) {
                indicator.innerHTML = '<i class="fas fa-sync fa-spin"></i> Loading...';
            }
        }
    }

    refreshCalendar() {
        this.loadGoogleCalendarEvents();
    }

    updateLastSync() {
        const lastSync = document.getElementById('last-sync');
        if (lastSync) {
            lastSync.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        }
    }
}

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
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            navList.classList.toggle('active');
        });
    }

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