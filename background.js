chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "fetchPlaylistTime") {
        const formdata = new FormData();
        formdata.append("search_string", message.playlistId);
        formdata.append("range_start", "");
        formdata.append("range_end", "");
        formdata.append("custom_speed", "");
        formdata.append("youtube_api", "");

        fetch("https://ytplaylist-len.sharats.dev/", {
            method: "POST",
            body: formdata,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch playlist data");
                }
                return response.text();
            })
            .then((data) => {
                sendResponse({ success: true, data });
            })
            .catch((error) => {
                console.error("Error in fetch:", error);
                sendResponse({ success: false, error: error.message });
            });

        return true;
    }
});


