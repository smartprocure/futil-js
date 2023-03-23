import { mkdir } from 'fs/promises'

let run = () => mkdir('./docs/data', { recursive: true })

run()
