import * as React from 'react'
import _ from 'lodash/fp'
import {
  Grid,
  GridItem,
  Icon,
  useDisclosure,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Tooltip,
  InputGroup,
  InputLeftElement,
  InputLeftAddon,
  InputRightAddon,
  Input,
  Image,
  useColorModeValue,
  Center
} from '@chakra-ui/react'
import { AiOutlineFunction } from 'react-icons/ai'
import LogoLight from '../../logos/logo-light.svg'
import LogoDark from '../../logos/logo-dark.svg'

import { ToolTipLabel } from  './ToolTipLabel'
import {
  BsChevronCompactLeft,
  BsChevronCompactRight,
} from 'react-icons/bs'
import { GiMagnifyingGlass } from 'react-icons/gi'
import { FaSearch } from 'react-icons/fa'


export let NavBarButton = ({ sidebar, dispatch, state }) => {
   
    let ref = React.useRef(null)
    let toolTipInOut = { heading: `What was that method? Let's find it!` , 
                        content: `Sometimes you know a method exists but not what it's called. Use this to 
                                find all the methods that match an expected input and output!`}
    let toolTipName = { heading: `Looking for a specific method?`, 
                        content: `Search for methods by name or description.`}

    let { isOpen, onOpen, onClose, onToggle } = useDisclosure({defaultIsOpen: false})
  
    return (
      <GridItem  colSpan={1}>
        <Button
          
          aria-label="Main Navigation"
          variant="ghost"
          onClick={() => {dispatch({page: 'docs'}); onToggle()}}
          leftIcon={<Icon as={FaSearch} />}
          iconSpacing={0}
          width={`10px`}
          sx={{ paddingBottom: [0,1], borderRadius: 'full', lineHeight: 0 }}
        />
        <Drawer
          placement="right"
          isOpen={isOpen}
          onClose={onClose}
          closeOnOverlayClick={false}
          colorScheme="neutral"
          size="full"
          initialFocusRef={sidebar}
          finalFocusRef={sidebar}
        >
          <DrawerOverlay  zIndex={15}>
            <DrawerContent >
              <DrawerCloseButton zIndex={200} colorScheme="neutral" />
              <DrawerBody bg={useColorModeValue('gray.100', 'rgb(25,32,44)')} >
                <Grid 
                      templateRows={"repeat(2, 1fr)"}
                      templateColumns={"repeat(1, 1fr)"}
                      justifyContent="center"
                      height={'40px'}
                      rowGap={3}
                      columnGap={0}
                      gridColumnGap={0} 
                  >
                  <GridItem py={3} colSpan={1} px={"inherit"}>
                      <Center>
                        <Image alignContent={'center'} height={45} paddingBottom={1} src ={useColorModeValue(LogoLight, LogoDark)} />
                      </Center>
                     
                  </GridItem>
                 
                  <GridItem  paddingTop={5} colSpan={1} px={"inherit"}>
                    <Tooltip hasArrow label={<ToolTipLabel {...toolTipName} />}>
                      <InputGroup  >
                        <InputLeftElement>
                          <AiOutlineFunction />
                        </InputLeftElement>
                        <Input
                          border={"none"}
                          bg={useColorModeValue("inputBack.light","inputBack.dark")}
                          name="nameSearchInput"
                          type="text"
                          placeholder="Name"
                          value={state.search}
                          onChange={(e) => dispatch({ search: e.target.value })}
                          
                        />
                      </InputGroup>
                    </Tooltip>
                  </GridItem>
                  {/* <hr/> */}
                  <GridItem  colSpan={1} px={"inherit"}>
                    <Tooltip  hasArrow label={<ToolTipLabel {...toolTipInOut} />}>
                      <InputGroup >
                        <InputLeftAddon
                            bg={useColorModeValue("icon.light","icon.dark")} 
                            w={'50px'}>
                          <BsChevronCompactLeft />
                        </InputLeftAddon>
                        <Input
                          border={"none"}
                          bg={useColorModeValue("inputBack.light","inputBack.dark")}
                          type="Heading"
                          placeholder="Input (e.g. x => x * 2, [1, 2])"
                          value={state.input}
                   
                          onChange={(e) => dispatch({ input: e.target.value })}
                        />
                        <InputRightAddon   
                            bg={useColorModeValue("icon.light","icon.dark")} 
                            w={'50px'}>
                          <BsChevronCompactRight />
                        </InputRightAddon>
                      </InputGroup>
                    </Tooltip>
                  </GridItem>
                  <GridItem colSpan={1} px={"inherit"}>
                    <Tooltip hasArrow label={<ToolTipLabel {...toolTipInOut} />}>
                      <InputGroup >
                        <InputLeftAddon  
                          bg={useColorModeValue("icon.light","icon.dark")} 
                          w={'50px'}>
                            =
                        </InputLeftAddon>
                        <Input
                          border={"none"}
                          bg={useColorModeValue("inputBack.light","inputBack.dark")}
                          type="text"
                          placeholder="Output (e.g. [2, 4])"
                          value={state.ouput}
                          onChange={(e) => dispatch({ output: e.target.value })}
                        />
                      </InputGroup>
                    </Tooltip>
                  </GridItem>
                  <GridItem  paddingTop={5} onClick={onClose} >
                    {sidebar}
                  </GridItem>
                </Grid>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
     </GridItem>
    )
  }