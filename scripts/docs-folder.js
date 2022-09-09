import { mkdir } from 'fs/promises'

let run = async () => await mkdir('./docs/data', { recursive: true })

run()