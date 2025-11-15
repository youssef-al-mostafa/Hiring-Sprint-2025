# Vehicle Damage Inspector

[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-3.29-319795.svg)](https://chakra-ui.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF.svg)](https://vitejs.dev/)

A modern, AI-powered web application for automated vehicle damage detection and inspection comparison. Built to streamline vehicle inspection workflows by identifying new damage between pickup and return inspections using computer vision.

## Features

-  **AI-Powered Detection**: Automated damage identification using Roboflow's computer vision API
- **Comparative Analysis**: Side-by-side comparison of pickup vs. return condition
- **Drag & Drop Upload**: Intuitive image upload with live preview
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Real-time Processing**: Concurrent API calls for fast analysis results
- **Modern UI**: Clean interface built with Chakra UI and Framer Motion

## Demo

### Sample Analysis

<table>
  <tr>
    <td align="center">
      <b>Pickup Inspection</b><br>
      <img src="/public/demo-car-before.jpg" alt="Pickup Inspection" width="400"/>
    </td>
    <td align="center">
      <b>Return Inspection</b><br>
      <img src="/public/demo-car-after.jpg" alt="Return Inspection" width="400"/>
    </td>
  </tr>
</table>

### Analysis Results

<p align="center">
  <img src="/public/result.png" alt="Analysis Results Screenshot" width="800"/>
</p>

<p align="center">
  <i>The application automatically detects and highlights new damage (shown in red) that wasn't present during pickup inspection. Each detection includes damage type classification and confidence score.</i>
</p>

## Technologies Used

- **Frontend Framework**: React 19.2 with Hooks
- **Type Safety**: TypeScript 5.9
- **UI Library**: Chakra UI 3.29 with Emotion
- **Build Tool**: Vite 7.2
- **HTTP Client**: Axios 1.13
- **Computer Vision**: Roboflow API
- **Icons**: React Icons 5.5

## Prerequisites

- Node.js (>= 18.x)
- npm or yarn
- Roboflow API Key (Get one free at [Roboflow](https://roboflow.com/))

## Getting Started

### Installation

1. Clone the repository
```bash
https://github.com/youssef-al-mostafa/Hiring-Sprint-2025/
cd vehicle-inspector
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Add your Roboflow API credentials to `.env`
```env
VITE_ROBOFLOW_API_KEY=your_api_key_here
VITE_ROBOFLOW_MODEL=car-damage-detection-ha5mm
VITE_ROBOFLOW_VERSION=3
```

5. Start the development server
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Project Structure

```
vehicle-inspector/
├── public/              # Static assets
│   └── vite.svg
├── src/                 # Source files
│   ├── assets/          # Images and static files
│   │   └── react.svg
│   ├── components/      # React components
│   │   ├── AnnotatedImage.tsx      # Canvas-based damage visualization
│   │   ├── ImageUpload.tsx         # Drag-and-drop file upload
│   │   └── ui/
│   │       └── provider.tsx        # Chakra UI theme provider
│   ├── services/        # API services
│   │   └── roboflow.ts             # Roboflow API integration
│   ├── types/           # TypeScript interfaces
│   │   └── roboflow.ts             # API response types
│   ├── App.tsx          # Root component
│   ├── main.tsx         # Application entry point
│   ├── theme.ts         # Chakra UI theme configuration
│   └── index.css        # Global styles
├── .env.example         # Environment variables template
├── .gitignore          
├── eslint.config.js    
├── index.html         
├── vite.config.ts      
├── tsconfig.json       
└── package.json        
```

##  Key Highlights

- **Advanced Computer Vision**: Integration with Roboflow's state-of-the-art damage detection model
- **Smart Matching Algorithm**: Spatial proximity-based algorithm to identify new damage between inspections
- **Type-Safe Development**: Full TypeScript integration for better developer experience and fewer runtime errors
- **Canvas Rendering**: Optimized damage annotations drawn directly on HTML canvas for high performance
- **Component Composition**: Modular component design following React best practices
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Memory Management**: Proper cleanup of object URLs and event listeners

##  Features in Detail

### Damage Detection
- Upload vehicle images from pickup and return inspections
- Automatic damage detection with bounding box visualization
- Confidence scores for each detected damage
- Classification by damage type (dent, scratch, crack, etc.)

### Comparative Analysis
- Side-by-side comparison of inspection images
- Automatic identification of new damage
- Color-coded annotations (blue for existing, red for new)
- Statistical summary with damage counts

### User Experience
- Intuitive drag-and-drop interface
- Image preview before analysis
- Loading states with spinners during processing
- Success/error alerts for user feedback
- One-click reset to start new analysis

### Visual Interface
- Clean, professional design optimized for inspection workflows
- Responsive grid layout adapting to screen size
- Smooth animations and transitions
- Accessibility-focused UI components

##  How It Works

### Damage Detection Algorithm

The application uses a spatial proximity algorithm to identify new damage:

```typescript
// Threshold for considering damage as "same location"
const POSITION_THRESHOLD = 50; // pixels

// Filter return damages that don't exist in pickup
newDamage = returnDamages.filter(returnDamage => 
  !pickupDamages.some(pickupDamage =>
    // Check if damage is within position threshold
    Math.abs(pickupDamage.x - returnDamage.x) < POSITION_THRESHOLD &&
    Math.abs(pickupDamage.y - returnDamage.y) < POSITION_THRESHOLD &&
    // Ensure damage types match
    pickupDamage.class === returnDamage.class
  )
);
```

### API Integration Flow

1. **Image Upload**: User uploads pickup and return inspection images
2. **Base64 Encoding**: Images are converted to base64 format
3. **Parallel Processing**: Both images sent to Roboflow API simultaneously
4. **Damage Detection**: API returns bounding boxes and classifications
5. **Comparison**: Algorithm identifies new damage based on spatial proximity
6. **Visualization**: Results displayed with annotated images and statistics

##  Security

- API keys stored in environment variables (never committed to repository)
- `.env` file excluded from version control
- Client-side validation for image file types
- Type-safe API responses with proper error handling

## Limitations & Future Enhancements

### Current Limitations
- Image size constraints based on Roboflow API limits
- Simple spatial matching may not handle all edge cases
- Detection accuracy depends on model training data
- No image preprocessing or normalization

## Troubleshooting

### Common Issues

**"Roboflow API key not configured"**
- Ensure `.env` file exists in project root
- Verify `VITE_ROBOFLOW_API_KEY` is set correctly
- Restart development server after `.env` changes

**Images not displaying**
- Check file format (PNG, JPG, JPEG only)
- Verify file size is within browser limits
- Check browser console for detailed errors

**Slow or failed detection**
- Large images take longer to process
- Check network connection
- Verify Roboflow API status
- Consider compressing images before upload

**Inaccurate damage detection**
- Ensure proper lighting in photos
- Take photos from consistent angles
- Verify damage type is supported by model
- Adjust `POSITION_THRESHOLD` if needed (currently 50px)

## Acknowledgements

- [Roboflow](https://roboflow.com/) - Computer vision API and model hosting
- [Chakra UI](https://chakra-ui.com/) - UI component library
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## Contact

Youssef Al Mostafa - [LinkedIn](https://www.linkedin.com/in/youssef-al-mostafa/)
- [youssefalmostafa2@gmail.com](mailto:youssefalmostafa2@gmail.com)