import React from 'react';
import './Track.css';

export class Track extends React.Component{
    constructor(props){
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.playPreview = this.playPreview.bind(this);
    }
    renderAction(){
        const isRemoval = this.props.isRemoval;
        return isRemoval ? <button className="Track-action" onClick={this.removeTrack} >-</button> : <button className="Track-action" onClick={this.addTrack} >+</button>;
    }
    renderPreviewButton(){
        if(this.props.audio && this.props.audio.src === this.props.track.preview){
            return <button className="Playlist-preview" onClick={this.playPreview} >STOP</button>
        }
        else{
            return <button className="Playlist-preview" onClick={this.playPreview} >PLAY</button>
        }
    }
    addTrack(){
        this.props.onAdd(this.props.track);
    }
    removeTrack(){
        this.props.onRemove(this.props.track);
    }
    playPreview(){
        this.props.onPreview(this.props.track);
    }
    render(){
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                {this.renderAction()}
                {this.renderPreviewButton()}
            </div>
        );
    }
}