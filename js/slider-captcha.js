// Custom Slider CAPTCHA
class SliderCaptcha {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.verified = false;
        this.tolerance = 5; // pixels tolerance for correct position
        this.init();
    }

    init() {
        // Generate random target position (60-80% of available sliding area)
        this.targetPosition = Math.floor(Math.random() * 20 + 60);

        // Create HTML structure
        this.container.innerHTML = `
            <div class="slider-captcha">
                <div class="slider-captcha-track">
                    <div class="slider-captcha-target"></div>
                    <div class="slider-captcha-fill"></div>
                </div>
                <div class="slider-captcha-handle" draggable="false">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
                <div class="slider-captcha-text">Slide to verify</div>
                <div class="slider-captcha-status"></div>
            </div>
        `;

        this.track = this.container.querySelector('.slider-captcha-track');
        this.handle = this.container.querySelector('.slider-captcha-handle');
        this.fill = this.container.querySelector('.slider-captcha-fill');
        this.text = this.container.querySelector('.slider-captcha-text');
        this.status = this.container.querySelector('.slider-captcha-status');
        this.target = this.container.querySelector('.slider-captcha-target');

        // Position target after elements are created
        this.positionTarget();

        this.setupEvents();
    }

    positionTarget() {
        // Calculate target position based on available sliding area (not full track width)
        const trackWidth = this.track.offsetWidth;
        const handleWidth = this.handle.offsetWidth;
        const maxX = trackWidth - handleWidth;

        // Target position in pixels
        const targetPixels = (this.targetPosition / 100) * maxX;

        // Position target line (accounting for handle center)
        this.target.style.left = (targetPixels + (handleWidth / 2)) + 'px';
    }

    setupEvents() {
        let isDragging = false;
        let startX = 0;
        let handleStartX = 0;

        const onStart = (e) => {
            if (this.verified) return;
            isDragging = true;
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            startX = clientX;

            // Get current handle position
            const handleRect = this.handle.getBoundingClientRect();
            const trackRect = this.track.getBoundingClientRect();
            handleStartX = handleRect.left - trackRect.left;

            this.handle.classList.add('dragging');
            this.text.textContent = 'Keep sliding...';
        };

        const onMove = (e) => {
            if (!isDragging || this.verified) return;

            e.preventDefault();
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const deltaX = clientX - startX;
            const trackWidth = this.track.offsetWidth;
            const handleWidth = this.handle.offsetWidth;
            const maxX = trackWidth - handleWidth;

            // Calculate new position
            let newX = handleStartX + deltaX;
            newX = Math.max(0, Math.min(newX, maxX));

            this.handle.style.left = newX + 'px';
            this.fill.style.width = newX + 'px';

            // Visual feedback when near target
            const targetPixels = (this.targetPosition / 100) * maxX;
            const handleCenter = newX + (handleWidth / 2);
            const targetCenter = targetPixels + (handleWidth / 2);
            const distance = Math.abs(handleCenter - targetCenter);

            if (distance < 30) {
                this.target.classList.add('near');
            } else {
                this.target.classList.remove('near');
            }
        };

        const onEnd = () => {
            if (!isDragging || this.verified) return;
            isDragging = false;
            this.handle.classList.remove('dragging');

            const trackWidth = this.track.offsetWidth;
            const handleWidth = this.handle.offsetWidth;
            const handleRect = this.handle.getBoundingClientRect();
            const trackRect = this.track.getBoundingClientRect();
            const currentX = handleRect.left - trackRect.left;
            const maxX = trackWidth - handleWidth;

            // Calculate target position in pixels
            const targetPixels = (this.targetPosition / 100) * maxX;
            const handleCenter = currentX + (handleWidth / 2);
            const targetCenter = targetPixels + (handleWidth / 2);
            const distance = Math.abs(handleCenter - targetCenter);

            // Check if slider is close enough to target (increased tolerance)
            if (distance <= 15) {
                this.onSuccess();
            } else {
                this.onFail();
            }
        };

        // Mouse events
        this.handle.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        // Touch events
        this.handle.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
    }

    onSuccess() {
        this.verified = true;
        this.container.classList.add('verified');
        this.text.textContent = 'Verified!';
        this.status.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        this.status.classList.add('success');

        // Snap to target position
        const trackWidth = this.track.offsetWidth;
        const handleWidth = this.handle.offsetWidth;
        const maxX = trackWidth - handleWidth;
        const targetPixels = (this.targetPosition / 100) * maxX;
        this.handle.style.left = targetPixels + 'px';
        this.fill.style.width = targetPixels + 'px';

        // Trigger custom event
        this.container.dispatchEvent(new CustomEvent('captcha-verified', {
            detail: { verified: true }
        }));
    }

    onFail() {
        this.text.textContent = 'Try again';
        this.status.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        this.status.classList.add('error');

        // Animate back to start
        this.handle.style.transition = 'left 0.3s ease';
        this.fill.style.transition = 'width 0.3s ease';
        this.handle.style.left = '0px';
        this.fill.style.width = '0px';

        setTimeout(() => {
            this.handle.style.transition = '';
            this.fill.style.transition = '';
            this.text.textContent = 'Slide to verify';
            this.status.innerHTML = '';
            this.status.classList.remove('error');
        }, 1000);
    }

    isVerified() {
        return this.verified;
    }

    reset() {
        this.verified = false;
        this.container.classList.remove('verified');
        this.handle.style.left = '0px';
        this.fill.style.width = '0px';
        this.text.textContent = 'Slide to verify';
        this.status.innerHTML = '';
        this.status.classList.remove('success', 'error');

        // Generate new random position
        this.targetPosition = Math.floor(Math.random() * 20 + 60);
        this.positionTarget();
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SliderCaptcha;
}
