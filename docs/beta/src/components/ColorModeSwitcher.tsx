// From the Chakra CRA/TS starter
import * as React from 'react'
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
  Tooltip,
  Text,
  Box,
  HStack,
} from '@chakra-ui/react'
import { FaMoon, FaSun } from 'react-icons/fa'

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue('dark', 'light')
  const SwitchIcon = useColorModeValue(FaMoon, FaSun)
  const label = `Switch to ${text} mode`

  return (
    <Box onClick={toggleColorMode}>
      <HStack>
        <Tooltip hasArrow label={label}>
          <IconButton
            size="md"
            fontSize="lg"
            variant="ghost"
            color="current"
            icon={<SwitchIcon />}
            aria-label={label}
          />
        </Tooltip>
        <Text
          display={{ base: 'inherit', lg: 'none' }}
          align={'center'}
          fontSize={'md'}
        >
          {props.title}
        </Text>
      </HStack>
    </Box>
  )
}
