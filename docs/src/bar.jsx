// https://github.com/chakra-ui/chakra-ui/issues/2016
import 'focus-visible/dist/focus-visible'
import _ from 'lodash/fp.js'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  ChakraProvider,
  Icon,
  Link,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Container,
  Box,
  Stack,
  Button,
  IconButton,
} from '@chakra-ui/core'
import { FaGithub } from 'react-icons/fa'
import Markdown from 'markdown-to-jsx'
import README from '../__gen/README.js'
import CHANGELOG from '../__gen/CHANGELOG.js'
import Docs from './Docs.jsx'
import Card from './Card.jsx'

let tabs = (
  <Tabs h="100vh" as={Flex} direction="column">
    <TabList flexShrink={0}>
      <Tab>Documentation</Tab>
      <Tab>Home</Tab>
      <Tab>Changelog</Tab>
      <Link m="auto" mr={4} href="https://github.com/smartprocure/futil-js">
        <Icon as={FaGithub} boxSize={6} />
      </Link>
    </TabList>
    <TabPanels overflowY="scroll" bg="gray.50" h="100%">
      <TabPanel h="100%">
        <Docs h="100%" />
      </TabPanel>
      <TabPanel as={Container} maxW="7xl">
        <Card as={Markdown}>{README}</Card>
      </TabPanel>
      <TabPanel as={Container} maxW="7xl">
        <Card as={Markdown}>{CHANGELOG}</Card>
      </TabPanel>
    </TabPanels>
  </Tabs>
)

let responsiveDefault = (style1, style2) =>
  _.isPlainObject(style2) ? { base: style1, ...style2 } : style2 || style1

let Nav = props => (
  <Box
    sx={{
      ':hover > [role="menu"]': { display: 'flex' },
      '[role="menuitem"]': { p: 4 },
      '[aria-haspopup="menu"]': { p: 4 },
    }}
    {...props}
  />
)

let NavTrigger = props => (
  <Box aria-haspopup="menu" aria-expanded={false} {...props} />
)

let NavContent = ({ display, position, direction, ...props }) => (
  <Flex
    role="menu"
    aria-orientation="vertical"
    display={responsiveDefault('none', display)}
    position={responsiveDefault('absolute', position)}
    direction={responsiveDefault('column', direction)}
    {...props}
  />
)

let NavItem = ({ children, ...props }) => (
  <Box role="menuitem" onClick={() => console.info(children)} {...props}>
    {children}
  </Box>
)

let Navbar = () => (
  <Nav>
    <NavTrigger display={{ md: 'none' }}>
      <Icon as={FaGithub} />
    </NavTrigger>
    <NavContent
      display={{ md: 'flex' }}
      position={{ md: 'static' }}
      direction={{ md: 'row' }}
    >
      <NavItem>News</NavItem>
      <Nav position="relative">
        <NavTrigger>Dropdown</NavTrigger>
        <NavContent position={{ base: 'static', md: 'absolute' }} right={0}>
          <NavItem>Link 1</NavItem>
          <NavItem>Link 2</NavItem>
          <NavItem>Link 3</NavItem>
        </NavContent>
      </Nav>
      <NavItem>About</NavItem>
    </NavContent>
  </Nav>
)

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <Box bg="red.100" sx={{ '*': { border: '1px solid', bg: 'red.100' } }}>
        <Box>
          <Navbar />
        </Box>
        <Box h={500}>
          <Flex justifyContent="center" alignItems="center" h="100%">
            Hey
          </Flex>
        </Box>
      </Box>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
