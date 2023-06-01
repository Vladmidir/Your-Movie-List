import React, { useState } from 'react';
import MoviePreview from '../elemets/MoviePreview'

export default function Home({user}) {

    const [top50, setTop50] = useState([]) //useMemo instead of state?  
    
    React.useEffect(() => {
        fetch('/api/movie/top50').then((res) => res.json()).then((data) => {
            setTop50(Object.values(data.results).map((movie) => ( {title: movie.title, imdb_id: movie.imdb_id })))
        })
    }, [])

    console.log(user)
    return (
        <div className='Home'>
            <h1>Welcome Home, {user.name} !</h1>
            <div>
                <h2>Top 50 Movies</h2>
                <ol>
                    {top50.map((movie, index) => {
                        return <li key={index}>
                            <MoviePreview title={movie.title} id={movie.imdb_id}/>
                        </li>
                    })}
                </ol>
            </div>
        </div>
    )
}
