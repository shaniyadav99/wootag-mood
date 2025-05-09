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

// Gemini API Key
const GEMINI_API_KEY = 'AIzaSyDk1EqWBvVH3DH4zDB5CYeLZo4dQrmqQ4g';

document.addEventListener('DOMContentLoaded', function() {
    const steps = {
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        step4: document.getElementById('step4'),
        step5: document.getElementById('step5')
    };

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

    let videoStream = null;
    let selectedMood = null;
    let movieLink = '';

    function showStep(stepId) {
        Object.keys(steps).forEach(step => {
            if (step === stepId) {
                steps[step].classList.add('active');
            } else {
                steps[step].classList.remove('active');
            }
        });
    }

    async function initCamera() {
        try {
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

    function captureImage() {
        if (!elements.video.videoWidth) {
            throw new Error('Video not ready yet');
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = elements.video.videoWidth;
        canvas.height = elements.video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(elements.video, 0, 0, canvas.width, canvas.height);
        
        elements.videoSnapshot.srcObject = videoStream;
        elements.videoSnapshot.play().catch(err => console.error('Error playing video snapshot:', err));
        
        return canvas.toDataURL('image/jpeg');
    }

    async function analyzeMoodWithGemini(imageDataUrl) {
        showStep('step3');
        startScanAnimation(elements.scanAnimation2);
        
        try {
            // Extract base64 data from data URL
            const base64Data = imageDataUrl.split(',')[1];
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: "Analyze this image of a person's face and determine their mood. Only respond with one of these exact words: Happy, Sad, Excited, Neutral, Angry. Look for facial expressions like smiling (Happy), frowning (Sad), wide eyes (Excited), neutral expression (Neutral), or tense face (Angry)." },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: base64Data
                                }
                            }
                        ]
                    }]
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to analyze mood');
            }
            
            // Extract the mood from Gemini's response
            const responseText = data.candidates[0].content.parts[0].text;
            const moodMatch = responseText.match(/(Happy|Sad|Excited|Neutral|Angry)/i);
            
            if (moodMatch) {
                return moodMatch[0].charAt(0).toUpperCase() + moodMatch[0].slice(1).toLowerCase();
            } else {
                return 'Neutral'; // Default if no clear mood detected
            }
        } catch (error) {
            console.error('Error analyzing mood with Gemini:', error);
            return 'Neutral'; // Fallback to neutral
        }
    }

    function goToManualSelection() {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
        }
        
        showStep('step4');
        selectedMood = null;
        elements.moodButtons.forEach(btn => btn.classList.remove('selected'));
        elements.confirmMoodBtn.disabled = true;
    }

    function showMovieRecommendation(mood) {
        const movie = movieOptions[mood] || movieOptions.Neutral;
        
        elements.moodText.textContent = mood.toLowerCase();
        elements.movieThumbnail.src = movie.thumbnail;
        elements.movieName.textContent = movie.name;
        movieLink = movie.link;
        
        showStep('step5');
    }

    function startScanAnimation(element) {
        gsap.set(element, { opacity: 1, y: 0 });
        
        gsap.timeline({ repeat: 3 })
            .to(element, { y: '175px', duration: 1.5, ease: 'power1.inOut' })
            .to(element, { y: '0px', duration: 1.5, ease: 'power1.inOut' });
    }

    // Event Listeners
    elements.cameraAccessBtn.addEventListener('click', initCamera);
    
    elements.checkMoodBtn.addEventListener('click', async () => {
        try {
            elements.loadingScreen.style.display = 'flex';
            const imageDataUrl = captureImage();
            
            const mood = await analyzeMoodWithGemini(imageDataUrl);
            
            elements.loadingScreen.style.display = 'none';
            selectedMood = mood;
            showMovieRecommendation(mood);
            
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
            }
        } catch (error) {
            console.error('Error processing image:', error);
            elements.loadingScreen.style.display = 'none';
            selectedMood = 'Neutral';
            showMovieRecommendation('Neutral');
        }
    });
    
    elements.skipToManualBtn.addEventListener('click', goToManualSelection);
    elements.skipToManualBtn2.addEventListener('click', goToManualSelection);
    
    elements.moodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.moodButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedMood = btn.getAttribute('data-mood');
            elements.confirmMoodBtn.disabled = false;
        });
    });
    
    elements.confirmMoodBtn.addEventListener('click', () => {
        if (selectedMood) {
            showMovieRecommendation(selectedMood);
        }
    });
    
    elements.watchNowBtn.addEventListener('click', () => {
        window.open(movieLink, '_blank');
    });
    
    elements.scanAgainBtn.addEventListener('click', () => {
        showStep('step1');
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
        }
    });
});