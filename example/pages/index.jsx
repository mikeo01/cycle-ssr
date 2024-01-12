import xs from "xstream";
import Snabbdom from 'snabbdom-pragma'
import {Header} from "../components/organisms/header";
import {identity, prop} from "ramda";
import {Card} from "../components/organisms/card";
import {ImageWithCaption} from "../components/organisms/image-with-caption";
import moment from "moment/moment";
import { isNode, isBrowser } from 'browser-or-node'

export const getServerSideSinks = (sources) => {
  return {
    HTTP: xs.of({
      url: 'https://loripsum.net/api/plaintext',
      category: 'ipsum'
    }),

    state: sources.HTTP
      .select("ipsum")
      .flatten()
      .map(prop("text"))
      .map(text => () => text),
  }
}
  
export default (sources) => {
  const time$ = xs.periodic(1000).map(() => moment().format('dddd, MMMM Do YYYY, h:mm:ss a'))

  const intent$ = xs.combine(
    sources.state.stream,
    isNode ? time$.take(1) : time$,
  )

  const view$ = intent$.map(([caption, time]) => <Header>
      <Card title={time}>
        <ImageWithCaption src={`https://picsum.photos/1080?${time}`} caption={caption} />
      </Card>
    </Header>)

  return {
    DOM: view$
  }
}
