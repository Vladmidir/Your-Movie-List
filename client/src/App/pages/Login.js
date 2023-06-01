import React, { useState } from 'react';
import {Link} from 'react-router-dom'

export default function Login() {

    const [message, setMessage] = useState("")

    async function tryLogin(e) {
        e.preventDefault()

        const name =  await document.getElementById('name').value
        const password = await document.getElementById('password').value
        
        try {
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
                setMessage("invalid credentials")
            }else {
                window.location.href = './' //can use ancor tag instead? if yes, how?
            }
        }
        catch (err) {
            console.log(err);
        }
    }


    return (
        <>
        <h2>Please login</h2>
        <form method='POST' action='/api/login' onSubmit={(e) => {
            tryLogin(e)
        }}>
            <div>
                <label htmlFor="name">Name</label><br />
                <input  type="text" id='name' name="name" placeholder="username" required />
            </div>
            <div>
                <label htmlFor="password">Password</label> <br />
                <input type="password" id='password' name="password" placeholder="password" required />
            </div>
            {message !== "" && <div className='error-message'>{message}</div> }

            <input type="submit" value="Login" />
            <button><Link to={"/register"}>register</Link></button>
        </form>
        </>
    )
}
