import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Has a link to the Movie Route (Movie's page)
 * Movies page then requests the api for data
 */
export default function MoviePreview({movie}) {
    //Displays only the title for the top50 homepage (api specifics)
    return (
        <div className='movie-preview'>
            
            <Link to={'/movie/' + movie.imdb_id}>
                <h5>{ movie.title }</h5>
                {movie.thumbnail && <img style={{display: "inline-block"}} src={movie.thumbnail} alt='movie thumbnail'/>}
                
            </Link>
        </div>
    )
}