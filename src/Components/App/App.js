// import logo from './logo.svg';
import './App.css';
import React from 'react';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import {Spotify} from '../../util/Spotify';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = { 
      searchResults: [], 
      playlistName: 'test playlist', 
      playlistTracks: [],
      audio: undefined
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.playPreview = this.playPreview.bind(this);
  }
  addTrack(track){
    const playlistTracks = this.state.playlistTracks;
    if(playlistTracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }
    playlistTracks.push(track);

    const searchResults = this.state.searchResults;
    const filteredResults = searchResults.filter(track => {
      for(const playlistTrack of playlistTracks){
        // console.log(playlistTrack);
        // console.log("Playlist ID: " + playlistTrack.id);
        // console.log("Search ID: " + track.id);
        if(playlistTrack.id === track.id){
          return false;
        }
      }
      return true;
    });
    this.setState({playlistTracks: playlistTracks, searchResults: filteredResults});
  }
  removeTrack(track){
    const playlistTracks = this.state.playlistTracks;
    const filtered = playlistTracks.filter(savedTrack => savedTrack.id !== track.id);

    this.setState({playlistTracks: filtered});
  }
  updatePlaylistName(name){
    this.setState({playlistName: name});
  }
  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    .then(() => {
      this.setState({playlistName: 'New Playlist', playlistTracks: []});
    });
  }
  search(searchTerm){
    console.log('Search Term: ' + searchTerm);
    const playlistTracks = this.state.playlistTracks;
    Spotify.search(searchTerm).then(searchResults => {
      // filter out 
      const filteredResults = searchResults.filter(track => {
        console.log("Playlist Tracks Length: " + playlistTracks.length);
        for(const playlistTrack of playlistTracks){
          console.log(playlistTrack);
          console.log("Playlist ID: " + playlistTrack.id);
          console.log("Search ID: " + track.id);
          if(playlistTrack.id === track.id){
            return false;
          }
        }
        return true;
      });
      this.setState({searchResults: filteredResults})
    });
  }
  playPreview(track){
    const previewURL = track.preview;
    if(this.state.audio && !this.state.audio.ended){
        // if there is an audio being played and it hasn't ended playing
        if(this.state.audio.src === previewURL){
            // if the passed track is the same as the current track then pause the current track and clear the audio.
            this.state.audio.pause();
            this.setState({audio: undefined});
        }
        else{
            // if the passed track is different then change the track to the new one and play it.
            this.state.audio.pause();
            const preview = new Audio(previewURL);
            preview.play();
            this.setState({audio: preview});
        }
    }
    else{
        // if there is no current audio then create one from the passed in track
        const preview = new Audio(previewURL);
        preview.play();
        this.setState({audio: preview});
    }
}
  render(){
    return (
      <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        < SearchBar onSearch={this.search} />
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} onPreview={this.playPreview} audio={this.state.audio} />
          <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} onPreview={this.playPreview} audio={this.state.audio} />
        </div>
      </div>
    </div>
    )
  }
}

export default App;
