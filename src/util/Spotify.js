const clientID = "f71af98093274b9ba82f42c45fceb16c";
// const redirectURI = "http://nick-jammming.surge.sh";
const redirectURI = "http://localhost:3000/";
let accessToken;
const Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }
        const url = window.location.href;
        const tokenMatch = url.match(/access_token=([^&]*)/);
        const expirationMatch = url.match(/expires_in=([^&]*)/);
        if(tokenMatch && expirationMatch){
            accessToken = tokenMatch[1];
            const expirationTime = Number(expirationMatch[1]);

            window.setTimeout(() => accessToken = '', expirationTime * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        }
        else{
            window.location = "https://accounts.spotify.com/authorize?client_id=" + clientID + "&response_type=token&scope=playlist-modify-public&redirect_uri=" + redirectURI;
        }
    },
    search(searchTerm){
        console.log('SEARCHING');
        const accessToken = Spotify.getAccessToken();
        console.log('Access Token: ' + accessToken);
        return fetch("https://api.spotify.com/v1/search?type=track&q=" + searchTerm, {
            headers: { 
                Authorization: 'Bearer ' + accessToken
            }
        })
        .then(response => {
            if(response.ok){
                return response.json();
            }
        }).then(jsonResponse => {
            if(!jsonResponse.tracks){
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id, 
                name: track.name, 
                artist: track.artists[0].name, 
                album: track.album.name,
                uri: track.uri,
                preview: track.preview_url
            }));
        });
    },
    savePlaylist(playlistName, uriArray){
        if(!playlistName || !uriArray.length){
            return;
        }
        accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const endpoint = 'https://api.spotify.com/v1/me';
        let userID = '';
        return fetch(endpoint, {headers: headers})
        .then(response => response.json())
        .then(jsonResponse => {
            userID = jsonResponse.id;
        })
        .then(() => {
            const body = JSON.stringify({name: playlistName});
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: 'POST',
                headers: headers,
                body: body
            })
            .then(response => response.json())
            .then(jsonResponse => {
                let playlistID = jsonResponse.id;
                const trackBody = JSON.stringify({uris: uriArray});
                return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                    method: 'POST',
                    headers: headers,
                    body: trackBody
                })
                .then(response => response.json())
                .then(jsonResponse => {
                    playlistID = jsonResponse.id;
                });
            });
        });
    }
};

export {Spotify};