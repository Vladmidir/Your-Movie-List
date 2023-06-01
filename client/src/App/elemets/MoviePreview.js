import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Has a link to the Movie Route (Movie's page)
 * Movies page then requests the server for data
 */
export default function MoviePreview({title, id}) {

    return (
        <div className='movie-preview'>
            <Link to={'/movie/' + id}><h5>{ title }</h5></Link>
        </div>
    )
}