import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MoviePreview from '../elemets/MoviePreview'

export default function Search({user}) {

    const [results, setResults] = useState([])
    
    function useQuery() {
        const { search } = useLocation();
      
        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    let query = useQuery(); //this returns a meme (the value is saved between rerenders)
    console.log(query)
    React.useEffect(() => {
        fetch('/api/movie/search?' + query).then((res) => res.json()).then(async (data) => {
            console.log(await data)
            setResults((await data).map((movie) => ( {title: movie.title, imdb_id: movie.imdb_id })))
        })
    }, [query]) 

    return (
        <div className='search-list'>
            <h1>Search results for {query.get("title")}</h1>
            <div>
                <ol>
                    {results.map((movie, index) => {
                        return <li key={index}>
                            <MoviePreview movie={movie}/>
                        </li>
                    })}
                </ol>
            </div>
        </div>
    )
}
