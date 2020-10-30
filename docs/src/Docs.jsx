import React from 'react'
import _ from 'lodash/fp.js'
import { Box, Flex, Stack } from '@chakra-ui/core'
import Card from './Card.jsx'

export default props => (
  <Flex {...props}>
    <Card flexBasis="xs" mr={2} height="100%">
      Sidebar
    </Card>
    <Box flexGrow={1} height="100%" overflowY="scroll" minW={40}>
      {_.times(
        i => (
          <Card key={i} h={40} mb={2} />
        ),
        10
      )}
    </Box>
  </Flex>
)
