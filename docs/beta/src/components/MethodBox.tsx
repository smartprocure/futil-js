import {
  Box,
  Code,
  Flex,
  Heading,
  HStack,
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
  useDimensions
} from '@chakra-ui/react'
import React from 'react'
import { Doc } from '../types/Doc'
import { Badges } from './Badges'
import { Markdown } from './Markdown'
import { CodeSnippet } from './CodeSnippet'

let headerHeight = 75

export let MethodBox = ({ doc }: { doc: Doc }) => {
  const replParent = React.useRef(null)
  const dimension = useDimensions(replParent, true) //deprecated, but documentation for the replacement is non existent atm.
return (
  <Box
   
    id={`${doc.name}-method`}
    scrollMarginTop={headerHeight}
    p={[1, 8]}
    rounded="md"
    bg={useColorModeValue('white', 'gray.800')}
  >
    <VStack spacing={4} align="stretch">
    <Grid templateColumns='repeat(12, 1fr)' gap={6} >
      <GridItem colSpan={12} rowStart={1} colStart={1}>
            <Flex >
              <Box>
                <Heading  size="md" fontFamily="'Fira Code', monospace">
                  F.{doc.name}
                </Heading>
              </Box>
              <Spacer/> 
              <Box >
                <Badges  badges={doc.tags} />
              </Box>
            </Flex>
      </GridItem>
       
      <GridItem   colStart={[0, 0, 0, 5]} colSpan={[12, 12, 12, 6]} rowStart={[2, 2, 2, 1]} alignItems={'flex-end'}>
        <Code>{doc.signature}</Code>
      </GridItem>
    </Grid>
      <Box>
        <Markdown>{doc.description}</Markdown>
      </Box>
      <Tabs ref={replParent}> 
        <TabList>
          {doc.example && <Tab>Example</Tab>}
          {doc.tests && <Tab >Tests</Tab>}
          {doc.source && <Tab>Source</Tab>}
        </TabList>
        <TabPanels >
          {doc.example && (
            <TabPanel px={0}>
              <CodeSnippet>{doc.example}</CodeSnippet>
            </TabPanel>
          )}
          {doc.tests && (
            <TabPanel  px={0}>
              <CodeSnippet parentWidth={`${dimension ? dimension.borderBox.width-200:0}px`}>{doc.tests}</CodeSnippet>
            </TabPanel>
          )}
          {doc.source && (
            <TabPanel  px={0}>
              <CodeSnippet noRepl>{doc.source}</CodeSnippet>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </VStack>
  </Box>
)}
