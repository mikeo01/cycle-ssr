import config from './cycle.ssr.config.js'

/**
 * Main SSG config - merges in your main config.
 * Why? So we can keep SSG config separate from your main cycle.config.js file
 */
export default {
  ...config,

  /**
   * SSG options. Notably, where you want your files to be output to.
   */
   ssg: {
    // You'll want to make sure this folder is in your .gitignore
    outDir: 'static/html'
  }
}