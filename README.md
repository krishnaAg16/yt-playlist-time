# yt-playlist-time

A Chrome extension that enhances the YouTube search experience by displaying the **total duration of playlists** directly in search results.

---

## Overview
`yt-playlist-time` dynamically fetches and displays the total runtime for YouTube playlists within the search results page.  
It integrates seamlessly with the YouTube UI, saving users the hassle of opening playlists to check their length.

---

## Features
- **Inline Playlist Duration** – See total time for playlists right in the search results.
- **Real-Time Updates** – Uses a `MutationObserver` to detect changes in YouTube's dynamic search results.
- **Optimized Performance** – Background script fetches playlist durations asynchronously via Chrome Runtime API.
- **Smart Request Handling** – Debouncing mechanism to reduce unnecessary API calls during rapid DOM updates.
- **Resilient Design** – Robust error handling to gracefully manage network issues and provide user feedback.

---

## 🛠 Technology Stack
- **JavaScript (ES6+)**
- **Chrome Extensions API**
- **MutationObserver API**
- **External Playlist Duration API** (for fetching data)

---

## Project Structure

YT-Playlist-Time/
│
├── manifest.json 
├── background.js 
├── content.js 
└── README.md

## Installation
1. **Clone this repository**:
   ```bash
   git clone [https://github.com/krishnaAg16/yt-playlist-time.git](https://github.com/krishnaAg16/yt-playlist-time)
2. **Open Chrome Extensions page**:
   -  Navigate to chrome://extensions/
   -  Enable Developer mode (toggle in top right corner)
3. **Load Unpacked Extension**:
   -  Click "Load unpacked"
   -  Select the cloned YT-Playlist-Time folder
4. **The extension will now be active in your browser**.

## Screenshot
<img width="1895" height="949" alt="image" src="https://github.com/user-attachments/assets/f64f3e07-2815-47b5-baf7-be9e98b57e47" />

