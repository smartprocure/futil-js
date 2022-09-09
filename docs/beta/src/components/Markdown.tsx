import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import { Heading } from '@chakra-ui/react'

export let Markdown = ({ children }: { children: string }) => (
  <ReactMarkdown
    components={ChakraUIRenderer({
      h1: ({ children }) => (
        <Heading my={2} mt={8} as={`h1`} size={'lg'}>
          {children}
        </Heading>
      ),
    })}
    remarkPlugins={[remarkGfm]}
    children={children}
    skipHtml
  />
)
