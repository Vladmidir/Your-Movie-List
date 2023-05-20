import React from 'react';


function List() {


    const [items, setItems] = React.useState(["dummy 1", "dummy 2"])

    //make sure to pass empty array, to prevent infinite fetching.
    React.useEffect(() => {
      fetch('/api/list').then((res) => res.json()).then((fetched_data) => {
        console.log(Object.values(fetched_data))
        setItems(Object.values(fetched_data))
        })
    }, [])

    

    return (
        <div className='list'>
            <h3>Rendered</h3>
            <ol>
                {items.map((item, index) => {
                    return <li key={index}>{item}</li>
                })}
            </ol>
        </div>
    )
}


export default List