const express = require('express')
const cors = require('cors')

const PORT = 3004
const app = express()
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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
