import { React, useEffect, useState, useRef} from 'react';
import { useParams, Link } from 'react-router-dom';


/**
 * Request the server for data: GET("api/movie/:id")
 * Process the json response and display the custom page with the data
 */


export default function Movie() {

    //get the id from the url parameters
    let { id } = useParams()
    

    //May want to useRef, since this value will not be changing on rerenders
    const [movie, setMovie] = useState({imdb_id: "", title: "", description: "", local: false})
    const [editing, setEditing] = useState(false)
    const [rerender, doRederender] = useState(false)
    const newDescription = useRef("")

    //fetch the info from the API based on the ID. 
    useEffect(() => {
        fetch('/api/movie/' + id).then((res) => res.json()).then((data) => {
            setMovie(data)
            newDescription.current = data.description
        })
    }, [id, editing, rerender])
    //I have to rerender data every time editing occurs, how do the dependencies work again?


    async function putMovie() {
        const movieData = {
            imdb_id: movie.imdb_id,
            title: movie.title,
            description: newDescription.current
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
        await fetch("/api/movie/" + movie.imdb_id, { method: "delete" });
    }

    //if a movie is local, show the edit & delete buttons. Delete sends DELETE request.
    //edit button toggles the 'editing' state. If we are editing, hide description and show editing form instead.
    // if not editing, show description and hide the editing form.
    //if the movie is NOT local, show the 'addForm'

    //edit form should turn desription into an editable text field. Rerender on button click.
    //Make something like const [editing, setEditing] = UseState(false).
    //Show the form only when clicked the editing button (make it a button yes)
    //Editing form should have a text field with editable description, ?custom rating (later)?,
    //followed by <button method="PUT">save changes</button> and <button redirectBack >cancel</button>

    
    const addForm = (
        <form action='/api/movie' method='POST' >
            <input className='hidden-input' name='imdb_id' type='string' value={ movie.imdb_id } readOnly/>
            <input className='hidden-input' name='title' type='string' value={ movie.title } readOnly/>
            <input className='hidden-input' name='description' type='text' value={ movie.description } readOnly/>

            <button >add</button>
        </form>)

    const editForm = (
        <form onSubmit={(e) => { e.preventDefault(); putMovie(); setEditing(false) }}>
            <input className='hidden-input' name='imdb_id' type='string' value={ movie.imdb_id } readOnly />
            <input className='hidden-input' name='title' type='string' value={ movie.title } readOnly />
            <textarea defaultValue={newDescription.current} name='description' type='textarea' onChange={(e) => {newDescription.current = e.target.value}} >
                
            </textarea>
            <button type='submit' >save</button>
            <button onClick={() => {setEditing(false); newDescription.current = movie.description}} >cancel</button>
        </form>
    )
    
    //we call setEditing to cause a rerender
    const localButtons = (
        <div>
            <button onClick={ setEditing } >edit</button>
            <button onClick={ () => { deleteMovie(); doRederender(!rerender) }} >delete</button>
            
        </div>
    )

    //form that adds the movie to the database. 
    //Good idea to check whether the movie is in the database and display the according form (add vs edit & delete)
    return (
        <div className='movie'>
            <h2>This is the page of: { movie.title }</h2>
            { movie.local && <div>In the list!</div> }
            <h4>Description:</h4> 
            
                { editing ? editForm : <p> {movie.description} </p>}
            

            { movie.local ?  (!editing && localButtons) : addForm}

        </div>
    )
}
