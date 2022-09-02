import _ from 'lodash/fp'
import { writeFile, readFile } from 'fs/promises'
import docs from '../docs/data/docs.json'
import tagDocs from '../docs/data/tag-docs.json'
import { maybeWrap, joinWith } from './utils'

// Renderers for doc fields
let signature = maybeWrap('`', '`\n')
let example = maybeWrap('\n\nExample:\n```jsx\n', '\n```')
let alias = maybeWrap(' (alias: ', ')')
let note = maybeWrap('\n**Note:** ', '')

let tag = _.flow(
  _.upperFirst,
  maybeWrap('\n\n## ', '\n')
)
let tagDoc = _.flow(
  // getIn is in futil, but simpler to not create nested dependency here
  x => _.get(x, tagDocs),
  maybeWrap('', '\n')
)
let tags = joinWith(x => `${tag(x)}${tagDoc(x)}`)

let apiDocs = joinWith(
  doc => `${tags(doc.unseenTags)}
### ${doc.name}${alias(doc.aliases)}
${signature(doc.signature)}${doc.description}${example(doc.example)}${note(
    doc.note
  )}
`
)

let run = async () => {
  let readmeHeader = await readFile('./scripts/readme-preamble.md')
  let markdown = `${readmeHeader}\n# API${apiDocs(docs)}`
  return writeFile('./README.md', markdown, { flag: 'w' })
}

run()
