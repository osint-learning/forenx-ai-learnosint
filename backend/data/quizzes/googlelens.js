const quizQuestions = [
  {
    "question": "What is the primary capability of Google Lens in visual OSINT investigations?",
    "options": [
      "Visual search, landmark recognition, object identification, and text extraction from images",
      "Editing video framerates and applying cinematic filters",
      "3D rendering of architectural blueprints",
      "Generating synthetic deepfake video clips"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Google Lens performs reverse visual search, identifying landmarks, objects, logos, and extracting text from images.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "How does Google Lens assist an investigator in geolocation analysis?",
    "options": [
      "By matching background architectural features, monuments, and terrain to indexed global photos",
      "By reading the camera sensor's physical temperature",
      "By estimating the exact altitude of passing satellites",
      "By hacking nearby Wi-Fi routers shown in the image"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Google Lens matches visual landmarks, distinctive building facades, and geographical scenery against its massive image database.",
    "difficulty": "Intermediate",
    "order": 2
  },
  {
    "question": "What feature in Google Lens enables an analyst to extract printed text or serial numbers from a photo?",
    "options": [
      "Optical Character Recognition (OCR)",
      "Facial Recognition Synthesis",
      "EXIF Timestamp Extraction",
      "Steganographic Decoding"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Google Lens uses Optical Character Recognition (OCR) to detect, select, and copy text appearing inside images.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "When analyzing a photo of an unknown brand logo or garment, how is Google Lens applied?",
    "options": [
      "By cropping the bounding box directly over the logo to find identical commercial products and manufacturers",
      "By converting the image into an audio spectrogram",
      "By increasing the image resolution beyond physical sensor limits",
      "By submitting the image to WHOIS domain registries"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Cropping the search region onto the unknown logo or item helps isolate the feature and match it against commercial and web sources.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An investigator crops a unique church tower in a background image and Google Lens matches it to a specific church in Verona, Italy. What technique was demonstrated?",
    "options": [
      "Visual landmark geolocation",
      "DNS zone transfer",
      "Email header tracing",
      "BGP routing analysis"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Matching architectural landmarks in background imagery to discover the physical location is visual landmark geolocation.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
