document.addEventListener('DOMContentLoaded', () => {
    console.log('Food Link website loaded with enhancements.');

    // --- Share Functionality ---
    const shareButtons = document.querySelectorAll('.share-btn');
    const OFFICIAL_LINK = "https://www.foodlink.org/"; // Placeholder

    shareButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const assetUrl = btn.getAttribute('data-url');
            const shareData = {
                title: 'Food Link Project',
                text: `Check out this resource from the Food Link Project: ${assetUrl}. Official site: ${OFFICIAL_LINK}`,
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                    console.log('Content shared successfully');
                } catch (err) {
                    console.error('Error sharing:', err);
                }
            } else {
                const textToCopy = `${shareData.text} \n${shareData.url}`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert('Link copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        });
    });

    // --- Scroll Animations ---
    const cards = document.querySelectorAll('.card');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        observer.observe(card);
    });

    // Inject styles for animation
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .card.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // --- Video Autoplay with Sound Enforcement ---
    const video = document.getElementById('project-video');

    if (video) {
        // 1. Observer to handle Play/Pause on scroll
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Attempt unmuted play
                    video.muted = false;
                    video.play().catch(error => {
                        console.log("Autoplay blocked. Muting and retrying.", error);
                        video.muted = true;
                        video.play();
                    });
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });

        videoObserver.observe(video);

        // 2. Interaction Listener to Unmute
        function enableSound() {
            if (video.muted) {
                video.muted = false;
                console.log("Interaction detected. Unmuted video.");
            }
            // Cleanup listeners
            ['click', 'keydown', 'touchstart'].forEach(evt =>
                document.removeEventListener(evt, enableSound, { capture: true })
            );
        }

        // Listen for ANY user interaction to unlock audio
        ['click', 'keydown', 'touchstart'].forEach(evt =>
            document.addEventListener(evt, enableSound, { capture: true })
        );
    }
});
