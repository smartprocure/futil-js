import { Box, 
    chakra, 
    Flex, 
    Grid, 
    GridItem,
     HStack, 
     useColorModeValue, 
     VStack 
} from "@chakra-ui/react";
import React from "react";
import { NavBarButton } from "./NavBarButton";

export let ResponsiveBasicLayout = ({header, sidebar, main, dispatch, state, responsive}) => (
    <>
      <chakra.header
        bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'gray.800')}
        backdropFilter="saturate(180%) blur(5px)"
        position="fixed"
        zIndex={10}
        borderBottom = "solid 1px"
        borderColor={useColorModeValue('gray.200', 'rgba(255, 255, 255, 0.16)')}
        width={"100%"}
        px={6}
        py={4}
        >
        <Flex as="header" >
          {header}
          {state.page !== "home" && 
            <GridItem display={responsive.headerResponsive.nav.showMobileFilter} colSpan={1}>
              <HStack>
                <VStack paddingBottom={'1'}>
                    <NavBarButton sidebar={sidebar} dispatch={dispatch} state={state} responsive={responsive.headerResponsive}/>
                </VStack>
              </HStack>
            </GridItem>
          }
        </Flex>
      </chakra.header>
      {sidebar.type === React.Fragment ? 
        <Box p={5} >{main}</Box> 
        : 
        <Grid templateColumns={"repeat(12, 1fr)"}>
          <GridItem {...responsive.sidebarResponsive.showDesktopBar}>
            {sidebar}
          </GridItem> 
          <GridItem colSpan={responsive.mainContentResponsive.resizeMainContent}>
            {main}
          </GridItem>
        </Grid>
      }
    </>
  )