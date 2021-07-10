import React from 'react';
import {Track} from '../Track/Track';
import './TrackList.css';

export class TrackList extends React.Component{
    constructor(props){
        super(props);
        this.state = {audio: undefined, currentlyPlayingID: ""};
    }

    render(){
        const trackComponents = this.props.tracks.map(track => {
            return (
                <Track track={track} key={track.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval} onPreview={this.props.onPreview} audio={this.props.audio} />
            )
        });
        return (
            <div className="TrackList">
                {trackComponents}
            </div>
        );
    }
}