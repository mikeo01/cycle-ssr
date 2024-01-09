import xs from "xstream";
import Snabbdom from 'snabbdom-pragma'
import {Header} from "../components/organisms/header";
import {prop} from "ramda";
import {ImageWithCaption} from "../components/organisms/image-with-caption";

export const getServerSideSinks = (sources) => {
  return {
    HTTP: xs.of({
      url: 'https://loripsum.net/api',
      category: 'ipsum'
    })
  }
}

const view = (caption) => <Header>
  <ImageWithCaption src="https://picsum.photos/200" caption={caption} />
</Header>

export default (sources) => {
  return {
    DOM: sources
      .HTTP
      .select('ipsum')
      .flatten()
      .map(prop('text'))
      .map(view),
  }
}
