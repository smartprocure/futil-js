import * as React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import {
  Divider,
  Flex,
  Link,
  useColorModeValue,
  VStack,
  useDimensions,
} from '@chakra-ui/react'
import { Doc } from '../types/Doc'
import { filterDocs } from '../utils/filterDocs'
import { scrollToMethod } from '../utils/scroll'
import { TextHighlight } from './TextHighlight'
import { Badges } from './Badges'

let headerHeight = 75

type SidebarProps = {
  docs: Doc[]
  search: string
  input: string
  output: string
}

export let Sidebar = ({ docs, search, input, output }: SidebarProps) => {
  const sideBarRef = React.useRef(null)
  /* deprecated: but documentation for the replacement is non existent atm.
     purpose: grabs updated sizes of reference
     needed: The gradient is not responsive and requires a value be set for width
  */
  const dimension = useDimensions(sideBarRef, true) //deprecated, but documentation for the replacement is non existent atm.

  return (
    <VStack
      ref={sideBarRef}
      pos="sticky"
      top={headerHeight}
      overflow="scroll"
      h="100vh"
      px={8}
      py={4}
      borderRight={[
        'none',
        'none',
        `solid 1px ${useColorModeValue(
          'gray.200',
          'rgba(255, 255, 255, 0.16)'
        )}`,
      ]}
      spacing={4}
      _before={{
        pointerEvents: 'none',
        position: 'fixed',
        content: '""',
        display: 'block',
        left: '0px',
        bottom: '0px',
        width: `${dimension?.borderBox.width}px`, //Needed to make the gradient fit the sidebar
        height: '25%', // arbitrary height
        background: useColorModeValue(
          // linear gradient from 0-100 opacity of bg color
          'linear-gradient(0deg, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0) 100%)',
          // rgb values for dark body bg
          'linear-gradient(0deg, rgba(26, 32, 44, 0.8) 30%, rgba(26, 32, 44, 0) 100%)'
        ),
        transition: 'opacity 1s ease 0s',
      }}
      _hover={{ _before: { opacity: 0 } }}
    >
      {F.mapIndexed(
        (doc, i) => (
          <React.Fragment key={`${doc.name}-sidebar`}>
            {i !== 0 &&
              _.map(
                (tag) => (
                  <React.Fragment key={tag}>
                    <Divider />
                  </React.Fragment>
                ),
                doc.unseenTags
              )}
            <Flex alignItems="center" justifyContent="space-between" w="100%">
              <Link
                href={
                  doc.lib === '_'
                    ? `https://lodash.com/docs/4.17.15#${doc.name}`
                    : doc.lib === 'R'
                    ? `https://ramdajs.com/docs/#${doc.name}`
                    : `#${doc.name}`
                }
                isExternal={!!doc.lib}
                onClick={() => !doc.lib && scrollToMethod(doc.name)}
                fontFamily="'Fira Code', monospace"
              >
                <TextHighlight
                  pattern={search}
                  text={`${doc.lib || 'F'}.${doc.name}`}
                />
                {/* Our TextHighlight seems more performant than Chakra's */}
                {/* <Highlight query={search} styles={{ bg: search ? 'mark' : 'transparent' }}>{`${
                doc.lib || 'F'
              }.${doc.name}`}</Highlight> */}
              </Link>
              <Badges badges={doc.tags} />
            </Flex>
          </React.Fragment>
        ),
        filterDocs(search, input, output, docs)
      )}
    </VStack>
  )
}
