import React from 'react';
import { Link } from 'react-router-dom';
import "./element-styles/MoviePreview.css"

/**
 * Has a link to the Movie Route (Movie's page)
 * Movies page then requests the API for data AGAIN
 */
export default function MoviePreview({movie}) {

    const [rerender, doRerender] = React.useState(false) //simply rerenders the page.
    //for the sake of rerendering. MAY WANT TO REFACTOR IT.

    //delete the movie from the list from it's preview. Does not reset the description!
    async function deleteMovie() {
        await fetch("/api/movie/" + movie.imdb_id, { method: "delete" }).then((data) => {doRerender(!rerender)})
        movie.local = false
    }

    //add movie to the list from its preview.
    async function addMovie() {
        movie.local = true
        const movieData = {
            id: movie.id,
            imdb_id: movie.imdb_id,
            title: movie.title,
            description: movie.description, //pass the new description
            rating: movie.rating,
            banner: movie.banner,
            genre: movie.genre
        }
        try {
            await fetch('/api/movie/', {
                method: "post",
                headers: {
                  "Content-Type": "application/json"
                  },
                body: JSON.stringify(movieData)
            }).then((data) => {doRerender(!rerender)})
        }
        catch (err) {
            console.log(err);
        }
    }
    
    React.useEffect(() => {

    }, [rerender])

    return (
        <div className="card card-shadow">
            <div class="card-image" >
                <img  src={ movie.banner } alt="movie banner"/>
            </div>
            <div class="card-header">
                <Link style={{textDecoration: "none"}} to={'/movie/' + movie.imdb_id}>
                    { movie.title }
                </Link>
            </div>
            <div class="card-body">
                    { movie.description }
            </div>
            <div class="card-rating">Rating: { movie.rating }</div>
            <div class="card-footer">
                {!movie.local ? 
                <button class="btn" onClick={addMovie}>Add</button> 
                :
                <button class="btn btn-outline" onClick={deleteMovie}>Remove</button>}
            </div>
        </div>
    )
}