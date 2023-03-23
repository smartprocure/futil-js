import { VStack, Heading, Text } from '@chakra-ui/react'

export let ToolTipLabel = ({ heading, content }) => (
  <VStack alignItems="flex-start" p={2} spacing={4}>
    <Heading size="sm">{heading}</Heading>
    <Text>{content}</Text>
  </VStack>
)
