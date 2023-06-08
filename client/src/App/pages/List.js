import React from 'react';
import MoviePreview from '../elemets/MoviePreview';
import './List.css'

function List() {


    const [movies, setMovies] = React.useState([]) //useMemo instead?

    //get all movies saved by the user.
    React.useEffect(() => {
      fetch('/api/movie').then((res) => res.json()).then((fetched_data) => {
        setMovies(fetched_data)
        })
    }, [])

    async function sortMovies() {
        const property = await document.getElementById('property').value
        const order = await document.getElementById('order').value

        const sortedMovies = movies.map((movie) => movie)
        if(property === 'date-saved'){
            sortedMovies.sort((a, b) => {
                return (Date.parse(a.createdAt) - Date.parse(b.createdAt))
            })
            
        }else if(property === 'date-modified'){
            sortedMovies.sort((a, b) => {
                //reverse the subtraction, bacause we want to display the last modified for ascending
                return (Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
            })
        }else{ //propery === 'rating'
            sortedMovies.sort((a, b) => {
                return (a.rating - b.rating)
            })
        }
        setMovies(sortedMovies)
        if(order === 'descending'){
            const temp = sortedMovies.map((m) => m)
            setMovies(temp.reverse())
        }

    }

    return (
        <div className='list'>
            <h1>Your movie list:</h1>
            <form className='sort-form' onSubmit={(e) => {e.preventDefault(); sortMovies();}}>
                <div>
                    <label htmlFor='property'>Sort by:</label>
                    <select name="property" id='property'>
                      <option value="date-saved">Date saved</option>
                      <option value="date-modified">Date modified</option>
                      <option value="rating">Rating</option>
                    </select>
                </div>
                <div>
                    <label htmlFor='order'>Order:</label>
                    <select name="order" id='order'>
                      <option value="ascending">Ascending</option>
                      <option value="descending">Descending</option>
                    </select>
                </div>
                <button className='btn sort-btn'>Sort</button>
            </form>
            <div className='card-grid'>
                    {movies.map((movie) => {
                        return <MoviePreview movie={{...movie, local: true}} />
                    })}
            </div>
        </div>
    )
}


export default List