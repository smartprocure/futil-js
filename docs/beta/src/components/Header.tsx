import _ from 'lodash/fp'
import {
  chakra,
  Grid,
  GridItem,
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
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Box,
  Spacer,
  Flex
  
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
import {ToolTipLabel} from './GSSinglePageLayout/ToolTipLabel'
import { head } from 'lodash'
import { CgMenu } from 'react-icons/cg'
import { FaSearch } from 'react-icons/fa'
import React from 'react'



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

let NavIcon = ({ name, icon, page, dispatch }) => {
let highlight = useColorModeValue('icon.light', 'icon.dark');

return (
  <Box width={"100%"} onClick={() => dispatch({ page: name })}>
    <HStack width={"100%"} p={0}  rounded={6} bg={page === name ? highlight: 'inherit'}>
        <Tooltip hasArrow label={_.startCase(name)}>
          <IconButton
            size="md"
            fontSize="lg"
            variant="ghost"
            icon={icon}
            aria-label={_.startCase(name)}
          />
        </Tooltip>
        <Text display={['inherit', 'inherit', 'inherit', 'none']} fontSize={'md'}>{_.startCase(name)}</Text> 
    </HStack>
  </Box>
 
)}

let navIcons = ({page, dispatch, showLabels}) => (
  <>
    <HStack>
      <NavIcon name="home" icon={<AiOutlineHome />} {...{ page, dispatch }} />
    </HStack>
    <HStack>
      <NavIcon name="docs" icon={<BsJournalCode />} {...{ page, dispatch }} />
    </HStack>
    <HStack>
      <NavIcon
          name="changelog"
          icon={<FiGitPullRequest />}
          {...{ page, dispatch }}
      />  
    </HStack>
    <HStack>
      <Link isExternal href="https://github.com/smartprocure/futil-js" w={"100%"}>
        <HStack>
          <IconButton
              size="md"
              fontSize="lg"
              variant="ghost"
              icon={<AiFillGithub />}
              aria-label="Go to futil GitHub page"
            />
          <Text display={['inherit', 'inherit', 'inherit', 'none']} align={'center'} fontSize={'md'}>GitHub</Text>
        </HStack>
      </Link>
    </HStack>
    <HStack>
      <ColorModeSwitcher marginX={0} title={"Dark/Light Toggle"}/>
    </HStack>
  </>
)



export let PageHeader = ({ search, input, output, page, dispatch }) => {
  let toolTipInOut = { heading: `What was that method? Let's find it!` , 
  content: `Sometimes you know a method exists but not what it's called. Use this to 
          find all the methods that match an expected input and output!`}
  let toolTipName = { heading: `Looking for a specific method?`, 
    content: `Search for methods by name or description.`}
return (
  <>
    <Box>
      <HStack onClick={() => dispatch({ page: 'home' })} cursor="pointer">
        <Image height={45} paddingBottom={1} src ={useColorModeValue(LogoLight, LogoDark)} />
      </HStack>
    </Box>
    <Spacer/>
    {/* <GridItem colSpan={1} display={['none', 'inherit']}> */}
    <Box display={{base: "none", md: "inherit"}}>
      <HStack paddingX={5} justifyContent="center">
        <Tooltip hasArrow label={<ToolTipLabel {...toolTipName} />}>
          <InputGroup w={[0, 'auto']}>
            <InputLeftElement>
              <AiOutlineFunction />
            </InputLeftElement>
            <Input
              borderColor={useColorModeValue('icon.light', 'icon.dark')} 
              bg={useColorModeValue("inputBack.light","inputBack.dark")}
              w={[0, 0, '100%' , '100%']}
              type="text"
              placeholder="Name"
              value={search}
              onChange={(e) => dispatch({ search: e.target.value })}
              
            />
          </InputGroup>
        </Tooltip>
        <Tooltip hasArrow label={<ToolTipLabel {...toolTipInOut} />}>
          <InputGroup  w={[0, 'auto']}>
            <InputLeftAddon 
              bg={useColorModeValue("icon.light","icon.dark")} 
              w={'50px'}
              >
              <BsChevronCompactLeft />
            </InputLeftAddon>
            <Input
              border={'0.5px solid'} borderColor={useColorModeValue('icon.light', 'icon.dark')}
              bg={useColorModeValue("inputBack.light","inputBack.dark")}
              type="Heading"
              placeholder="Input (e.g. x => x * 2, [1, 2])"
              value={input}
              onChange={(e) => dispatch({ input: e.target.value })}
              w={[0, 0, '100%' , '100%']}
            />
            <InputRightAddon   
              bg={useColorModeValue("icon.light","icon.dark")} 
              w={'50px'}>
              <BsChevronCompactRight />
            </InputRightAddon>
          </InputGroup>
        </Tooltip>
        <Tooltip hasArrow label={<ToolTipLabel {...toolTipInOut} />}>
          <InputGroup  w={[0, 'auto']}>
            <InputLeftAddon 
              bg={useColorModeValue("icon.light","icon.dark")} 
              w={'50px'}>
              =</InputLeftAddon>
            <Input
              border={'0.5px solid'} borderColor={useColorModeValue('icon.light', 'icon.dark')}
              bg={useColorModeValue("inputBack.light","inputBack.dark")}
              type="text"
              placeholder="Output (e.g. [2, 4])"
              value={output}
              onChange={(e) => dispatch({ output: e.target.value })}
              w={[0, 0, '100%', '100%']}
            />
          </InputGroup>
        </Tooltip>
      </HStack>
    </Box>
    <Spacer/>
    {/* <GridItem display={["inherit", "none"]} colSpan={1}/> */}
    <Box>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label='Options'
          icon={<CgMenu size={30} color="rgb(57,64,76)"/>}
          variant='ghost'
          marginTop={0}
          px={0}
          mx={0}
          width="100%"
          display={{base:'flex', lg: 'none'}}
        />
          <MenuList>
            <MenuItem>
                <Flex direction={'column'} w={"100%"}>
                  {navIcons({page, dispatch, showLabels: true})}
                </Flex>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Flex display={{base:'none', lg: 'flex'}} direction={'row'}>
        {navIcons({page, dispatch, showLabels: false})}
      </Flex>

    <GridItem  colSpan={1}>
      
    </GridItem>
  </>
)
}