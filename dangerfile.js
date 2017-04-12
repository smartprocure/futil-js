import { danger, fail, warn } from 'danger'
import _ from 'lodash/fp'

const changed = {
  changelog: _.includes('CHANGELOG.md', danger.git.modified_file),
  packageJSON: _.includes('package.json', danger.git.modified_files)
}

// No PR is too small to warrant a paragraph or two of summary
if (danger.github.pr.body.length === 0) {
  fail('Please add a description to your PR.')
}

// Always ensure we assign someone, so that our Slackbot can do its work correctly
if (danger.github.pr.assignee === null) {
  fail('Please assign someone to merge this PR, and optionally include people who should review.')
}

// Requires CHANGELOG entries
if (!changed.changelog) {
  fail('Please add a changelog entry for your changes.')
}

// Requires a version update in package.json
const packageDiff = danger.git.diffForFile('package.json')
if (!changed.packageJSON && packageDiff.includes('version')) {
  fail('Please bump up the version')
}

// Warns when PR size is large
const bigPRThreshold = 600
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  warn(`:exclamation: This PR is BIG (+${danger.github.pr.additions} -${danger.github.pr.deletions})`)
}
