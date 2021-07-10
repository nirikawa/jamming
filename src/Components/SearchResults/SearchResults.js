import React from 'react';
import {TrackList} from '../TrackList/TrackList'
import './SearchResults.css';

export class SearchResults extends React.Component {
    render(){
        console.log('Search Results: ' + this.props.searchResults);
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} isRemoval={false} onPreview={this.props.onPreview} audio={this.props.audio} />
            </div>
        )
    }
}
