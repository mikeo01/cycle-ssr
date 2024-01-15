import 'colors'
import express from 'express'
import PrettyError from 'pretty-error'

// Make all errors easily readable
PrettyError.start()

const port = process.env.PORT ?? 3000
const isProduction = process.env.NODE_ENV === 'production'
const serverPath = `${process.cwd()}/dist/server/cycle-ssr.cjs`

async function createServer () {
  const app = express()
  const { render } = await import(serverPath)

  app.use(express.static('public'))
  app.use('*', async (req, res, next) => {
    try {
      await render(req.originalUrl, (html) => {
        res.send(html)
      })
    } catch (e) {
      next(e)
    }
  })

  if (isProduction) { console.log('################\n## Production ##\n################\n'.red) } else {
    console.log(
      '#################\n## Development ##\n#################\n'.blue
    )
  }
  app.listen(port)
  console.info(`Listening on port ${port}`.green)
}

createServer()
