import _ from 'lodash/fp'
import { Badge, HStack } from '@chakra-ui/react'

export let Badges = ({ badges }: { badges: string[] }) => (
  <HStack>
    {_.map(
      (badge) => (
        <Badge key={badge}>{badge}</Badge>
      ),
      badges
    )}
  </HStack>
)
