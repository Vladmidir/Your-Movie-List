import React, { useState } from 'react';

export default function Register() {
    return (
        <form method='POST' action='/api/register'>
            <div>
                <label htmlFor="name">Name</label>
                <input  type="text" name="name" placeholder="username" required />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="password" required />
            </div>
            <input type="submit" value="Register" />
        </form>
    )
}
