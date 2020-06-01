const express = require('express')
const fallback = require('express-history-api-fallback')
const path = require('path')
const cors = require('cors')

const PORT = 3004
const app = express()
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', express.static('dist', {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['js', 'map', 'html', 'ttf'],
  maxAge: 0,
  redirect: false,
}))

app.use(fallback('index.html', { root: path.resolve(__dirname, 'dist') }))

app.get('/greet', (req, res) => {
  res.send('hello')
})

app.post('/validate', (req, res) => {
  const { username } = req.body
  let hasError = false
  if (username !== 'prai') {
    hasError = true
  }

  setTimeout(() => {
    if (!hasError) {
      res.json({ code: 0 })
    } else {
      res.json({
        code: 1,
        errors: {
          username: 'Username is already in use',
        },
      })
    }
  }, 1000)
})

app.listen(PORT, () => {
  console.log(`Example api listening on ${PORT}`)
})
