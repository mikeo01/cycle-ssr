export const Messages = {
  ComponentNotValid: `Unable to import component matching url ":url".
    Expecting to see something like this in your page component:

      export default sources => {
        return {  } <-- Sinks
      }
  `,
  ComponentDOMSinkInvalid: `It looks like your component is not exporting a stream for its DOM sink. It should be returning something like this:
    import { of } from 'xstream' <-- Creates a stream from a value, if using xstream

    return {
      DOM: of(...)
    }`,

  SSG: {
    GetStaticSinksNotDefined: `It looks like your component ("pages:slug.js") isn't exporting getStaticSinks() & your page is dynamic (e.g. :id). Ensure you export this so we can pass them to your component for SSG.
      For example:

      export const getStaticSinks = () => {
        return {
          HTTP: xs.of({
            url: 'http://foo-bar
          })
        }
      }
      
      Note, these sinks should be consumed by your drivers which are then available to your app as normal.
      
      For instance, if you've got a HTTP request, you'd want to listen to that in your app using sources.HTTP.select('category-name') and handle cases where nothing comes back (e.g. because it's not sink'd on the client-side).`,
    GetStaticPathsNotDefined: `It looks like your component ("pages:slug.js") isn't exporting getStaticPaths(), and your component is dynamic (e.g. :id.js). Ensure you export this so we know what static HTML files to generate from it.
      For example:
      
      export const getStaticPaths = () => {
        return {
          paths: [ 'foo', 'bar' ] <-- Equates to routes /foo, /bar
        }
      }`,
    GetStaticPathsInvalid: `It looks like your component isn't exporting static paths correctly.
      We can see the slug as ":slug" but received a URL structure of:

      :staticPaths

      Note, your deepest page component will receive the dynamic portions, so it will need to deal with nested dynamic routes such as /:foo/:bar`
  }
}