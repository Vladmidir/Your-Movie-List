
## Structure
- When clicking on a movie preview, the user opens the Movie's Page
- Client makes a GET request to api/movie/:id
- The server looks up the id in the local database and returns the json() response.
- IF the id is NOT in the database, the server makes a request to RapidAPI and directs the reponse to the client.
- When the client add a movie (from the Movie's page), a POST request in being sent to /api/movie/:id (I guess provide movie's details here, so we don't have to make another request to the RapidAPI. If we need to make another request, no biggie.)
- How do I provide custom paramaters in the HTML form, without making dummy inputs?
- When the client edits a movie (in their list) a PUT request is being sent to /api/movie/:id.
- When the client deletes a movie a DELETE request is being sent to /api/movie/:id

## Notes

### General notes:
- App routing takes the following form `app.METHOD(PATH, HANDLER)
- IMPORTANT: I did not install some packages as `dev` and installed them forever (eg, sequelize-cli). Make sure this is not an issue.
### Setup notes
- [followed this tutorial](https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/)
- add a proxy path to our React package.json, so to not have to provide the origin on every request. `"proxy" : "http://localhost:8080"`
- we also remove git from client (React folder) to set up git globally (`rm -rf .git` inside client)
- Remeber to provide Node version for deployment (// server/package.json
```
"engines": {
  "node": "your-node-version"
})
```
- Remember to secure the Secret Key for the API in an environment file. [Here is a guide](https://medium.com/hackernoon/how-to-use-environment-variables-keep-your-secret-keys-safe-secure-8b1a7877d69c)


### Routing notes
- React Router `<Switch>` tag is different from `<Route>` tag in a way that `<Switch>` renders *exclusively*, where `<Route>` renders *inclusively*.[More on Switch](https://v5.reactrouter.com/web/api/Switch)
- I may need to use `<createBrowswerRouter>` instead of `<BrowserRouter>` to work with APIs.
- The primary goal of a data router is decoupling the data fetching from rendering



### Questions 
- Do I need semicolons in javascript?
- How to useEffect with APIs? [Skim this](https://react.dev/reference/react/useEffect)
- Method analogous to url_for() in Flask? **ANSWER:** `<Route>` has a property path='/some/path'.
- I should learn how to use routing. **ANSWER:** Use react-router library. 
- How to interact with API properly using React? 
- How to make templates like in Jinja? **ANSWER:** Use react-router library again.
- How to let the server handle the rendering? [Read this](https://reactrouter.com/en/main/guides/ssr) **ASWER:** Stay away from erver side rendering for now. Keep it in mind for future projects tho.
- I should get data from the server at every render to check for inputs and stuff (if I have forms).
- When changing routes I guess the new Route is rendered, that is when we again access data from the server.
- How do we avoid conflict between express.js routes and React routes? 
- How do we make the routes relative (for deployment)? Or will the automatically fix themselves during build?   


# Do next 
- Refactor the routes.
- Display error message for invalid password/username entries. **May30**
- debug the authentication system. **May30**
- How do I access session data about the user? (I will need userID and the rest of the user parameters) **May30**
 1. Can use fetch and make a server route that returns data about the logged in user. 
 2. Fetch in the browserRouter and pass user data as props to all client routes??? BEST IDEA SO FAR.
- Refactor the movie's API, with the consideratoin of the User that is logged in. **May30 & May31**
- Add the search bar for the RapidAPI database (In the layout). **May31**
- allow the user to view their movie list.**May31**
- allow the user to sort their movie list (date added, date modified, rating)**May31**
- add movie banners and thumbnails (refactor the database table). **June1 || June2**
- Show whether the movie is "saved" in the MoviePreview element. (seach the database for each movie that is being displayed 
Movie.findOne({where: {imdb_id = movie.imdb_id, UserId = user.id}})) **June1 || June2** //one user does NOT have 2 same *imdb_id*'s 
- Add and delete movies through MoviePreview. **June2 (Optional)**
- MoviePreview accordion description. **June2 (optional)**




### Usefull articles
- [React Router with Express](https://dev.to/nburgess/creating-a-react-app-with-react-router-and-an-express-backend-33l3)
- [React with Express (Typescript)](https://medium.com/bb-tutorials-and-thoughts/how-to-develop-and-build-react-app-with-nodejs-backend-typescript-version-27a6a283a7c5)
- [Node js with Sequelize](https://www.bezkoder.com/node-js-express-sequelize-mysql/)

### Frontend ideas
- Arrange movies in user's list using drag and drop
- add cool animations to the homepage (movies flying in the background)

### Backend ideas
- All the user to email their movies list to themselves.

### Comments from Movie.js. Read & refactor these later
    //if a movie is local, show the edit & delete buttons. Delete sends DELETE request.
    //edit button toggles the 'editing' state. If we are editing, hide description and show editing form instead.
    // if not editing, show description and hide the editing form.
    //if the movie is NOT local, show the 'addForm'

    //edit form should turn desription into an editable text field. Rerender on button click.
    //Make something like const [editing, setEditing] = UseState(false).
    //Show the form only when clicked the editing button (make it a button yes)
    //Editing form should have a text field with editable description, ?custom rating (later)?,
    //followed by <button method="PUT">save changes</button> and <button redirectBack >cancel</button>