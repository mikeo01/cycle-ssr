import { always } from 'ramda'
import { header, h1, div, p } from '@cycle/dom'
import xs from 'xstream'

const view = header(
  div([
    h1('Index'),
    p('This is your index page')
  ])
)

export default always({ DOM: view })