import _ from 'lodash/fp'
import { writeFile, readFile } from 'fs/promises'
import docs from '../docs/data/docs.json'
import tagDocs from '../docs/data/tag-docs.json'
import { joinWith } from './utils'
import { wrap, getIn } from '../src/'

// Renderers for doc fields
let signature = wrap('`', '`\n')
let example = wrap('\n\nExample:\n\n```jsx\n', '\n```')
let alias = wrap(' (alias: ', ')')
let note = wrap('\n**Note:** ', '')

let tag = _.flow(_.upperFirst, wrap('\n## ', '\n'))
let tagDoc = _.flow(getIn(tagDocs), wrap('\n', '\n'))
let tags = joinWith((x) => `${tag(x)}${tagDoc(x)}`)

let apiDocs = joinWith(
  (doc) => `${tags(doc.unseenTags)}
### ${doc.name}${alias(doc.aliases)}

${signature(doc.signature)}${doc.description}${example(doc.example)}${note(
    doc.note
  )}
`
)

let run = async () => {
  let readmeHeader = await readFile('./scripts/readme-preamble.md')
  let markdown = `${readmeHeader}\n# API\n${apiDocs(docs)}`
  return writeFile('./README.md', markdown, { flag: 'w' })
}

run()
