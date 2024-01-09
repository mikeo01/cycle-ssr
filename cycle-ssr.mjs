#!/usr/bin/env node

import 'colors'
import {fileURLToPath} from 'url'
import {program} from 'commander';
import {exec} from 'child_process'
import pkg from './package.json' assert {type: 'json'}
import {equals, find} from 'ramda'
import {dirname} from 'path';
import nodemon from "nodemon"

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
    const __dirname = dirname(fileURLToPath(import.meta.url))

    nodemon({script: `${__dirname}/server.js`, watch: "dist/server"})
      .on('start', () => console.log("Application started".green))
      .on('quit', () => console.error("Application has terminated".red))
      .on('restart', () => console.info("Application restarting".blue))

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
    exec(`node ${process.cwd()}/dist/server/cycle-ssg.cjs`, (error, stdout, stderr) => {
      if (error) console.log(error.red)
      if (stderr) console.log(stderr.red)
      if (stdout) console.log(stdout)
    })
  })
program.command('preview')
  .description('Previews your app in production mode')
  .action(async () => {
    process.env = {...process.env, NODE_ENV: 'production'}

    await import('./server.js')
  })

program.parse()
