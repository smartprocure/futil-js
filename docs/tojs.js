import { readFile } from 'fs/promises'

readFile(process.argv.slice(2)[0], { encoding: 'utf-8' }).then((x) =>
  console.info(`export default ${JSON.stringify(x)}`)
)
