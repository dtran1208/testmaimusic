const chatGPT_API_KEY = "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";
const SPOTIFY_API_KEY = "your_spotify_api_key";

async function fetchChatGPTResponse(prompt) {
    const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chatGPT_API_KEY}`
        },
        body: JSON.stringify({
            prompt: `Create a playlist for someone feeling ${prompt}`,
            max_tokens: 100,
            n: 1,
            stop: null,
            temperature: 0.5,
        }),
    });

    const data = await response.json();
    return data.choices[0].text.trim();
}

async function fetchSpotifyPlaylist(playlistName) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(playlistName)}&type=playlist&limit=1`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SPOTIFY_API_KEY}`
        },
    });

    const data = await response.json();
    return data.playlists.items[0];
}

const form = document.getElementById("chat-form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.getElementById("message").value;
    const playlistName = await fetchChatGPTResponse(message);
    const playlist = await fetchSpotifyPlaylist(playlistName);
    document.getElementById("playlist").innerHTML = `
        <h2>${playlist.name}</h2>
        <iframe src="https://open.spotify.com/embed/playlist/${playlist.id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    `;
});
