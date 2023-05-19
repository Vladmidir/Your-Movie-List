### Setup notes
- [followed this tutorial](https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/)
- add a proxy path to our React package.json, so to not have to provide the origin on every request. `"proxy" : "http://localhost:8080"`
- we also remove git from client (React folder) to set up git globally (`rm -rf .git` inside client)
- Trying to install express into the 'server' foled, but it configures globally. Whatever, just hope this does not backfire.
- Remeber to provide Node version for deployment (// server/package.json
```
"engines": {
  "node": "your-node-version"
})
```

### Questions 
- Do I need semicolons in javascript?
- what is React useEffect? How to useEffect with APIs? [Read this](https://react.dev/reference/react/useEffect)

### Do next 
- 