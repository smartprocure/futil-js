import {
  GridItem,
  HStack,
  IconButton,
  Image,
  useColorModeValue,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Box,
  Spacer,
  Flex,
} from '@chakra-ui/react'
import LogoLight from '../../logos/logo-light.svg'
import LogoDark from '../../logos/logo-dark.svg'
import { CgMenu } from 'react-icons/cg'
import { navIcons } from '../header/NavIcons'
import { SearchInputs } from './SearchInputs'

//Tool tip content to use
const toolTipInOut = {
  heading: `What was that method? Let's find it!`,
  content: `Sometimes you know a method exists but not what it's called. Use this to 
          find all the methods that match an expected input and output!`,
}
const toolTipName = {
  heading: `Looking for a specific method?`,
  content: `Search for methods by name or description.`,
}

export let PageHeader = ({
  search,
  input,
  output,
  page,
  dispatch,
  responsive,
}) => (
  <>
    <Box>
      <HStack onClick={() => dispatch({ page: 'home' })} cursor="pointer">
        <Image
          height={45}
          paddingBottom={1}
          src={useColorModeValue(LogoLight, LogoDark)}
        />
      </HStack>
    </Box>
    <Spacer />
    <Flex direction={'row'} gap={1} display={responsive.nav.showDesktopInputs}>
      {page === 'docs' && (
        <SearchInputs
          input={input}
          output={output}
          search={search}
          toolTipName={toolTipName}
          toolTipInOut={toolTipInOut}
          dispatch={dispatch}
          responsive={responsive}
        />
      )}
    </Flex>
    <Spacer />
    <Box>
      <Menu>
        <MenuButton
          as={IconButton}
          color={useColorModeValue('hamburgerMenu.light', 'hamburgerMenu.dark')}
          aria-label="Options"
          icon={<CgMenu size={30} />}
          variant="ghost"
          marginTop={0}
          px={0}
          mx={0}
          width="100%"
          display={responsive.nav.showHamburgerMenu}
        />
        <MenuList>
          <MenuItem>
            <Flex direction={'column'} w={'100%'}>
              {navIcons({ page, dispatch, responsive })}
            </Flex>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
    <Flex display={responsive.nav.showDesktopIcons} direction={'row'}>
      {navIcons({ page, dispatch, responsive })}
    </Flex>
    <GridItem colSpan={1}></GridItem>
  </>
)
