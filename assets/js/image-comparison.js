(function () {
    'use strict';

    class ImageComparison {
        constructor(container) {
            this.container = container;
            this.wrapper = container.querySelector('.comparison-wrapper');
            this.overlay = container.querySelector('.comparison-overlay');
            this.slider = container.querySelector('.comparison-slider');
            this.orientation = container.dataset.orientation || 'vertical';
            this.startPosition = parseFloat(container.dataset.startPosition) || 50;
            this.isDragging = false;

            this.init();
        }

        init() {
            // Set initial position
            this.setPosition(this.startPosition);

            // Bind events
            this.bindEvents();

            // Add keyboard support
            this.addKeyboardSupport();
        }

        setPosition(position) {
            position = Math.max(0, Math.min(100, position));

            if (this.orientation === 'vertical') {
                this.slider.style.left = position + '%';
                this.overlay.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
            } else {
                this.slider.style.top = position + '%';
                this.overlay.style.clipPath = `inset(${100 - position}% 0 0 0)`;
            }

            // Update ARIA value
            this.slider.setAttribute('aria-valuenow', Math.round(position));
        }

        bindEvents() {
            // Mouse events
            this.slider.addEventListener('mousedown', this.startDrag.bind(this));
            document.addEventListener('mousemove', this.drag.bind(this));
            document.addEventListener('mouseup', this.stopDrag.bind(this));

            // Touch events
            this.slider.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
            document.addEventListener('touchmove', this.drag.bind(this), { passive: false });
            document.addEventListener('touchend', this.stopDrag.bind(this));

            // Click to position
            this.wrapper.addEventListener('click', this.clickToPosition.bind(this));
        }

        addKeyboardSupport() {
            this.slider.addEventListener('keydown', (e) => {
                let position = parseFloat(this.slider.style.left || this.slider.style.top) || 50;
                let step = e.shiftKey ? 10 : 1;

                switch (e.key) {
                    case 'ArrowLeft':
                    case 'ArrowDown':
                        e.preventDefault();
                        this.setPosition(position - step);
                        break;
                    case 'ArrowRight':
                    case 'ArrowUp':
                        e.preventDefault();
                        this.setPosition(position + step);
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.setPosition(0);
                        break;
                    case 'End':
                        e.preventDefault();
                        this.setPosition(100);
                        break;
                }
            });
        }

        startDrag(e) {
            e.preventDefault();
            this.isDragging = true;
            this.slider.classList.add('active');
            document.body.style.cursor = this.orientation === 'vertical' ? 'ew-resize' : 'ns-resize';
        }

        drag(e) {
            if (!this.isDragging) return;

            e.preventDefault();
            const rect = this.wrapper.getBoundingClientRect();
            let position;

            if (this.orientation === 'vertical') {
                const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                position = ((x - rect.left) / rect.width) * 100;
            } else {
                const y = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
                position = ((y - rect.top) / rect.height) * 100;
            }

            this.setPosition(position);
        }

        stopDrag() {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.slider.classList.remove('active');
            document.body.style.cursor = '';
        }

        clickToPosition(e) {
            if (e.target === this.slider || this.slider.contains(e.target)) return;

            const rect = this.wrapper.getBoundingClientRect();
            let position;

            if (this.orientation === 'vertical') {
                position = ((e.clientX - rect.left) / rect.width) * 100;
            } else {
                position = ((e.clientY - rect.top) / rect.height) * 100;
            }

            this.setPosition(position);
        }
    }

    // Initialize all comparison containers when DOM is ready
    function initializeComparisons() {
        const containers = document.querySelectorAll('.image-comparison-container');
        containers.forEach(container => {
            // Skip if already initialized
            if (container.dataset.initialized === 'true') return;

            new ImageComparison(container);
            container.dataset.initialized = 'true';
        });
    }

    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeComparisons);
    } else {
        initializeComparisons();
    }

    // Re-initialize on dynamic content (for page builders, AJAX, etc.)
    if (typeof jQuery !== 'undefined') {
        jQuery(document).on('ready', initializeComparisons);
    }

    // Expose to global scope for manual initialization if needed
    window.ImageComparison = ImageComparison;
    window.initializeImageComparisons = initializeComparisons;
})();
