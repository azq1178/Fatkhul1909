const textToType = "Terima kasih atas dedikasi dan bimbingan yang telah Bapak/ibu guru Yayasan Hadziqiyyah berikan. Mohon maaf atas angkatan generasi kami yang kurang dari kata mengesankan daripada generasi dahulu. ~respect~ •Orang tua kami mungkin merawat jasad kami, tetapi guru kami merawat ruh kami•";
const typedOutputElement = document.getElementById('typed-output');
let typeTextIndex = 0;
const typingSpeed = 50; // milliseconds per character
let typingTimeout; // To store the timeout ID for clearing

function typeWriter() {
    if (typeTextIndex < textToType.length) {
        // Clear the previous content before appending the next character
        // This ensures a clean "typing" effect instead of just adding to existing text
        typedOutputElement.innerHTML = textToType.substring(0, typeTextIndex + 1);
        typeTextIndex++;
        typingTimeout = setTimeout(typeWriter, typingSpeed);
    }
}

function resetTyping() {
    clearTimeout(typingTimeout); // Stop any ongoing typing
    typedOutputElement.innerHTML = ''; // Clear the text
    typeTextIndex = 0; // Reset the index
}

document.addEventListener('DOMContentLoaded', () => {
    const btnTextMode = document.getElementById('btn-text-mode');
    const btnVideoMode = document.getElementById('btn-video-mode');
    const btnPhotoMode = document.getElementById('btn-photo-mode');
    const btnMoreMode = document.getElementById('btn-more-mode');

    const textContent = document.getElementById('text-content');
    const videoContent = document.getElementById('video-content');
    const photoContent = document.getElementById('photo-content');
    const audioContent = document.getElementById('audio-content');

    const allVideos = document.querySelectorAll('#video-content video');
    const allAudios = document.querySelectorAll('#audio-content audio');

    const confettiButton = document.getElementById('confetti-button');

    // Function to show/hide content sections
    const showMode = (mode) => {
        // Hide all sections first
        textContent.style.display = 'none';
        videoContent.style.display = 'none';
        photoContent.style.display = 'none';
        audioContent.style.display = 'none';

        // Deactivate all buttons
        btnTextMode.classList.remove('active');
        btnVideoMode.classList.remove('active');
        btnPhotoMode.classList.remove('active');
        btnMoreMode.classList.remove('active');

        // Stop all videos and reset when switching away from video mode OR when a new video starts playing
        allVideos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });

        // Stop all audios and reset when switching away from audio mode
        allAudios.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
            // Remove the 'playing' class from the parent button
            const parentButton = audio.closest('.audio-player-button');
            if (parentButton) {
                parentButton.classList.remove('playing');
            }
        });

        // Reset and stop typing when switching away from text mode
        if (mode !== 'text') {
            resetTyping();
        }

        if (mode === 'text') {
            textContent.style.display = 'flex';
            btnTextMode.classList.add('active');
            typeWriter();
        } else if (mode === 'video') {
            videoContent.style.display = 'flex';
            btnVideoMode.classList.add('active');
            // No automatic playing here; let the user click to play
        } else if (mode === 'photo') {
            photoContent.style.display = 'flex';
            btnPhotoMode.classList.add('active');
        } else if (mode === 'more') {
            audioContent.style.display = 'flex';
            btnMoreMode.classList.add('active');
        }
    };

    // Add event listeners to all video elements to pause others when one plays
    allVideos.forEach(video => {
        video.addEventListener('play', () => {
            allVideos.forEach(otherVideo => {
                if (otherVideo !== video && !otherVideo.paused) {
                    otherVideo.pause();
                }
            });
        });
    });


    // Confetti function remains the same
    const createConfettiExplosion = (x, y) => {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
        const numberOfConfetti = 200;

        for (let i = 0; i < numberOfConfetti; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            confetti.style.left = `${x}px`;
            confetti.style.top = `${y}px`;

            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 250 + 150;
            const velocityX = speed * Math.cos(angle);
            const velocityY = speed * Math.sin(angle) - Math.random() * 100;

            confetti.style.setProperty('--x', velocityX);
            confetti.style.setProperty('--y', velocityY);

            const size = Math.random() * 8 + 4;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;

            const rotation = Math.random() * 720;
            const fadeOutTime = Math.random() * 0.8 + 1.0;

            confetti.style.animation = `confetti-explosion ${fadeOutTime}s forwards`;
            confetti.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

            document.body.appendChild(confetti);

            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }

        if (!document.getElementById('confetti-explosion-animation')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = "confetti-explosion-animation";
            styleSheet.type = "text/css";
            styleSheet.innerText = `
                @keyframes confetti-explosion {
                    0% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1) rotate(0deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(calc(var(--x) * 1px - 50%), calc(var(--y) * 1px - 50% + 200px)) scale(1.2) rotate(720deg);
                    }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    };

    confettiButton.addEventListener('click', (event) => {
        const rect = confettiButton.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        createConfettiExplosion(x, y);
    });

    // Event listeners for audio player buttons
    document.querySelectorAll('.audio-player-button').forEach(button => {
        const audio = button.querySelector('audio');
        let isPlaying = false;

        button.addEventListener('click', () => {
            // Pause all other audios before playing the current one
            allAudios.forEach(otherAudio => {
                if (otherAudio !== audio && !otherAudio.paused) {
                    otherAudio.pause();
                    const otherButton = otherAudio.closest('.audio-player-button');
                    if (otherButton) {
                        otherButton.classList.remove('playing');
                    }
                }
            });

            if (isPlaying) {
                audio.pause();
                button.classList.remove('playing');
            } else {
                audio.play().catch(error => {
                    console.log('Autoplay prevented for audio:', error);
                    // You might want to show a message to the user here
                });
                button.classList.add('playing');
            }
            isPlaying = !isPlaying;
        });

        // Reset button state when audio ends
        audio.addEventListener('ended', () => {
            isPlaying = false;
            button.classList.remove('playing');
            audio.currentTime = 0; // Reset to start
        });

        // Handle manual pause from controls (if they become visible for any reason)
        audio.addEventListener('pause', () => {
            isPlaying = false;
            button.classList.remove('playing');
        });
    });

    // Set initial mode
    showMode('text');

    // Trigger confetti explosion once after the page loads
    // Using a small timeout to ensure all elements are rendered and positioned
    setTimeout(() => {
        if (confettiButton) {
            confettiButton.click();
        }
    }, 100); // 100ms delay to allow full rendering

    // Add event listeners to mode buttons
    btnTextMode.addEventListener('click', () => showMode('text'));
    btnVideoMode.addEventListener('click', () => showMode('video'));
    btnPhotoMode.addEventListener('click', () => showMode('photo'));
    btnMoreMode.addEventListener('click', () => showMode('more'));
});
