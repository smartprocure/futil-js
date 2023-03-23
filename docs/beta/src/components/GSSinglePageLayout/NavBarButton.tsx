import * as React from 'react'
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
  Image,
  useColorModeValue,
  Center,
  Flex,
} from '@chakra-ui/react'
import LogoLight from '../../logos/logo-light.svg'
import LogoDark from '../../logos/logo-dark.svg'
import { FaSearch } from 'react-icons/fa'
import { SearchInputs } from '../header/SearchInputs'

//Content for tool tips
const toolTipInOut = {
  heading: `What was that method? Let's find it!`,
  content: `Sometimes you know a method exists but not what it's called. Use this to 
        find all the methods that match an expected input and output!`,
}
const toolTipName = {
  heading: `Looking for a specific method?`,
  content: `Search for methods by name or description.`,
}

export let NavBarButton = ({ sidebar, dispatch, state, responsive }) => {
  let { isOpen, onClose, onToggle } = useDisclosure({
    defaultIsOpen: false,
  })
  return (
    <GridItem colSpan={1}>
      <Button
        aria-label="Main Navigation"
        variant="ghost"
        onClick={() => {
          dispatch({ page: 'docs' })
          onToggle()
        }}
        leftIcon={<Icon as={FaSearch} />}
        iconSpacing={0}
        width={`10px`}
        sx={{ borderRadius: 'full', lineHeight: 0 }}
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
        <DrawerOverlay zIndex={15}>
          <DrawerContent>
            <DrawerCloseButton zIndex={200} colorScheme="neutral" />
            <DrawerBody bg={useColorModeValue('gray.100', 'rgb(25,32,44)')}>
              <Grid
                templateRows={'repeat(2, 1fr)'}
                templateColumns={'repeat(1, 1fr)'}
                justifyContent="center"
                height={'40px'}
                rowGap={3}
                columnGap={0}
                gridColumnGap={0}
                paddingRight={1}
              >
                <GridItem py={3} colSpan={1} px={'inherit'}>
                  <Center>
                    <Image
                      alignContent={'center'}
                      height={45}
                      paddingBottom={1}
                      src={useColorModeValue(LogoLight, LogoDark)}
                    />
                  </Center>
                </GridItem>
                <GridItem paddingTop={5} colSpan={1} px={'inherit'}>
                  <Flex direction={'column'} gap={1.5} alignItems="center">
                    <SearchInputs
                      {...state}
                      dispatch={dispatch}
                      toolTipName={toolTipName}
                      toolTipInOut={toolTipInOut}
                      responsive={responsive}
                    />
                  </Flex>
                </GridItem>
                <GridItem paddingTop={5} onClick={onClose}>
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
