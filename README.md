An alternative to [Trello's client.js](https://trello.com/docs/gettingstarted/clientjs.html) for interfacing with Trello from the browser, using CORS.

All calls return promises (with [lie](https://www.npmjs.com/package/lie)).

### Install with

```
npm install trello-web
```


```js
const Trello = require('trello-web')
const trello = new Trello(TRELLO_API_KEY)

Promise.resolve().then(() =>
  localStorage.getItem('token')
).then(existingToken => {
  if (existingToken) {
    trello.token = existingToken
  } else {
    return trello.auth({
      name: 'My Trello App',
      scope: {
        read: true,
        write: true,
        account: true
      },
      expiration: '1hour'
    })
  }
}).then(() =>
  trello.get("/1/tokens/" + trello.token + "/member", {
    fields: 'username,id,email'
  })
).catch(e => {
  console.log('something bad happened, or the user took too long to authorize.', e)
})
```

When you have a token, you can do `.get`, `.put`, `.post` and `.del`, for example:

```js
trello.get('/1/boards').then(console.log)
trello.del('/1/cards/782346238742').then(() => console.log('deleted card'))
trello.post('/1/cards/21838932983/actions/comments', {text: 'hello'}).then(data => console.log('created comment', data))
trello.put('/1/cards/2342632532532/desc', {value: 'hello world!'}).then(console.log)
```
