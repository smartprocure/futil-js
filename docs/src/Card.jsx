import React from 'react'
import { Box } from '@chakra-ui/core'

export default function Card(props) {
  return (
    <Box
      p={2}
      bg="white"
      border="1px"
      borderColor="gray.300"
      borderRadius="sm"
      boxShadow="sm"
      {...props}
    />
  )
}
