const path = require('node:path');
const express = require("express")

const PORT = process.env.PORT || 8080

const app = express()
//uncomment for production
//app.use(express.static(path.resolve(__dirname, "../client/build")))

app.get("/api/home", (req, res) => {
    res.json({user: "Vlad"})
    console.log('sent hello!')
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
