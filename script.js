const movieOptions = {
    Happy: {
        name: "Welcome",
        link: "https://www.primevideo.com/detail/0MJFLZHIV04F9V9V21RAY2Z8ZZ/",
        thumbnail: "https://m.media-amazon.com/images/S/pv-target-images/af13e1c59556eb143d2b213c9f95567677f409033d4c9619c553367d71bee982._SX1920_FMwebp_.jpg",
    },
    Sad: {
        name: "Call me Bae",
        link: "https://www.primevideo.com/detail/0TF2BODX83KZOWTP08NXFE897E/",
        thumbnail: "https://m.media-amazon.com/images/S/pv-target-images/0cb7ac74d1d6e8eb2e3d59aa5354359714eb54d84fcfaa616d9de19d64b492ca._SX1920_FMwebp_.jpg",
    },
    Excited: {
        name: "Citadel Honey Bunny",
        link: "https://www.primevideo.com/detail/0KYRVT4JDB957NXZO72E2MIFW5",
        thumbnail: "https://m.media-amazon.com/images/S/pv-target-images/51c2c75da778c109ccc33ff293ff48f0cccc60b18c3fef8a42afe2a80e07acac._SX1920_FMwebp_.jpg",
    },
    Neutral: {
        name: "Farzi",
        link: "https://www.primevideo.com/detail/0HDHQAUF5LPWOJRCO025LFJSJI",
        thumbnail: "https://m.media-amazon.com/images/S/pv-target-images/8aed532f0875925f72c4012aab688ed409773ecbfb3b18e1a39cd9ad1a4dd485._SX1920_FMwebp_.jpg",
    },
    Angry: {
        name: "Agneepath",
        link: "https://www.primevideo.com/detail/0NU7IFXPL2WWSDHNGAR5Z1GUJE/",
        thumbnail: "https://images-eu.ssl-images-amazon.com/images/S/pv-target-images/1863426056ae862def9a69ca76e8af54cdb6b8a5a2be1100e096e59b00060847._UX1920_.png",
    }
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all step elements
    const steps = {
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        step4: document.getElementById('step4'),
        step5: document.getElementById('step5')
    };

    // Get interactive elements
    const elements = {
        video: document.getElementById('video'),
        videoSnapshot: document.getElementById('videoSnapshot'),
        cameraAccessBtn: document.getElementById('cameraAccessBtn'),
        checkMoodBtn: document.getElementById('checkMoodBtn'),
        confirmMoodBtn: document.getElementById('confirmMoodBtn'),
        skipToManualBtn: document.getElementById('skipToManualBtn'),
        skipToManualBtn2: document.getElementById('skipToManualBtn2'),
        scanAgainBtn: document.getElementById('scanAgainBtn'),
        watchNowBtn: document.getElementById('watchNowBtn'),
        scanAnimation: document.getElementById('scanAnimation'),
        scanAnimation2: document.getElementById('scanAnimation2'),
        moodButtons: document.querySelectorAll('.mood-btn'),
        movieThumbnail: document.getElementById('movieThumbnail'),
        movieName: document.getElementById('movieName'),
        moodText: document.getElementById('moodText'),
        errorMessage: document.getElementById('errorMessage'),
        loadingScreen: document.getElementById('loadingScreen')
    };

    // State variables
    let videoStream = null;
    let selectedMood = null;
    let movieLink = '';

    // Function to show a specific step and hide others
    function showStep(stepId) {
        // Hide all steps first
        Object.keys(steps).forEach(step => {
            if (step === stepId) {
                steps[step].classList.add('active');
            } else {
                steps[step].classList.remove('active');
            }
        });
    }

    // Initialize camera
    async function initCamera() {
        try {
            // Hide loading screen first in case it's showing
            elements.loadingScreen.style.display = 'none';
            elements.errorMessage.style.display = 'none';
            
            videoStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 240 },
                    height: { ideal: 180 },
                    facingMode: 'user'
                }
            });
            
            elements.video.srcObject = videoStream;
            
            // Wait for video to be ready
            elements.video.onloadedmetadata = function() {
                elements.video.play().catch(err => console.error('Error playing video:', err));
                showStep('step2');
            };
        } catch (error) {
            console.error('Error accessing camera:', error);
            elements.errorMessage.style.display = 'block';
            elements.errorMessage.textContent = 'Camera access denied. Please try manual selection.';
            setTimeout(() => {
                goToManualSelection();
            }, 2000);
        }
    }

    // Capture image from video
    function captureImage() {
        if (!elements.video.videoWidth) {
            throw new Error('Video not ready yet');
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = elements.video.videoWidth;
        canvas.height = elements.video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        // Flip horizontally to correct mirror effect
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        
        ctx.drawImage(elements.video, 0, 0, canvas.width, canvas.height);
        
        // Create a clone of the video for display in step 3
        elements.videoSnapshot.srcObject = videoStream;
        elements.videoSnapshot.play().catch(err => console.error('Error playing video snapshot:', err));
        
        return canvas.toDataURL('image/jpeg');
    }

    // Analyze mood using OpenAI API
    async function analyzeMood(imageDataUrl) {
        showStep('step3');
        
        // Start scan animation
        startScanAnimation(elements.scanAnimation2);
        
        try {
            // For demonstration purposes, we'll use the simulateMoodDetection
            // since we don't have a valid OpenAI API key
            console.log('Using simulated mood detection instead of OpenAI API');
            const mood = await simulateMoodDetection();
            return mood;
            
        } catch (error) {
            console.error('Error analyzing mood:', error);
            return 'Neutral'; // Default to neutral on error
        }
    }

    // Function to simulate OpenAI API call for testing
    async function simulateMoodDetection() {
        // For testing without actual API call
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds delay
        const moods = ['Happy', 'Excited', 'Neutral', 'Angry', 'Sad'];
        return moods[Math.floor(Math.random() * moods.length)];
    }

    // Go to manual selection
    function goToManualSelection() {
        // Stop camera stream if it exists
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
        }
        
        showStep('step4');
        
        // Reset selected mood
        selectedMood = null;
        elements.moodButtons.forEach(btn => btn.classList.remove('selected'));
        elements.confirmMoodBtn.disabled = true;
    }

    // Show movie recommendation
    function showMovieRecommendation(mood) {
        const movie = movieOptions[mood] || movieOptions.Neutral;
        
        elements.moodText.textContent = mood.toLowerCase();
        elements.movieThumbnail.src = movie.thumbnail;
        elements.movieName.textContent = movie.name;
        movieLink = movie.link;
        
        showStep('step5');
    }

    // Start scanning animation
    function startScanAnimation(element) {
        gsap.set(element, { opacity: 1, y: 0 });
        
        gsap.timeline({ repeat: 3 })
            .to(element, { y: '175px', duration: 1.5, ease: 'power1.inOut' })
            .to(element, { y: '0px', duration: 1.5, ease: 'power1.inOut' });
    }

    // Event: Camera access button click
    elements.cameraAccessBtn.addEventListener('click', initCamera);
    
    // Event: Check mood button click
    elements.checkMoodBtn.addEventListener('click', async () => {
        try {
            elements.loadingScreen.style.display = 'flex';
            const imageDataUrl = captureImage();
            
            // For testing, you can use simulateMoodDetection instead
            // const mood = await simulateMoodDetection();
            
            // For actual API use:
            const mood = await analyzeMood(imageDataUrl);
            
            elements.loadingScreen.style.display = 'none';
            selectedMood = mood;
            showMovieRecommendation(mood);
            
            // Stop the camera stream after detection
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
            }
        } catch (error) {
            console.error('Error processing image:', error);
            elements.loadingScreen.style.display = 'none';
            selectedMood = 'Neutral'; // Default fallback
            showMovieRecommendation('Neutral');
        }
    });
    
    // Event: Skip to manual selection button clicks
    elements.skipToManualBtn.addEventListener('click', goToManualSelection);
    elements.skipToManualBtn2.addEventListener('click', goToManualSelection);
    
    // Event: Mood button clicks
    elements.moodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.moodButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedMood = btn.getAttribute('data-mood');
            elements.confirmMoodBtn.disabled = false;
        });
    });
    
    // Event: Confirm mood button click
    elements.confirmMoodBtn.addEventListener('click', () => {
        if (selectedMood) {
            showMovieRecommendation(selectedMood);
        }
    });
    
    // Event: Watch now button click
    elements.watchNowBtn.addEventListener('click', () => {
        window.open(movieLink, '_blank');
    });
    
    // Event: Scan again button click
    elements.scanAgainBtn.addEventListener('click', () => {
        showStep('step1');
    });

    // Handle visibility changes (for when ad is in iframe or tab is not active)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
        }
    });
});