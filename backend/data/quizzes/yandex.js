const quizQuestions = [
  {
    "question": "Why is Yandex widely recognized as one of the most powerful search engines for visual OSINT?",
    "options": [
      "Its reverse image search and facial recognition algorithms excel at matching faces and specific visual features",
      "It allows users to alter satellite orbit paths",
      "It automatically removes watermarks from copyrighted images",
      "It converts low-resolution images into 4K video files"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Yandex Images features advanced facial matching algorithms capable of finding identical or similar individuals across web platforms.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "In which geographic region and language space does Yandex offer superior web indexing?",
    "options": [
      "Russia, Eastern Europe, Central Asia, and Cyrillic script content",
      "Latin America and Spanish language forums exclusively",
      "East Asia and Japanese academic portals only",
      "Sub-Saharan Africa and local dialect publications"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Yandex has deep indexing coverage across Eastern European, Russian, and Central Asian domains and Cyrillic language content.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "How does an analyst utilize Yandex Reverse Image Search to identify an unknown subject from a photo?",
    "options": [
      "By uploading a cropped image of the subject's face to find matching social profiles on VK, forums, and blogs",
      "By sending the photo to Yandex customer support via email",
      "By extracting the camera's IP address from the image pixels",
      "By decrypting the image file with a private key"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Uploading a cropped face or landmark to Yandex Images matches visual facial features against indexed social media and websites.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "Which search operator in Yandex restricts search results to a specific host or domain?",
    "options": [
      "site: or host:",
      "domain_only:",
      "url_match:",
      "filter_site="
    ],
    "correctAnswerIndex": 0,
    "explanation": "Yandex supports `site:` and `host:` operators to limit search results to specific domains.",
    "difficulty": "Beginner",
    "order": 4
  },
  {
    "question": "An investigator uploads a photo of an unidentified suspect from a CCTV clip to Yandex Images and finds an exact match on VKontakte. Why was Yandex effective?",
    "options": [
      "Yandex's facial recognition algorithm matches facial geometry across millions of indexed social media profile pictures",
      "Yandex had access to the CCTV camera's internal memory",
      "The suspect's name was secretly encoded in the CCTV filename",
      "VKontakte automatically publishes all user passwords to search engines"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Yandex excels at facial feature comparison, matching distinct facial landmarks to public photos hosted across social platforms like VK.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
