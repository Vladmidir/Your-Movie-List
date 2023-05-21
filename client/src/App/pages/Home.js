import React, { useState } from 'react';


export default function Home() {

    const [top50, setTop50] = useState([])
    
    React.useEffect(() => {
        fetch('/api/top50').then((res) => res.json()).then((data) => {
            setTop50(Object.values(data.results).map((movie) => movie.title))
        })
    }, [])


    return (
        <div className='Home'>
            <h1>Welcome Home</h1>
            <div>
                <h2>Top 50 Movies</h2>
                <ol>
                    {top50.map((movie, index) => {
                        return <li key={index}>{movie}</li>
                    })}
                </ol>
            </div>
        </div>
    )
}
