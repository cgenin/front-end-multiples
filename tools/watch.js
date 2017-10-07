const fs = require('fs')
const execSync = require('child_process').execSync
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

const exec = (command, extraEnv) =>
    execSync(command, {
        stdio: 'inherit',
        env: Object.assign({}, process.env, extraEnv)
    })

console.log('\nBuilding front-end-multiples.js ...')

exec('rollup -c -f umd -o umd/front-end-multiples.js', {
    BABEL_ENV: 'umd',
    NODE_ENV: 'development'
})