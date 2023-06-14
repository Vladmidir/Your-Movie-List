import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import "./Authentication.css"

export default function Register() {

    const [message, setMessage] = useState("")
    const [passwordMessage, setPasswordMessage] = useState("")

    //validate the form and send a POST request
    async function tryRegister(e) {
        e.preventDefault()

        //reset the error messages
        setMessage("")
        setPasswordMessage("")

        //element references
        const nameElement = await document.getElementById('your-movie-list-name')
        const passwordConfirmElement = await document.getElementById('password-confirm')

        //actual values
        const name =  nameElement.value
        const password = await document.getElementById('password').value
        const passwordConfirm = passwordConfirmElement.value

        //make sure the passwords match
        if(password !== passwordConfirm) {
            setPasswordMessage('passwords do not match')
            passwordConfirmElement.classList.add('error-input')
            return
        }

        //send the register request
        try {
            const res = await fetch('/api/register/', {
                method: "post",
                headers: {
                  "Content-Type": "application/json"
                  },
                body: JSON.stringify(
                    {
                        name: name,
                        password: password
                    }
                )
            });
            if (res.status !== 201){
                //set error messages from the response
                nameElement.classList.add('error-input')
                setMessage((await res.json()).message)
            }else {
                window.location.href = './login' //can use ancor tag instead? if yes, how?
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    async function passwordHideErr() {
        if (passwordMessage !== "") {
            const password = await document.getElementById('password-confirm')
            password.classList.remove("error-input")
            setPasswordMessage("")
        }
    }

    async function usernameHideErr() {
        if (message !== "") {
            const name  = await document.getElementById('your-movie-list-name')
            name.classList.remove("error-input")
            setMessage("")
        }
    }

    return (
        <div className='auth-block'>
            
            <form className='auth-form' method='POST' action='/api/register' onSubmit={(e) => {
                tryRegister(e)
            }}>
                <div className='form-header'>
                    <h1>Your Movie List</h1>
                    <h2>Register an Account</h2>
                </div>
                <div className='form-body'>
                    <div>
                        <label htmlFor="name">Name</label><br/>
                        <input className='auth-input' onChange={usernameHideErr} type="text" name="your-movie-list-name" id='your-movie-list-name' placeholder="username" required />
                        {message !== "" && <div className='error-message'>{message}</div> }
                    </div>
                    <div>
                        <label htmlFor="password">Password</label><br/>
                        <input className='auth-input' type="password" name="password" id='password' placeholder="password" required />
                    </div>
                    <div>
                        <label htmlFor="password">Confirm password</label><br/>
                        <input className='auth-input' onChange={passwordHideErr} type="password" name="password-confirm" id='password-confirm' placeholder="password" required />
                        {passwordMessage !== "" && <div className='error-message'>{passwordMessage}</div> }

                    </div>
                </div>
                <div className='form-footer'>
                    <input className='btn form-btn' type="submit" value="Register" />
                    <Link to={"/login"}><button className='btn btn-outline form-btn'>Log in</button></Link>
                </div>
            </form>
        </div>
    )
}
