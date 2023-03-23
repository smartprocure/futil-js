import { useState, useEffect, memo } from 'react'
import _ from 'lodash/fp'
import { Container, Heading, Link } from '@chakra-ui/react'
import { Markdown } from './Markdown'

let fetchText = _.memoize(
  async (url: string) => await (await fetch(url)).text()
)
let changelogUrl =
  'https://raw.githubusercontent.com/smartprocure/futil-js/master/CHANGELOG.md'

export let Changelog = memo(() => {
  let [text, setData] = useState('')
  useEffect(() => {
    fetchText(changelogUrl).then(setData)
  }, [])
  return (
    <Container maxW="4xl" pt={10} px={4}>
      <Heading>
        <Link href="https://github.com/smartprocure/futil-js/blob/master/CHANGELOG.md">
          Version History/Changelog
        </Link>
      </Heading>
      <Markdown>{text}</Markdown>
    </Container>
  )
})
