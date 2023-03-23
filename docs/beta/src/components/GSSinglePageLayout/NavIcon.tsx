import {
  useColorModeValue,
  HStack,
  Tooltip,
  IconButton,
  Box,
  Text,
  Link,
} from '@chakra-ui/react'
import _ from 'lodash/fp'

let NavType = ({ dispatch, highlight, page, name, icon, responsive }) => (
  <Box w={'100%'} onClick={() => dispatch({ page: name })}>
    <HStack
      w={'100%'}
      p={0}
      rounded={6}
      bg={page === name ? highlight : 'inherit'}
    >
      <Tooltip hasArrow label={_.startCase(name)}>
        <IconButton
          size="md"
          fontSize="lg"
          variant="ghost"
          icon={icon}
          aria-label={_.startCase(name)}
        />
      </Tooltip>
      <Text display={responsive.nav.iconText} fontSize={'md'}>
        {_.startCase(name)}
      </Text>
    </HStack>
  </Box>
)

let LinkType = ({ ariaLabel, icon, name, link, responsive }) => (
  <HStack>
    <Link isExternal href={link} w={'100%'}>
      <HStack>
        <IconButton
          size="md"
          fontSize="lg"
          variant="ghost"
          icon={icon}
          aria-label={ariaLabel}
        />
        <Text
          display={responsive.nav.iconText}
          align={'center'}
          fontSize={'md'}
        >
          {name}
        </Text>
      </HStack>
    </Link>
  </HStack>
)

export let NavIcon = ({
  name,
  icon,
  page,
  dispatch,
  type,
  ariaLabel,
  responsive,
}) => {
  let highlight = useColorModeValue('icon.light', 'icon.dark')
  let displayIcon = <></>
  if (type === 'navigation') {
    displayIcon = (
      <NavType
        dispatch={dispatch}
        name={name}
        icon={icon}
        page={page}
        highlight={highlight}
        responsive={responsive}
      />
    )
  } else if (type === 'link') {
    displayIcon = (
      <LinkType
        name={name}
        icon={icon}
        link={page}
        ariaLabel={ariaLabel}
        responsive={responsive}
      />
    )
  }
  return displayIcon
}
