import { danger, fail, warn } from 'danger'
import _ from 'lodash/fp'
import fs from 'fs'

const log = (f, s) => console.log(f.name, s) & f(s)
const cleanANSII = _.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
const formatContent = (path, text) => `<br/><b>${formatPath(path)}</b><br/><pre><code>${cleanANSII(text)}</code></pre>`

const readFileIfExists = path => {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path, { encoding: 'utf8' })
  }
}

const formatPath = path => {
  let parts = path.split('/')
  let [ directory, filename ] = parts.slice(-2)
  let command = filename.replace('--output', '').split('-').join(' ')
  return `[${directory}] ${command}`
}

const failExists = path => {
  let file = readFileIfExists(path)
  if (file) log(fail, formatContent(path, file))
}

const failEslint = path => {
  let file = readFileIfExists(path)
  if (file) {
    let eslintErrors = _.flow(
      _.split('\n\n'),
      _.filter(p => p.match(/ error /)),
      _.join('\n\n'),
      _.split('\n'),
      _.filter(_.negate(p => p.match(/ warning /))),
      _.join('\n')
    )(file)
    log(fail, formatContent(path, eslintErrors))
  }
}

const failMocha = path => {
  let file = readFileIfExists(path)
  if (file) {
    let eslintErrors = _.flow(
      _.split('\n\n'),
      _.slice(1, -1),
      _.join('\n\n')
    )(file)
    log(fail, formatContent(path, eslintErrors))
  }
}

const changed = {
  changelog: _.includes('CHANGELOG.md', danger.git.modified_files),
  packageJSON: _.includes('package.json', danger.git.modified_files)
}

// Requires CHANGELOG entries
if (!changed.changelog) {
  log(fail, 'Please add a changelog entry for your changes.')
}

// Requires a version update in package.json
const packageDiff = danger.git.diffForFile('package.json')
if (!changed.packageJSON && _.includes('version', packageDiff)) {
  log(fail, 'Please bump up the version')
}

// No PR is too small to warrant a paragraph or two of summary
if (danger.github.pr.body.length === 0) {
  log(fail, 'Please add a description to your PR.')
}

// Always ensure we assign someone, so that our Slackbot can do its work correctly
if (danger.github.pr.assignee === null) {
  log(fail, 'Please assign someone to merge this PR, and optionally include people who should review.')
}

// Warns when PR size is large
const bigPRThreshold = 600
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  log(warn, `:exclamation: This PR is BIG (+${danger.github.pr.additions} -${danger.github.pr.deletions})`)
}

// Check for linting errors
failEslint('./npm-run-lint--output')

// Check for cicoverage errors
failExists('./npm-run-cicoverage--output')

// Check for mocha errors
failMocha('./npm-test--output')
