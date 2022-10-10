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
} from "@chakra-ui/react"
import { Doc } from "../types/Doc"
import { Badges } from "./Badges"
import { Markdown } from "./Markdown"
import { CodeSnippet } from "./CodeSnippet"

let headerHeight = 75

export let MethodBox = ({ doc }: { doc: Doc }) => (
  <Box
    id={`${doc.name}-method`}
    scrollMarginTop={headerHeight}
    p={8}
    rounded="md"
    bg={useColorModeValue("white", "gray.800")}
  >
    <VStack spacing={4} align="stretch">
      <Flex alignItems="center" justifyContent="space-between">
        <HStack>
          <Heading size="md" fontFamily="'Fira Code', monospace">
            F.{doc.name}
          </Heading>
          <Code>{doc.signature}</Code>
        </HStack>
        <Badges badges={doc.tags} />
      </Flex>
      {/* {doc.arguments && (
          <TableContainer >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Type</Th>
                  <Th>Description</Th>
                </Tr>
              </Thead>
              <Tbody>
                {_.map(
                  arg => (
                    <Tr>
                      <Td>{arg.name}</Td>
                      <Td>{arg.type}</Td>
                      <Td>{arg.description}</Td>
                    </Tr>
                  ),
                  doc.arguments
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )} */}
      <Box>
        <Markdown>{doc.description}</Markdown>
      </Box>
      <Tabs>
        <TabList>
          {doc.tests && <Tab>Example</Tab>}
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
              <CodeSnippet>{doc.tests}</CodeSnippet>
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
