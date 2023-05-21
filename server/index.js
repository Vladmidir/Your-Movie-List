const path = require('node:path');
const express = require("express")
const axios = require('axios');

const PORT = process.env.PORT || 8080

const BASE_URL = 'https://moviesminidatabase.p.rapidapi.com/movie/'
const app = express()
//##MAKE SURE TO HIDE THE API KEY##
const options = {
    method: 'GET',
    url: BASE_URL,
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'moviesminidatabase.p.rapidapi.com'
    }
  };

//uncomment for production
//app.use(express.static(path.resolve(__dirname, "../client/build")))


//Return top 50 Movies from MoviesMiniDatabase.
app.get("/api/top50", async (req, res) => {
    //set up custom url depending on our needs
    const url = "order/byPopularity/"
    options.url += url
 
    //fetch the data
    try {
        const response = await axios.request(options);
        res.send(response.data)
    } catch (error) {
        console.error(error);
    }
    //reset the url back to default
    options.url = BASE_URL
})

app.get("/api/list", (req, res) => {
    res.json({
        item1: "item1",
        item2: "item2",
        item3: "item3"
    })
    console.log('sent list!')
})

//uncomment for production
//Send all non-api requests to the React app.
//app.get("*", (req, res) => {
//    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
//})

app.listen(PORT, () => {
    console.log(`Server Listening on ${PORT}`)
})


