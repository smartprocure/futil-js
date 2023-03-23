import * as React from 'react'
import _ from 'lodash/fp'
import {
  Box,
  ChakraProvider,
  extendTheme,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { setupHashScroll } from './utils/scroll'
import { Doc } from './types/Doc'

// Components
import Home from './components/Home'
import { PageHeader } from './components/header/Header'
import { Changelog } from './components/Changelog'
import { TagDocs } from './components/TagDocs'
import { MethodBox } from './components/MethodBox'
import { Sidebar } from './components/Sidebar'

// Data
import docs from './data/docs.json'
import tagDocs from './data/tag-docs.json'
import tests from './data/tests.json'
import { ResponsiveBasicLayout } from './components/GSSinglePageLayout/ResponsiveBasicLayout'

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
      light: '#D9E1E9',
    },
    inputBack: {
      dark: '#282B35',
      light: '#E9F0F5',
    },
    headerBack: {
      dark: '#rgba(26, 29, 38, 0.8)',
      light: '#rgba(26, 29, 38, 0.8)',
    },
    contentBack: {
      dark: '#1A202C',
      light: 'white',
    },
    hamburgerMenu: {
      dark: 'rgb(57,64,76)',
      light: 'rgb(57,64,76)',
    },
  },
  components: {
    Heading: {
      sizes: {
        md: {
          fontFamily: 'Fira Code, monospace',
        },
        lg: {
          fontFamily: 'Fira Code, monospace',
        },
        sm: {
          fontFamily: 'Lato, system-ui, sans-serif',
        },
      },
    },
  },
})
//inputback =
let headerHeight = 75

//Responsive definitions
const functionViewResponsive = {
  main: {
    padding: [1, 8],
  },
  signature: {
    styling: {
      colStart: [0, 0, 0, 5],
      colSpan: [12, 12, 12, 6],
      rowStart: [2, 2, 2, 1],
    },
  },
}
const headerResponsive = {
  nav: {
    iconText: { base: 'inherit', lg: 'none' },
    showMobileFilter: { sm: 'inherit', md: 'none' },
    showHamburgerMenu: { base: 'flex', lg: 'none' },
    showDesktopIcons: { base: 'none', lg: 'flex' },
    showDesktopInputs: { base: 'none', md: 'inherit' },
    showMobileInputs: { base: 'inherit' },
  },
}
const sidebarResponsive = {
  showDesktopBar: {
    display: { base: 'none', md: 'inherit' },
    colSpan: { base: 0, md: 4, lg: 3 },
  },
}
const mainContentResponsive = {
  resizeMainContent: { base: 12, md: 8, lg: 9 },
  padding: { base: '12px', sm: '24px', md: '32px' },
}
const responsiveStyle = {
  mainContentResponsive,
  sidebarResponsive,
  headerResponsive,
  functionViewResponsive,
}

let MainContent = React.memo(() => {
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.700')}>
      <VStack
        spacing={8}
        mt={headerHeight}
        marginLeft={'0px'}
        p={mainContentResponsive.padding}
        align="stretch"
      >
        {_.map(
          (doc) => (
            <React.Fragment key={`${doc.name}-main`}>
              <TagDocs unseenTags={doc.unseenTags} tagDocs={tagDocs} />
              <MethodBox responsive={functionViewResponsive} doc={doc} />
            </React.Fragment>
          ),
          docs
        )}
      </VStack>
    </Box>
  )
})

function getHeaderContent(page, state, dispatch) {
  return page !== 'home' ? (
    <PageHeader
      responsive={headerResponsive}
      {...state}
      dispatch={dispatch}
      page={page}
    />
  ) : (
    false
  )
}

function getMainContent(page, dispatch) {
  let mainContent = {}
  if (page === 'changelog') {
    mainContent = (
      <Box pt={75}>
        <Changelog />
      </Box>
    )
  } else if (['docs', 'search'].includes(page)) {
    mainContent = <MainContent />
  } else if (page === 'home') {
    mainContent = <Home dispatch={dispatch} />
  }
  return mainContent
}

function getSideBarContent(page, state) {
  return ['docs', 'search'].includes(page) === true ? (
    <Sidebar docs={docs} {...state} />
  ) : (
    <></>
  )
}

let initialState = {
  input: '',
  output: '',
  search: '',
  isModalSearch: false,
  page: 'home',
}
export const App = () => {
  React.useEffect(setupHashScroll, [])
  let [state, dispatch]: any = React.useReducer(_.merge, initialState)
  let { page } = state

  return (
    <ChakraProvider theme={theme}>
      <ResponsiveBasicLayout
        header={getHeaderContent(page, state, dispatch)}
        sidebar={getSideBarContent(page, state)}
        main={getMainContent(page, dispatch)}
        dispatch={dispatch}
        state={state}
        responsive={responsiveStyle}
      />
    </ChakraProvider>
  )
}
