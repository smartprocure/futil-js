import { memo } from 'react'
import {
  Code,
  Container,
  Heading,
  Text,
  VStack,
  Box,
  useColorModeValue,
  Image,
  Button,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import { CodeSnippet } from './CodeSnippet'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import LogoDark from '../logos/logo-dark.svg'

type BadgeProps = {
  src: string
  alt: string
  href?: string
}
let Badge = ({ src, alt, href }: BadgeProps) => {
  let style = { marginRight: '5px', display: 'inline-block' }
  let image = <img {...{ src, alt, style }} />
  return href ? <a href={href}>{image}</a> : image
}
let Badges = () => (
  <Box>
    <Badge
      href="https://badge.fury.io/js/futil-js"
      src="https://badge.fury.io/js/futil-js.svg"
      alt="npm version"
    />
    <Badge
      href="https://coveralls.io/github/smartprocure/futil-js?branch=master"
      src="https://coveralls.io/repos/github/smartprocure/futil-js/badge.svg?branch=master"
      alt="Coverage Status"
    />
    <Badge
      href="https://github.com/prettier/prettier"
      src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"
      alt="code style: prettier"
    />
    <Badge
      href="https://npm.runkit.com/futil-js"
      src="https://badge.runkitcdn.com/futil-js.svg"
      alt="Try futil-js on RunKit"
    />
  </Box>
)

let Logo = () => (
  // both light and dark modes are a dark background, so no need for color value
  // <Image py={4} width={200} src={useColorModeValue(LogoLight, LogoDark)} />
  <Image width={200} src={LogoDark} mb={8} />
)

// let green = 'linear(to-r, #39b54a, #8dc63f)'
// let blue = 'linear(to-r, #27aae1, #1c75bc)'
// let blue = 'linear(to-r, #1c75bc, #27aae1)'
let gray = 'linear(to-b, gray.900, gray.700)'
let lightGray = 'linear(225deg, gray.700, gray.900)'
let Summary = ({ dispatch }) => (
  <Box bgGradient={useColorModeValue(lightGray, gray)} w="100%" p={5} py={20}>
    <Container maxW="4xl" color="#fff">
      <VStack spacing={4} alignItems="stretch">
        <Logo />
        <Badges />
        <Text>
          A collection of <b>F</b>unctional <b>Util</b>ities. Resistance is{' '}
          <b>futil</b>e.
        </Text>
        <Text>
          Mostly, these are generic utilities that could conceivably be part of
          a library like <Code>lodash/fp</Code>, but for some reason or other
          are not.
        </Text>
        <Text>
          Designed to work with any other utility library. <Code>lodash</Code>{' '}
          and <Code>ramda</Code> work great. <Code>lodash/fp</Code> works best.
        </Text>
        <Flex my={8} alignItems="center">
          <Spacer />
          <Button
            bg="linear-gradient(90deg, #39b54a, #8dc63f)"
            _hover={{
              bg: 'linear-gradient(90deg, #39b54a 30%, #8dc63f 100%)',
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            transition="transform 0.1s ease 0s, box-shadow 0.1s ease 0s, background-color 0.1s ease 0s"
            size="md"
            display="block"
            onClick={() => dispatch({ page: 'docs' })}
          >
            Documentation
          </Button>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Spacer />
        </Flex>
        <CodeSnippet forceDark language="shell" noRepl>{`$ npm i futil
# or
$ yarn add futil`}</CodeSnippet>
        <Text>
          This package requires <Code>lodash/fp</Code>, so make sure it is
          available in your app.
        </Text>
        <CodeSnippet forceDark noRepl>
          {`// Load entire library
import F from 'futil'
import * as F from 'futil'
// Load specific methods
import { x, y, z } from 'futil'`}
        </CodeSnippet>

        <CodeSnippet forceDark>
          {`F.compactObject({ a: 1, b: null, c: 3})
// => { a: 1, c: 3 }

F.flattenObject({ a: 1, b: { x: 10, y: 11 }, c: 3})
// => { a: 1, 'b.x': 10, 'b.y': 11, c: 3 }

F.unflattenObject({ a: 1, 'b.x': 10, 'b.y': 11, c: 3 })
// => { a: 1, b: { x: 10, y: 11 }, c: 3}`}
        </CodeSnippet>
      </VStack>
    </Container>
  </Box>
)

let BrowserCoverage = () => (
  <Box>
    <a href="https://saucelabs.com/u/futil">
      <img
        style={{ background: 'white' }}
        src="https://saucelabs.com/browser-matrix/futil.svg"
        alt="Sauce Test Status"
      />
    </a>
  </Box>
)

export default memo(({ dispatch }: { dispatch: (any) => {} }) => (
  <>
    <Summary dispatch={dispatch} />
    <Box
      minH="500"
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      p={16}
    >
      <Container maxW="4xl">
        <VStack spacing={4} alignItems="stretch">
          <Heading>Support</Heading>
          <BrowserCoverage />
          <Heading pt={8}>Why futil?</Heading>
          <Text>
            Designed to work with any other utility library. <Code>lodash</Code>{' '}
            and <Code>ramda</Code> work great. <Code>lodash/fp</Code> works
            best.
          </Text>
        </VStack>
      </Container>
    </Box>
    <Box
      bg={useColorModeValue('gray.100', 'gray.800')}
      color={useColorModeValue('gray.500', 'gray.500')}
    >
      <Container maxW="4xl" py={10} textAlign="center">
        Brought to you by the SmartProcure/GovSpend team
      </Container>
    </Box>
  </>
))
