const quizQuestions = [
  {
    "question": "What is the primary function of ExifTool in digital forensics and OSINT?",
    "options": [
      "Reading, writing, and manipulating EXIF, IPTC, XMP, and other metadata across media files",
      "Cracking password-protected ZIP and RAR archives",
      "Recovering deleted disk partitions from damaged hard drives",
      "Streaming live video feeds from remote IP cameras"
    ],
    "correctAnswerIndex": 0,
    "explanation": "ExifTool is a command-line tool for reading, writing, and editing metadata across numerous image, video, and document file formats.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which command displays all metadata tags from an image named `evidence.jpg`?",
    "options": [
      "exiftool evidence.jpg",
      "exiftool -read evidence.jpg",
      "exiftool --dump-all evidence.jpg",
      "exiftool show evidence.jpg"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Running `exiftool evidence.jpg` parses and outputs all embedded metadata tags from the specified file.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "Which metadata fields in an image provide the exact geographic coordinates of where a photo was taken?",
    "options": [
      "GPS Latitude and GPS Longitude",
      "Camera Focal Length and ISO Speed",
      "Image Width and Image Height",
      "Color Space and Compression Ratio"
    ],
    "correctAnswerIndex": 0,
    "explanation": "GPS Latitude and GPS Longitude tags store the coordinates recorded by the camera or smartphone when the photo was captured.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "How can camera serial numbers extracted by ExifTool aid in attribution?",
    "options": [
      "By linking photos published on different anonymous accounts to the exact same physical camera hardware",
      "By automatically revealing the photographer's bank details",
      "By decrypting the photographer's home Wi-Fi network password",
      "By disabling the camera hardware remotely"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Unique camera serial numbers and internal lens IDs embedded in EXIF data can establish that multiple images originated from the same device.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An investigator wants to sanitize all metadata from `photo.jpg` before sharing it publicly. Which command is used?",
    "options": [
      "exiftool -all= photo.jpg",
      "exiftool --delete photo.jpg",
      "exiftool -clean photo.jpg",
      "exiftool -remove-metadata photo.jpg"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The command `exiftool -all= photo.jpg` wipes all embedded metadata tags from the target image file.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
