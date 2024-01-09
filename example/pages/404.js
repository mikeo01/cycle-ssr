import {h1} from '@cycle/dom';
import xs from "xstream";

export default (sources) => {
  return {
    DOM: xs.of(
      h1('404 - Not Found')
    )
  }
}
