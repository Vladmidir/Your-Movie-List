
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
- Destructing objects creates a shallow copy {...obj}. [More on that here](https://stackoverflow.com/questions/12690107/clone-object-without-reference-javascript)
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
- <s>Display error message for invalid password/username entries. **May31**
  - Set up login error messages using [this tutorial](https://www.freecodecamp.org/news/react-passport-authentication/) **UNDER THE RUG**</s>
- <s>debug the authentication system. **May31**
  - Hide login/register if not logged in
  - Allow the user to logout</s>
  - <s>Make sure the user with the same username can not be registered twice.</s>
- <s>How do I access session data about the user? (I will need userID and the rest of the user parameters) **May30**
 1. Can use fetch and make a server route that returns data about the logged in user. 
 2. Fetch in the browserRouter and pass user data as props to all client routes??? BEST IDEA SO FAR.</s>
- <s>Refactor the movie's API, with the consideratoin of the User that is logged in. **May30 & May31**</s>
- <s>Add the search bar for the RapidAPI database (In the layout). **May31**</s>
- <s>allow the user to view their movie list.**May31**</s>
- <s>allow the user to sort their movie list (date added, date modified, rating)**May31**</s>
- <s>add movie banners and thumbnails (refactor the database table). **June1 || June2**</s>
- <s>Show whether the movie is "saved" in the MoviePreview element. **June1 || June2**</s>
- <s>Add and delete movies through MoviePreview. **June2 (Optional)**</s>
- <s>MoviePreview accordion description. **June2 (optional)** *NOT ACCORDION*</s>
- <s>FINISH THE NAVBAR DESIGN **June 7**</s>
- <s>API similar crashes when the movie is in the database. Figure out why! **June 9**</s>
- <s>Move button styles from `MoviePreview.css` to `App.css`</s>
- <s>FIX THE MOVIE SEARCH  **June 10**</s>
- <s>Style the login and register forms **June 13**</s>
- Make everything responsive (sliding menu?) **June 14**
- Add a tooltip to the movie title [Tooltips with only CSS](https://blog.logrocket.com/creating-beautiful-tooltips-with-only-css/).**Optional**
- Read about the specifics of using async inside useEffect [article](https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook) **Optional**
- Figure out why `class` works, but `className` does not.**Optional**
- deep copy `options` with lodash instead of json. **Optional**
- Scale MoviePreview for mobile small (320px).
- For Movie page, medium screen width (800 - 1200px) show title and description to the side, while showing similar at the bottom.
- Document the project (finished README.MD with a video demo) **June 15**
- Make a landing page with the project description (can use the README file) **June 16**
- Push to GitHub **June 16**
- Read [About React on window resize](https://www.pluralsight.com/guides/re-render-react-component-on-window-resize)
- Reasearch hosting options **June 17**


## Future plans
- Make more efficient (useMemo instead of useState. Less unnecessary API calls)
- Add styles, make it look pretty.
- Add drag and drop (dnd delete, save movies to the list. Drag to trashcan or list icon). DND sorting? Order in the list property?
- Make it responsive.
- <s>refactor to use better API. [Greater movies database](https://rapidapi.com/SAdrian/api/MoviesDatabase/)</s>
- Make a custom error page


### Usefull articles
- [React Router with Express](https://dev.to/nburgess/creating-a-react-app-with-react-router-and-an-express-backend-33l3)
- [React with Express (Typescript)](https://medium.com/bb-tutorials-and-thoughts/how-to-develop-and-build-react-app-with-nodejs-backend-typescript-version-27a6a283a7c5)
- [Node js with Sequelize](https://www.bezkoder.com/node-js-express-sequelize-mysql/)
- **FRONT END** [Card description ellipsis](https://kiranworkspace.com/ellipsis-to-multiline-text-in-css/)

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