import 'colors'
import express from 'express'
import PrettyError from 'pretty-error'

// Make all errors easily readable
PrettyError.start()

const port = process.env.PORT ?? 3000

async function createServer() {
  const isProduction = process.env.NODE_ENV === 'production'
  const app = express()

  app.use(express.static('public'))

  if (isProduction) {
    const { render } = await import(`${ process.cwd() }/dist/server/cycle-ssr.cjs`)

    app.use('*', async (req, res, next) => {
      try {
        await render(req.originalUrl, html => {
          res.send(html)
        })
      } catch (e) {
        next(e)
      }
    })
  } else {
    app.use('*', async (req, res, next) => {
      // Reload cycle-ssr on each request
      const { render } = (await import(`${ process.cwd() }/dist/server/cycle-ssr.cjs`)).default

      try {
        await render(req.originalUrl, html => {
          res.send(html)
        })
      } catch (e) {
        next(e)
      }
    })
  }

  if (isProduction) console.log("################\n## Production ##\n################\n".red)
  else console.log("#################\n## Development ##\n#################\n".blue)
  app.listen(port)
  console.info(`Listening on port ${ port }`.green)
}

createServer()