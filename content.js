console.log("Extension active on YouTube search results page.");
window.playlist = new Map();

const observer = new MutationObserver(() => {
    const targetElement = document.querySelector("#primary > ytd-section-list-renderer");

    if (targetElement) {
        console.log("Target element loaded:", targetElement);

        observer.disconnect();
        observeSectionListRenderer(targetElement);
    }
});

observer.observe(document.body, { childList: true, subtree: true });

function observeSectionListRenderer(targetNode) {
    let debounceTimeout;

    const observer = new MutationObserver(() => {
        if (debounceTimeout) return;

        debounceTimeout = setTimeout(() => {
            debounceTimeout = null;
        }, 3000);

        getPlaylist();
    });

    observer.observe(targetNode, { childList: true, subtree: true });
}

function getPlaylist() {
    const searchElements = document.getElementsByTagName("ytd-search");
    if (!searchElements.length) return;
    const playlistElements = searchElements[0].getElementsByTagName("yt-lockup-view-model");

    var Playlist = Array.from(playlistElements).map(el => {

        return {
            id: extractPlaylistId(el.querySelector('a').href),
            element: el
        };
    })
    // .filter(Boolean);
    const chunks = chunkArray(Playlist, 50);
    chunks.forEach(chunk => addTime(chunk));
}

function addTime(chunk) {
    chunk.forEach(async item => {
        var formattedTime;
        if (window.playlist.has(item.id))
            formattedTime = window.playlist.get(item.id);
        else {
            const result = await fetchPlaylistTime(item.id);
            if (result) {
                formattedTime = formatTime(result.time);
                window.playlist.set(item.id, formattedTime);
            }
        }
        if (!formattedTime) return;
        const badge = item.element.querySelector("badge-shape");
        badge?.querySelector("div.badge-shape-wiz__icon")?.remove();
        const textElement = badge?.querySelector("div.badge-shape-wiz__text");
        if (textElement) textElement.innerHTML = `${formattedTime} | ${textElement.innerHTML.split('|').slice(-1)[0].trim()}`;
    });
}

function extractPlaylistId(url) {
    const patterns = [
        /[?&]list=([^&]+)/,
        /youtu\.be\/([^?]+)/,
        /youtube\.com\/playlist\?.*list=([^&]+)/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

async function fetchPlaylistTime(playlistId) {
    try {
        const data = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    type: "fetchPlaylistTime",
                    playlistId: playlistId,
                },
                (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                        return;
                    }

                    if (response && response.success) {
                        resolve(response.data);
                    } else {
                        reject(new Error(response ? response.error : "Unknown error occurred"));
                    }
                }
            );
        });
        const description = getDescription(data);
        if (description && description['Total length']) {
            return { id: playlistId, time: formatToTime(description['Total length']) };
        }
    } catch (error) {
        console.log("Error fetching playlist time:", error);

    }
    return null;
}

function formatToTime(duration) {
    const match = duration.match(/((\d+)\s*days?,?)?(\s*(\d+)\s*hours?,?)?(\s*(\d+)\s*minutes?,?)?(\s*(\d+)\s*seconds?)/);
    return {
        days: match[2] ? parseInt(match[2]) : 0,
        hours: match[4] ? parseInt(match[4]) : 0,
        minutes: match[6] ? parseInt(match[6]) : 0,
        seconds: match[8] ? parseInt(match[8]) : 0
    };
}

function formatTime(time) {
    const { days, hours, minutes, seconds } = time;
    return days > 0
        ? `${days}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : hours > 0
            ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getDescription(text) {
    const regex = /<p class="description">(.+?)<\/p>/g;
    let match, jsonText = '{';
    while ((match = regex.exec(text)) !== null) {
        const [key, value] = match[1].split(':').map(s => s.trim());
        if (key && value) jsonText += `"${key}":"${value}",`;
    }
    jsonText = jsonText.slice(0, -1) + '}';
    console.log("Description:", jsonText);
    try {
        return JSON.parse(jsonText);
    } catch (error) {
        console.log('Error parsing description:', error);
        return null;
    }
}