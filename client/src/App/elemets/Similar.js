import React, { useState } from 'react';
import MoviePreview from './MoviePreview';
import "./element-styles/Similar.css"

export default function Similar({genre, rerender}) {
    
    const [movies, setMovies] = useState([])

    React.useEffect(() => {
        //request similar movies using the current movie's genre
        if(genre !== ""){
            fetch('/api/movie/similar?genre=' + genre).then((res) => {console.log(res); return res.json()}).then(async (data) => {
                setMovies(await data)
            })
        }
    }, [genre, rerender])

    return (
        <div className='card-flex'>
            <ul>
                {genre !== "" && movies.map((movie) => {
                        return <li><MoviePreview key={movie.imdb_id} movie={movie} /></li>
                    })}
            </ul>
        </div>
    )
}