export type Doc = {
  name: string
  description: string
  source: string
  tests?: string
  deprecated?: string
  alias?: string
  example?: string
  signature?: string
  note?: string
  tags: string[]
  unseenTags: string[]
  arguments?: {
    name: string
    type: string
    description: string
  }[]

  lib?: string // this is silly, caused by wwtm
}
