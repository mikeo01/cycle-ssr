import { h1 } from "@cycle/dom";
import xs from "xstream";
import Snabbdom from "snabbdom-pragma";
import { drop } from "ramda";

export const getStaticPaths = () => {
  return {
    paths: [["ce5fc5fa"]],
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

export default (sources, params) => {
  return {
    DOM: sources.state.stream.map(([groupId]) => {
      return (
        <div>
          <p>
            An example of a statically generated page as well as an entirely
            dynamic one
          </p>
          <b>Group Id:</b> {groupId} <br />
        </div>
      );
    }),
  };
};
