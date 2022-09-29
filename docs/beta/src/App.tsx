import * as React from 'react'
import _ from 'lodash/fp'
import {
  chakra,
  Box,
  ChakraProvider,
  extendTheme,
  Grid,
  GridItem,
  useColorModeValue,
  VStack,
  HStack,
  useDimensions,
  Flex,
  Spacer
} from '@chakra-ui/react'
import { setupHashScroll } from './utils/scroll'
import { Doc } from './types/Doc'

// Components
import Home from './components/Home'
import { PageHeader } from './components/Header'
import { Changelog } from './components/Changelog'
import { TagDocs } from './components/TagDocs'
import { MethodBox } from './components/MethodBox'
import { Sidebar } from './components/Sidebar'
import { NavBarButton } from './components/GSSinglePageLayout/NavBarButton'

// Data
import docs from './data/docs.json'
import tagDocs from './data/tag-docs.json'
import tests from './data/tests.json'

import { FaSearch } from 'react-icons/fa'

// Stamp tests on docs
_.each((doc) => {
  doc.tests = tests[doc.name]
}, docs as Doc[])

let theme = extendTheme({
  fonts: {
    heading: 'Lato, system-ui, sans-serif',
    body: 'Lato, system-ui, sans-serif',
  },
  colors: {
    icon: {
      dark: '#13161C',
      light: '#D9E1E9'
    },
    inputBack: {
      dark: '#282B35', 
      light: '#E9F0F5'
    },
    headerBack: {
      dark: '#rgba(26, 29, 38, 0.8)',
      light: '#rgba(26, 29, 38, 0.8)'
    }
  }
})
//inputback = 
let headerHeight = 75

let MainContent = React.memo(() => {
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.700')}>
      <VStack spacing={8} mt={headerHeight} marginLeft={['0px', '0px', '0px']}  p={['12px','24px','32px']} align="stretch">
        {_.map(
          (doc) => (
            <React.Fragment key={`${doc.name}-main`}>
              <TagDocs unseenTags={doc.unseenTags} tagDocs={tagDocs} />
              <MethodBox doc={doc} />
            </React.Fragment>
          ),
          docs
        )}
      </VStack>
    </Box>
)})


let ResponsiveBasicLayout = ({header, sidebar, main, dispatch, state}) => {
  // let sideRef = React.useRef(sidebar)
  console.log(sidebar.type)

  return (
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
              <GridItem display={{sm: 'inherit', md: 'none'}} colSpan={1}>
                <HStack>
                  <VStack >
                      <NavBarButton sidebar={sidebar} dispatch={dispatch} state={state}/>
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
        
            <GridItem display={["none", "none", "inherit", "inherit"]} colSpan={[0, 0, 4, 3]}>
              {sidebar}
            </GridItem> 
              
            <GridItem colSpan={[12, 12, 8, 9]}>
              {main}
            </GridItem>
            
          </Grid>
        }
      </>
  
    
  )
}


export let sidebar = (state) => (<Sidebar docs={docs} {...state} />)

let initialState = { input: '', output: '', search: '', isModalSearch: false, page: 'docs' }
export const App = () => {
 
  React.useEffect(setupHashScroll, [])
  let [state, dispatch]: any = React.useReducer(_.merge, initialState)
  let { page } = state
  let pageHeaderRef = (<PageHeader {...state} dispatch={dispatch} />)
  let mainContent = {}
  let sidebar = (<Sidebar docs={docs} {...state}/>)

  if(page === 'docs' || page === 'search') {
    mainContent = (<MainContent/>)
  }else if(page === 'changelog'){
    sidebar = (<></>)
    mainContent = ( 
                    <Box pt={75}>
                      <Changelog />
                    </Box>
                  )
  }else if(page === 'home'){
    sidebar = (<></>)
    pageHeaderRef = (<></>)
    mainContent = (<Home dispatch={dispatch} />)
  }


  return (
    <ChakraProvider theme={theme}>
     
        <>
          <ResponsiveBasicLayout
            header={pageHeaderRef} 
            sidebar={sidebar} 
            main={mainContent}  
            dispatch={dispatch} 
            state={state} 
           />
        </>
    
      {/* {page === 'changelog' && (
        <Box pt={75}>
          <Changelog />
        </Box>
      )}
      {page === 'home' && <Home dispatch={dispatch} />} */}
    </ChakraProvider>
  )
}
