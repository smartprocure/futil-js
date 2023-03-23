import {
  Tooltip,
  InputGroup,
  InputLeftElement,
  Input,
  useColorModeValue,
  InputLeftAddon,
  InputRightAddon,
  Spacer,
} from '@chakra-ui/react'
import { AiOutlineFunction } from 'react-icons/ai'
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs'
import { ToolTipLabel } from '../GSSinglePageLayout/ToolTipLabel'

export let SearchInputs = ({
  input,
  output,
  search,
  toolTipName,
  toolTipInOut,
  dispatch,
  responsive,
}) => (
  <>
    <Spacer />

    <Tooltip hasArrow label={<ToolTipLabel {...toolTipName} />}>
      <InputGroup minW={'150px'} maxW={'100%'}>
        <InputLeftElement>
          <AiOutlineFunction />
        </InputLeftElement>
        <Input
          borderColor={useColorModeValue('icon.light', 'icon.dark')}
          bg={useColorModeValue('inputBack.light', 'inputBack.dark')}
          type="text"
          placeholder="Name"
          value={search}
          onChange={(e) => dispatch({ search: e.target.value })}
        />
      </InputGroup>
    </Tooltip>

    <Spacer />

    <Tooltip hasArrow label={<ToolTipLabel {...toolTipInOut} />}>
      <InputGroup minW={'150px'} maxW={'100%'}>
        <InputLeftAddon
          bg={useColorModeValue('icon.light', 'icon.dark')}
          w={'50px'}
        >
          <BsChevronCompactLeft />
        </InputLeftAddon>
        <Input
          border={'0.5px solid'}
          borderColor={useColorModeValue('icon.light', 'icon.dark')}
          bg={useColorModeValue('inputBack.light', 'inputBack.dark')}
          type="Heading"
          placeholder="Input (e.g. x => x * 2, [1, 2])"
          value={input}
          onChange={(e) => dispatch({ input: e.target.value })}
        />
        <InputRightAddon
          bg={useColorModeValue('icon.light', 'icon.dark')}
          w={'50px'}
        >
          <BsChevronCompactRight />
        </InputRightAddon>
      </InputGroup>
    </Tooltip>

    <Spacer />

    <Tooltip hasArrow label={<ToolTipLabel {...toolTipInOut} />}>
      <InputGroup minW={'150px'} maxW={'100%'}>
        <InputLeftAddon
          bg={useColorModeValue('icon.light', 'icon.dark')}
          w={'50px'}
        >
          =
        </InputLeftAddon>
        <Input
          border={'0.5px solid'}
          borderColor={useColorModeValue('icon.light', 'icon.dark')}
          bg={useColorModeValue('inputBack.light', 'inputBack.dark')}
          type="text"
          placeholder="Output (e.g. [2, 4])"
          value={output}
          onChange={(e) => dispatch({ output: e.target.value })}
        />
      </InputGroup>
    </Tooltip>

    <Spacer />
  </>
)
