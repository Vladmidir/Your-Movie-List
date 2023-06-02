import React, { useState } from 'react';
import MoviePreview from '../elemets/MoviePreview'

export default function Home({user}) {

    const [top50, setTop50] = useState([]) //useMemo instead of state?  
    
    React.useEffect(() => {
        fetch('/api/movie/top50').then((res) => {console.log(res);return res.json()}).then((data) => {
            setTop50(data)
        })
    }, [])

    return (
        <div className='Home'>
            <h1>Welcome Home, {user.name} !</h1>
            <div>
                <h2>Top 50 Movies</h2>
                <ol>
                    {top50.map((movie, index) => {
                        return <li key={index}>
                            <MoviePreview movie={movie}/>
                        </li>
                    })}
                </ol>
            </div>
        </div>
    )
}
