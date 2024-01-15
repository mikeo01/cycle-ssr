# cycle-ssr

SSR & SSG framework utilising Cycle.js.

| Dependencies                                                           |                                     |
| ---------------------------------------------------------------------- | ----------------------------------- |
| [`@cycle/dom`](https://github.com/cyclejs/cyclejs/tree/master/dom)     | Default DOM renderer                |
| [`@cycle/html`](https://github.com/cyclejs/cyclejs/tree/master/html)   | Default SSR renderer                |
| [`@cycle/state`](https://github.com/cyclejs/cyclejs/tree/master/state) | Default SSR/Client hydration driver |

## Directory structure

Opinionated directory structure to follow current conventions of using `pages/` for route discovery.

- `pages/`
- `pages/:id/:id` (_dynamic route_)
- `pages/:id/` (_dynamic route with index_)
- `index.html.js` (_root HTML template used for SSR_)

## Usage

For most of your applications you'll probably want client-side hydration so your client-side application can pick up where it left off.

```js
import xs from "xstream"

export const getServerSideSinks = (sources) => {
  return {
    HTTP: xs.of({
      url: "http://some-url",
      category: "some-http-call"
    }),

    // state driver is used for state serialisation and client-side hydration
    state: sources.HTTP.select("some-http-call").flatten().map(response.text)
  }
}

export default (sources) => {
  return {
    // if using snabbdom pragma & jsxFactory
    DOM: sources.state.stream.map(text => <h1>{text}),

    // you can omit state as it'll use the entire state tree for serialisation
    // it's probably best to reduce this further into a data structure you only need
    // state: xs.of(..)
  }
}
```

You may also omit any state if you do not wish to hydrate client-side.

```js
import xs from "xstream"

export const getServerSideSinks = (sources) => {
  return {
    HTTP: xs.of({
      url: "http://some-url",
      category: "some-http-call"
    }),
  }
}

export default (sources) => {
  return {
    // if using snabbdom pragma & jsxFactory
    DOM: sources.HTTP.select("some-http-call").flatten().map(response.text).map(text => <h1>{text})
  }
}
```

For statically generated pages you can take advantage of `getStaticSinks` and `getStaticPaths`.

```js
// pages/:id/:id

import xs from "xstream";

export const getStaticPaths = () => {
  return {
    paths: [[":first-url-param", ":second-url-param"]],
  };
};

export const getStaticSinks = (sources, params) => {
  return {
    state: xs.of(() => params),
  };
};

export const getServerSideSinks = (sources, params) => {
  return {
    state: xs.of(() => drop(1, params.url.params)),
  };
};

export default (sources) => {
  return {
    // if using snabbdom pragma & jsxFactory
    DOM: sources.state.stream.map((params) => (
      <div>
        <p>
          Param 1: <b>{params[0]}</b>
        </p>
        <p>
          Param 2: <b>{params[1]}</b>
        </p>
      </div>
    )),
  };
};
```

## Example

Run the example by cloning this repository and changing your working directory into `example/`.

##### SSR Server

```bash
yarn dev     # local
yarn build   # bundle
yarn preview # production preview
```

##### SSG

```bash
yarn generate
```
