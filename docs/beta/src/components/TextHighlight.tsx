import F from 'futil'
import { Text } from '@chakra-ui/react'
let TextWrap = (props: any) => <Text as="mark" {...props} />
// Since start and end are the same token, splitting on it means every even element was a match
type Props = { pattern: string; text: string; Wrap?: any }
export let TextHighlight = ({ pattern, text, Wrap = TextWrap }: Props) =>
  pattern
    ? F.highlight('<>', '<>', pattern, text)
        .split('<>')
        .map((x: string, i: number) => (i % 2 ? <Wrap key={i}>{x}</Wrap> : x))
    : text
