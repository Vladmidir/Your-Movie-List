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
    React.useEffect(() => {
        fetch('/api/movie/search?' + query).then((res) => res.json()).then(async (data) => {
            setResults(data)
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
