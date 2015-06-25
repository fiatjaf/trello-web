An alternative to [Trello's client.js](https://trello.com/docs/gettingstarted/clientjs.html) for interfacing with Trello from the browser, using CORS.

All calls return promises (with [lie](https://www.npmjs.com/package/lie)).

```coffeescript
Trello = require 'trello-browser'
trello = new Trello TRELLO_API_KEY

# doing auth
Promise.resolve().then(->
  # perhaps you have some token stored at localStorage
  return localStorage.getItem('token')
).then((existingToken) ->
  if existingToken
    # no need to call auth
    trello.setToken(existingToken)
    return

  trello.auth({
    name: 'My Trello App'
    scope:
      read: true
      write: true
      account: true
    expiration: '1hour'
  })
  # this will open a friendly Trello popup
).then(->
  # trello.token will contain the token you got from the user
  trello.get("/1/tokens/#{trello.token}/member", {fields: 'username,id,email'})
).catch((e) ->
  console.log('something bad happened, or the user took too long to authorize.')
)
```

Besides these calls, you can do `.get`, `.put`, `.post` and `.del`, for example:

```coffeescript
trello.get('/1/boards').then(console.log.bind console)
trello.del('/1/cards/782346238742').then(-> console.log 'deleted card')
trello.post('/1/cards/21838932983/actions/comments', {text: 'hello'}).then(-> console.log 'created comment')
trello.put('/1/cards/2342632532532/desc', {value: 'hello world!'}).then(-> console.log 'updated description')
```

### LICENSE IS MIT
