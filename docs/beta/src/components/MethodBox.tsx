import {
  Box,
  Code,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  VStack,
  Spacer,
  GridItem,
  Grid,
  useDimensions,
} from '@chakra-ui/react'
import React from 'react'
import { Doc } from '../types/Doc'
import { Badges } from './Badges'
import { Markdown } from './Markdown'
import { CodeSnippet } from './CodeSnippet'

let headerHeight = 75

export let MethodBox = ({
  doc,
  responsive,
}: {
  doc: Doc
  responsive: Object
}) => {
  const replParent = React.useRef(null)
  /* deprecated: but documentation for the replacement is non existent atm.
     purpose: grabs updated sizes of reference
     needed: for ensuring the Iframe displays properly
  */
  const replDimensions = useDimensions(replParent, true)

  return (
    <Box
      id={`${doc.name}-method`}
      scrollMarginTop={headerHeight}
      p={responsive['main'].padding}
      rounded="md"
      bg={useColorModeValue('contentBack.light', 'contentBack.dark')}
    >
      <VStack spacing={4} align="stretch">
        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
          <GridItem colSpan={12} rowStart={1} colStart={1}>
            <Flex>
              <Box>
                <Heading size="md">F.{doc.name}</Heading>
              </Box>
              <Spacer />
              <Box>
                <Badges badges={doc.tags} />
              </Box>
            </Flex>
          </GridItem>
          <GridItem {...responsive['signature'].styling}>
            <Code>{doc.signature}</Code>
          </GridItem>
        </Grid>
        <Box>
          <Markdown>{doc.description}</Markdown>
        </Box>
        <Tabs ref={replParent}>
          <TabList>
            {doc.example && <Tab>Example</Tab>}
            {doc.tests && <Tab>Tests</Tab>}
            {doc.source && <Tab>Source</Tab>}
          </TabList>
          <TabPanels>
            {doc.example && (
              <TabPanel px={0}>
                <CodeSnippet>{doc.example}</CodeSnippet>
              </TabPanel>
            )}
            {doc.tests && (
              <TabPanel px={0}>
                {/* replDimensions uses the parent container and adjusts as needed, for the Iframe embedded*/}
                <CodeSnippet
                  parentWidth={`${replDimensions?.borderBox.width}px`}
                >
                  {doc.tests}
                </CodeSnippet>
              </TabPanel>
            )}
            {doc.source && (
              <TabPanel px={0}>
                <CodeSnippet noRepl>{doc.source}</CodeSnippet>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  )
}
