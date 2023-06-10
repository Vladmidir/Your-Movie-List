import React, { useState } from 'react';
import MoviePreview from '../elemets/MoviePreview'
import './Home.css'

export default function Home({user}) {

    const [top50, setTop50] = useState([]) //useMemo instead of state?  
    
    React.useEffect(() => {
        fetch('/api/movie/top50').then((res) => res.json()).then(async (data) => {
            setTop50(data)
            console.log(data)
        })
    }, [])

    return (
        <div>
            <div className='home-header'>
                <h1>Welcome to your movie database!</h1>
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
