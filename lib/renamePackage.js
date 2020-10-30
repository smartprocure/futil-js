import _ from 'lodash/fp.js'
import readPkg from 'read-pkg'
import writePkg from 'write-pkg'

let rename = async (name = 'futil-js') => {
  let current = await readPkg()
  writePkg(
    _.omit(['_id'], {
      ...current,
      name,
    })
  )
  console.log(`Renamed package from ${current.name} to ${name}`)
}

rename(process.argv[2])
