import * as React from "react"
import _ from "lodash/fp"
import {
  Box,
  ChakraProvider,
  extendTheme,
  Grid,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { setupHashScroll } from "./utils/scroll"
import { Doc } from "./types/Doc"

// Components
import Home from "./components/Home"
import { PageHeader } from "./components/Header"
import { Changelog } from "./components/Changelog"
import { TagDocs } from "./components/TagDocs"
import { MethodBox } from "./components/MethodBox"
import { Sidebar } from "./components/Sidebar"

// Data
import docs from "./data/docs.json"
import tagDocs from "./data/tag-docs.json"
import tests from "./data/tests.json"

// Stamp tests on docs
_.each((doc) => {
  doc.tests = tests[doc.name]
}, docs as Doc[])

let theme = extendTheme({
  fonts: {
    heading: "Lato, system-ui, sans-serif",
    body: "Lato, system-ui, sans-serif",
  },
})

let headerHeight = 75

let MainContent = React.memo(() => (
  <Box bg={useColorModeValue("gray.100", "gray.700")}>
    <VStack spacing={8} mt={headerHeight} p={8} align="stretch">
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
))

let initialState = { input: "", output: "", search: "", page: "docs" }
export const App = () => {
  React.useEffect(setupHashScroll, [])
  let [state, dispatch]: any = React.useReducer(_.merge, initialState)
  let { page } = state
  return (
    <ChakraProvider theme={theme}>
      {page !== "home" && <PageHeader {...state} dispatch={dispatch} />}
      {/* 400 is arbitrary */}
      {page === "docs" && (
        <Grid templateColumns="400px minmax(0, 1fr)">
          <Sidebar docs={docs} {...state} />
          <MainContent />
        </Grid>
      )}
      {page === "changelog" && (
        <Box pt={75}>
          <Changelog />
        </Box>
      )}
      {page === "home" && <Home dispatch={dispatch} />}
    </ChakraProvider>
  )
}
