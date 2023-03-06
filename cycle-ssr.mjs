#!/usr/bin/env node

import 'colors'
import { program } from 'commander';
import { exec } from 'child_process'
import pkg from './package.json' assert { type: 'json' }
import { equals, find } from 'ramda'

program.name('cycle-ssr')
  .version(pkg.version)

program.command('dev')
  .description('Runs development server with sourcemaps')
  .action(async () => {
    process.argv = [...process.argv, '--watch', '--sourcemaps', '--dev']

    await Promise.all([
      import('./esbuild/node.js'),
      import('./esbuild/browser.js'),
    ])
    console.log("Launching dev server...".green)
    await import('./server.js')

    console.log("Press CTRL+C to exit".black)
  })
program.command('build')
  .option('--watch', 'Optionally watch build')
  .option('--no-minify', 'Optionally disable minification')
  .description('Runs production build & minification')
  .action(async () => {
    if (find(equals('--no-minify'), process.argv) === undefined) {
      process.argv = [...process.argv, '--minify']
    }

    await Promise.all([
      import('./esbuild/node.js'),
      import('./esbuild/browser.js'),
    ])

    console.log('All done. Use `npx cycle-ssr preview` to view your site in production mode'.green)
  })
program.command('generate')
  .description('Runs static-site generation')
  .action(async () => {
    await import('./esbuild/ssg.js')
    exec(`node ${ process.cwd() }/dist/server/cycle-ssg.cjs`, (error, stdout, stderr) => {
      if (error) console.log(error.red)
      if (stderr) console.log(stderr.red)
      if (stdout) console.log(stdout)
    })
  })
program.command('preview')
  .description('Previews your app in production mode')
  .action(async () => {
    process.env = { ...process.env, NODE_ENV: 'production' }

    await import('./server.js')
  })

program.parse()