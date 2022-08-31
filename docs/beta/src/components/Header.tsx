import _ from 'lodash/fp'
import {
  chakra,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  Link,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import {
  BsChevronCompactLeft,
  BsChevronCompactRight,
  BsJournalCode,
} from 'react-icons/bs'
import { FiGitPullRequest } from 'react-icons/fi'
import { AiFillGithub, AiOutlineFunction, AiOutlineHome } from 'react-icons/ai'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import LogoLight from '../logos/logo-light.svg'
import LogoDark from '../logos/logo-dark.svg'

let WWTMTooltip = () => (
  <VStack alignItems="flex-start" p={2} spacing={4}>
    <Heading size="sm">What was that method? Let's find it!</Heading>
    <Text>
      Sometimes you know a method exists but not what it's called. Use this to
      find all the methods that match an expected input and output!
    </Text>
  </VStack>
)
let NameTooltip = () => (
  <VStack alignItems="flex-start" p={2} spacing={4}>
    <Heading size="sm">Looking for a specific method?</Heading>
    <Text>Search for methods by name or description.</Text>
  </VStack>
)

let NavIcon = ({ name, icon, page, dispatch }) => (
  <Tooltip hasArrow label={_.startCase(name)}>
    <IconButton
      size="md"
      fontSize="lg"
      variant={page == name ? 'solid' : 'ghost'}
      onClick={() => dispatch({ page: name })}
      icon={icon}
      aria-label={_.startCase(name)}
    />
  </Tooltip>
)

export let PageHeader = ({ search, input, output, page, dispatch }) => (
  <chakra.header
    position="fixed"
    w="100%"
    borderBottom="solid 1px"
    // dark moder border is divider color
    borderColor={useColorModeValue('gray.200', 'rgba(255, 255, 255, 0.16)')}
    zIndex={10}
  >
    <Grid
      templateColumns="150px 1fr 225px"
      bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'gray.800')}
      backdropFilter="saturate(180%) blur(5px)"
      py={4}
      px={8}
    >
      <HStack onClick={() => dispatch({ page: 'home' })} cursor="pointer">
        <Image height={45} src ={useColorModeValue(LogoLight, LogoDark)} />
      </HStack>
      <HStack justifyContent="center">
        <Tooltip hasArrow label={<NameTooltip />}>
          <InputGroup width="auto">
            <InputLeftElement>
              <AiOutlineFunction />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Name"
              value={search}
              onChange={(e) => dispatch({ search: e.target.value })}
              w="250px"
            />
          </InputGroup>
        </Tooltip>
        <Tooltip hasArrow label={<WWTMTooltip />}>
          <InputGroup width="auto">
            <InputLeftAddon>
              <BsChevronCompactLeft />
            </InputLeftAddon>
            <Input
              type="Heading"
              placeholder="Input (e.g. x => x * 2, [1, 2])"
              value={input}
              onChange={(e) => dispatch({ input: e.target.value })}
              w="250px"
            />
            <InputRightAddon>
              <BsChevronCompactRight />
            </InputRightAddon>
          </InputGroup>
        </Tooltip>
        <Tooltip hasArrow label={<WWTMTooltip />}>
          <InputGroup width="auto">
            <InputLeftAddon>{/* <BsArrowRight /> */}=</InputLeftAddon>
            <Input
              type="text"
              placeholder="Output (e.g. [2, 4])"
              value={output}
              onChange={(e) => dispatch({ output: e.target.value })}
              w="250px"
            />
          </InputGroup>
        </Tooltip>
      </HStack>
      <HStack justifyContent="flex-end">
        <NavIcon name="home" icon={<AiOutlineHome />} {...{ page, dispatch }} />
        <NavIcon name="docs" icon={<BsJournalCode />} {...{ page, dispatch }} />
        <NavIcon
          name="changelog"
          icon={<FiGitPullRequest />}
          {...{ page, dispatch }}
        />
        <Link isExternal href="https://github.com/smartprocure/futil-js">
          <IconButton
            size="md"
            fontSize="lg"
            variant="ghost"
            icon={<AiFillGithub />}
            aria-label="Go to futil GitHub page"
          />
        </Link>
        <ColorModeSwitcher justifySelf="flex-end" />
      </HStack>
    </Grid>
  </chakra.header>
)
