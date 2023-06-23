import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import "./Authentication.css"

export default function Login() {

    const [message, setMessage] = useState("")

    async function tryLogin(e) {
        e.preventDefault()

        //element references
        const passwordElem = await document.getElementById('password')
        const nameElem = await document.getElementById('your-movie-list-name')

        //actual values
        const name =  nameElem.value
        const password = passwordElem.value
        
        try {
            //try to login
            const res = await fetch('/api/login/', {
                method: "post",
                headers: {
                  "Content-Type": "application/json"
                  },
                body: JSON.stringify(
                    {
                        name: name,
                        password: password
                    })
            });
            if (res.status !== 200){
                //set error messages from the response
                passwordElem.classList.add("error-input")
                nameElem.classList.add("error-input")
                setMessage("invalid credentials")
            }else {
                //redirect to homepage
                window.location.href = './' //can use ancor tag instead? if yes, how?
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    //hide all the error highlights and messages
    async function hideErr() {
        if (message !== "") {
            const password = await document.getElementById('password')
            password.classList.remove("error-input")
            const name = await document.getElementById('your-movie-list-name')
            name.classList.remove("error-input")
            setMessage("")
        }
    }

    return (
        <div className='auth-block'>
        <form className='auth-form' method='POST' action='/api/login' onSubmit={(e) => {
            tryLogin(e)
        }}>
            <div className='form-header'>
                <h1>Your Movie List</h1>
                <h2>Please Log-in</h2>
            </div>
            <div className='form-body'>
                <div>
                    <label htmlFor="name">Name</label><br />
                    <input className='auth-input' onChange={hideErr} type="text" id='your-movie-list-name' name="your-movie-list-name" placeholder="username" required />
                </div>
                <div>
                    <label htmlFor="password">Password</label> <br />
                    <input className='auth-input' onChange={hideErr} type="password" id='password' name="password" placeholder="password" required />
                    {message !== "" && <div className='error-message'>{message}</div> }

                </div>
            </div>
            <div className='form-footer'>
                <input className='btn form-btn' type="submit" value="Log in" />
                <Link to={"/register"}><button className='btn btn-outline form-btn'>Register</button></Link>
            </div>            
        </form>
        </div>
    )
}
