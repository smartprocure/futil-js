// This script exists to workaround create-react-app's limitation around importing outside /src
// Once this moves out of docs/beta, we could just drive readme generation out of docs/src/data instead of docs/data and not copy

import { copyFile, mkdir } from 'fs/promises'

let run = async () => {
  await mkdir('./docs/beta/src/data', { recursive: true })
  await copyFile('./docs/data/docs.json', './docs/beta/src/data/docs.json')
  await copyFile(
    './docs/data/tag-docs.json',
    './docs/beta/src/data/tag-docs.json'
  )
  await copyFile('./docs/data/tests.json', './docs/beta/src/data/tests.json')
}

run()
