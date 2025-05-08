# Mood-Based Movie Recommendation

A dynamic web application that recommends Prime Video movies based on user's mood, either detected through facial expression analysis or manual selection.

![Prime Video Mood Detection](https://m.media-amazon.com/images/S/pv-target-images/af13e1c59556eb143d2b213c9f95567677f409033d4c9619c553367d71bee982._SX1920_FMwebp_.jpg)

## Features

- 📸 Real-time facial expression capture using device camera
- 🎭 Mood detection through facial analysis
- 👆 Manual mood selection option
- 🎬 Personalized movie recommendations
- ✨ Smooth animations and transitions
- 📱 Mobile-responsive design

## Technologies Used

- **HTML5**: Structure and content
- **CSS3**: Styling and animations
  - Custom animations for scanning effect
  - Responsive design with flexbox
  - Gradient backgrounds
- **JavaScript**: Core functionality
  - Camera API integration
  - Mood analysis
  - Dynamic content updates
- **GSAP**: Advanced animations
- **jQuery**: DOM manipulation and event handling

## How It Works

1. **Initial Screen**
   - Users are presented with two options:
     - Scan mood using camera
     - Manual mood selection

2. **Camera-Based Mood Detection**
   - Requests camera access
   - Captures user's facial expression
   - Analyzes expression to determine mood
   - Shows scanning animation during analysis

3. **Manual Mood Selection**
   - Users can choose from five moods:
     - Happy 😊
     - Excited 🤩
     - Neutral 😐
     - Sad 😢
     - Angry 😠

4. **Movie Recommendation**
   - Based on detected/selected mood
   - Displays movie thumbnail and title
   - Provides direct link to watch on Prime Video

## Mood-Movie Mapping

- **Happy** → "Welcome"
- **Sad** → "Call me Bae"
- **Excited** → "Citadel Honey Bunny"
- **Neutral** → "Farzi"
- **Angry** → "Agneepath"

## Setup and Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/shaniyadav99/wootag-mood.git
   ```

2. Open `index.html` in a modern web browser

3. Allow camera access for mood detection feature

## Technical Details

### Camera Integration
- Uses `navigator.mediaDevices.getUserMedia` for camera access
- Implements error handling for denied camera access
- Provides fallback to manual selection

### Animation System
- GSAP Timeline for scanning animation
- CSS keyframes for loading spinner
- Smooth transitions between steps

### Error Handling
- Camera access fallback
- Mood detection error management
- Default to "Neutral" mood on failures

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Project Structure

```
wootag-mood/
├── index.html      # Main application file
├── README.md       # Project documentation
└── .gitignore     # Git ignore file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Prime Video for movie data
- GSAP for animation library
- jQuery team for their excellent library