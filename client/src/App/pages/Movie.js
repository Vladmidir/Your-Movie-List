import { React, useEffect, useState, useRef} from 'react';
import { useParams } from 'react-router-dom';
import "./Movie.css"
import MoviePreview from '../elemets/MoviePreview';

export default function Movie() {

    //get the id from the url parameters
    let { id } = useParams()
    const [similar, setSimilar] = useState([])
    const [movie, setMovie] = useState({//data about the movie.
        id: "", 
        imdb_id: "", 
        title: "", 
        description: "",
        rating: 0.0,
        banner: "",
        genre: "",
        UserId: "",  
        local: false}) 
    const [editing, setEditing] = useState(false) //whether the movie data is currently being edited.
    const [rerender, doRerender] = useState(false) //simply rerenders the page.
    const newDescription = useRef("") //I am not sure if I actually need this. Easier so I dont have to setMovie every time.



    //fetch the info from the API based on the ID. 
    useEffect(() => {
        (async () => {
            await fetch('/api/movie/' + id).then((res) => res.json()).then(async (data) => {
                setMovie(data)
                newDescription.current = data.description
                
            })
            //request similar movies using the current movie's genre
            await fetch('/api/movie/similar/' + movie.genre).then(async (res) => {
                const resJ = await res.json()
                console.log(resJ); return resJ}).then((data) => {
                setSimilar(data)
            })
            
        })()

        console.log(similar)

        
        
    }, [id, editing, movie.genre])



    /**
     * PUT 
     */
    async function putMovie() {
        const movieData = {
            id: movie.id,
            imdb_id: movie.imdb_id,
            title: movie.title,
            description: newDescription.current, //pass the new description
            rating: movie.rating,
            genre: movie.genre,
            banner: movie.banner
        }
        try {
            await fetch('/api/movie/' + movieData.imdb_id, {
                method: "put",
                headers: {
                  "Content-Type": "application/json"
                  },
                body: JSON.stringify(movieData)
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    async function deleteMovie() {
        await fetch("/api/movie/" + movie.imdb_id, { method: "delete" }).then((res) => res.json()).then((data) => {
            setMovie(data)
            newDescription.current = data.description
            doRerender(!rerender)
        })
    }

    // "add" button that sends a POST request with movie's data to the server, adding it to the database (user's list in the future.)
    const addForm = (
        <form action='/api/movie' method='POST' >
            <input className='hidden-input' name='imdb_id' type='string' value={ movie.imdb_id } readOnly/>
            <input className='hidden-input' name='title' type='string' value={ movie.title } readOnly/>
            <input className='hidden-input' name='description' type='text' value={ movie.description } readOnly/>
            <input className='hidden-input' name='rating' type='number' step='0.01' value={ movie.rating } readOnly/>
            <input className='hidden-input' name='thumbnail' type='text' value={ movie.thumbnail } readOnly/>
            <input className='hidden-input' name='banner' type='text' value={ movie.banner } readOnly/>
            <input className='hidden-input' name='genre' type='text' value={ movie.genre } readOnly/>


            <button className='btn movie-btn'>Add</button>
        </form>)

    //form for editing the movie description
    const editForm = (
        <form className='edit-form' onSubmit={(e) => { e.preventDefault(); putMovie(); setEditing(false) }}>
            <label htmlFor='description'><h3>Description:</h3></label>
            <textarea
                className='edit-description' 
                defaultValue={newDescription.current} 
                name='description' 
                type='textarea' 
                onChange={(e) => {newDescription.current = e.target.value}} />
                
            <button className='btn movie-btn' type='submit'>
                Save
            </button>
            <button className='btn movie-btn' onClick={() => {setEditing(false); newDescription.current = movie.description}} >
                Cancel
            </button>
        </form>
    )

    const movieBody = (
        <div className='movie-body'>
            <h3>Description:</h3>
            <p> {movie.description} </p>
        </div>
    )
    
    //Buttons to display for when the movie is local (added to the list)
    const localButtons = (
        <div>
            <button className='btn movie-btn' onClick={ setEditing }>Edit</button>
            <button className='btn movie-btn' onClick={ () => { deleteMovie();}}>Delete</button>
        </div>
    )

    //Check whether the movie is in the database and display the according form (add vs edit & delete)
    //ADD BANNER
    return (
        <div className='movie-container'>
        <div className='movie'>
            <img className='movie-banner' src={movie.banner} alt='movie banner'/>
            <div className='movie-header'>
                <h2>{ movie.title }</h2>
                { movie.local && <div>In the list!</div> }
            </div>
            { editing ? editForm : movieBody}

            <div className='movie-footer'>
                <span>Rating: {movie.rating}</span>

                { movie.local ?  (!editing && localButtons) : addForm}
            </div>
        </div>
        <div className='similar-movies'>
            <div className='card-grid'>
                {similar.map((movie, index) => {
                        return <MoviePreview key={index} movie={movie} />
                    })}
            </div>
        </div>
        </div>

    )
}
