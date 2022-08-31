import * as React from 'react'
import _ from 'lodash/fp'
import {
  Box,
  ChakraProvider,
  extendTheme,
  Grid,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
let theme = extendTheme({
  fonts: {
    heading: 'Lato, system-ui, sans-serif',
    body: 'Lato, system-ui, sans-serif',
  },
})

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
    </ChakraProvider>
  )
}
