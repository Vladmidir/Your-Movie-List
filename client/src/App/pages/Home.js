import React, { useState } from 'react';
import MoviePreview from '../elemets/MoviePreview'
import './Home.css'

export default function Home() {

    const [top50, setTop50] = useState([]) //useMemo instead of state? Have to useState, beucase of the local database.
    
    //get the data for top 50 most popular movies
    React.useEffect(() => {
        fetch('/api/movie/top50').then((res) => res.json()).then(async (data) => {
            setTop50(data)
        })
    }, [])

    return (
        <div>
            <div className='home-header'>
                <h1>Welcome to Your Movie List!</h1>
            </div>
            <div className='home-body'>
                <h2>Top 50 Most Popular</h2>
                <div className='card-grid'>
                    {top50.map((movie) => {
                        return <MoviePreview movie={movie} />
                    })}
                </div>
            </div>
        </div>
    )
}
