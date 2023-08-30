import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MoviePreview from '../elemets/MoviePreview'
import "./page-styles/Search.css"

export default function Search() {

    const [results, setResults] = useState([])
    
    //cutom hook. Documenting this late. Not sure why excatly we need it.
    function useQuery() {
        const { search } = useLocation();
        
        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    let query = useQuery(); //this returns a memo (the value is saved between rerenders)
    React.useEffect(() => {
        fetch('/api/movie/search?' + query).then((res) => res.json()).then(async (data) => {
            setResults(data)
        })
    }, [query]) 

    return (
        <div className='search-results'>
            <h1 className='sub-header' >Search results for {query.get("title")}:</h1>
            <h2>Sorted by date (descending)</h2>
            <div className='card-grid'>
                    {results.map((movie) => {
                        return <MoviePreview movie={movie} />
                    })}
            </div>
        </div>
    )
}
