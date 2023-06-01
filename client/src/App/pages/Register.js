import React, { useState } from 'react';
import {Link} from 'react-router-dom'

export default function Register() {

    const [message, setMessage] = useState("")

    async function tryRegister(e) {
        e.preventDefault()

        const name =  await document.getElementById('name').value
        const password = await document.getElementById('password').value

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
                setMessage((await res.json()).message)
            }else {
                window.location.href = './login' //can use ancor tag instead? if yes, how?
            }

        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <>
        <h2>Please register</h2>
        <form method='POST' action='/api/register' onSubmit={(e) => {
            tryRegister(e)
        }}>
            <div>
                <label htmlFor="name">Name</label><br/>
                <input  type="text" name="name" id='name' placeholder="username" required />
                {message !== "" && <div className='error-message'>{message}</div> }
            </div>
            <div>
                <label htmlFor="password">Password</label><br/>
                <input type="password" name="password" id='password' placeholder="password" required />
            </div>
            <input type="submit" value="Register" />
            <button><Link to={"/login"}>login</Link> </button>
        </form>
        </>
    )
}
