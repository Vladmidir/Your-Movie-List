import React from 'react';
import MoviePreview from '../elemets/MoviePreview';

function List() {


    const [movies, setMovies] = React.useState([]) //useMemo instead?


    //get all movies saved by the user.
    React.useEffect(() => {
      fetch('/api/movie').then((res) => res.json()).then((fetched_data) => {
        console.log(fetched_data)
        setMovies(fetched_data)
        })
    }, [])

    

    return (
        <div className='list'>
            <h1>Your movie list</h1>
            <ol>
                {movies.map((movie, index) => {
                    return <li key={index}>
                        <MoviePreview title={movie.title} id={movie.imdb_id}/>
                    </li>
                })}
            </ol>
        </div>
    )
}


export default List