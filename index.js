/* global fetch, URLSearchParams */

class Trello {
  constructor (key, token) {
    this.key = key
    this.token = token
  }

  auth (opts) {
    let name = (opts.name || 'My App').replace(/ /g, '+')
    let expiration = opts.expiration || '1hour'
    let scope = opts.scope || {read: true, write: true, account: false}

    return new Promise((resolve, reject) => {
      let popup = window.open(`https://trello.com/1/authorize?response_type=token&key=${this.key}&return_url=${location.protocol}//${location.host}${location.pathname}${location.search}&callback_method=postMessage&scope=${Object.keys(scope).filter(k => scope[k]).join(',')}&expiration=${expiration}&name=${name}", 'trello', "height=606,width=405,left=${window.screenX + (window.innerWidth - 420) / 2},right=${window.screenY + (window.innerHeight - 470) / 2}`)

      var timeout = setTimeout(() => {
        popup.close()
        reject()
      }, 60000)

      window.addEventListener('message', e => {
        if (typeof e.data === 'string') {
          clearTimeout(timeout)
          popup.close()
          this.token = e.data
          resolve()
        }
      })
    })
  }

  req (method, path, data) {
    data = data || {}
    data.key = this.key
    data.token = this.token
    let qs = new URLSearchParams()
    for (let k in data) {
      qs.append(k, data[k])
    }

    var init = {
      method: method
    }

    var url = 'https://api.trello.com' + path

    if (method === 'POST' || method === 'PUT') {
      init.body = qs.toString()
      init.headers = {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    } else {
      url += '?' + qs.toString()
    }

    return fetch(url, init)
      .then(r => r.json())
  }

  get (path, data) {
    return this.req('GET', path, data)
  }

  head (path, data) {
    return this.req('HEAD', path, data)
  }

  post (path, data) {
    return this.req('POST', path, data)
  }

  put (path, data) {
    return this.req('PUT', path, data)
  }
}

module.exports = Trello
