import { useEffect, useState, useRef, useCallback } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { vs2015, vs } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useColorMode, useColorModeValue, Flex, Button } from '@chakra-ui/react'

let Runkit = ({
  source,
  preamble,
}: {
  source: any // fix
  preamble: string
}) => {
  let ref = useRef(null)
  let embed = useRef(null)
  const { colorMode } = useColorMode()
  // theme from https://discuss.runkit.com/t/list-of-themes/3052
  // https://twitter.com/runkitdev/status/1110994781616799744
  //   atom-dark, atom-light, one-dark, one-light, solarized-dark, solarized-light, and the default runkit-light.
  //   let theme = useColorModeValue(undefined, 'untilted-6dtfo0ftb4ws')
  let theme = useColorModeValue('runkit-light', 'atom-dark')

  let init = useCallback(() => {
    if (!embed.current) {
      // @ts-ignore:next-line
      embed.current = window.RunKit.createNotebook({
        // the parent element for the new notebook
        element: ref.current,
        // specify the source of the notebook
        source,
        preamble,
        theme,
      })
    }
  }, [preamble, source, theme])
  useEffect(init, [preamble, source, theme, init])
  useEffect(
    () => {
      if (embed.current) {
        //   @ts-ignore:next-line
        embed.current.destroy()
        embed.current = null
        init()
      }
    },
    [colorMode, init]
  )

  return <div ref={ref} />
}

let imports = `
  let _ = require('lodash/fp')
  let F = require('futil')
  let {expect} = require('chai')
`
type Props = {
  forceDark?: boolean
  noRepl?: boolean
  language?: string
  children?: string
}
export const CodeSnippet = ({ forceDark, noRepl, language = 'javascript', children }: Props) => {
  let [repl, setRepl] = useState(false)
  let style = useColorModeValue(vs, vs2015)
  return repl ? (
    <Runkit source={children} preamble={imports} />
  ) : (
    <>
      <SyntaxHighlighter language={language} style={forceDark ? vs2015 : style}>
        {children}
      </SyntaxHighlighter>
      {!noRepl && (
        <Flex justifyContent="flex-end">
          <Button size="sm" variant="ghost" onClick={() => setRepl(!repl)}>Try in REPL</Button>
        </Flex>
      )}
    </>
  )
  
}
