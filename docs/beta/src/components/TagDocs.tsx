import * as React from 'react'
import _ from 'lodash/fp'
import {
  Box,
  Heading,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { Markdown } from './Markdown'

let TagTitle = ({ tag }) => (
  <Heading flex="1" textAlign="left" size="lg">
    <Box as="span">{_.startCase(tag)}</Box> Methods
  </Heading>
)

export let TagDocs = ({ unseenTags, tagDocs }) => {
  let panelBg = useColorModeValue('gray.200', 'gray.600')
  return (
    <>
      {_.map(
        (tag) => (
          <React.Fragment key={tag}>
            {tagDocs[tag] ? (
              <Accordion allowToggle>
                <AccordionItem rounded="md">
                  <h2>
                    <AccordionButton>
                      <TagTitle tag={tag} />
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel p={8} bg={panelBg} rounded="md">
                    <Markdown>{tagDocs[tag]}</Markdown>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            ) : (
              <TagTitle tag={tag} />
            )}
          </React.Fragment>
        ),
        unseenTags
      )}
    </>
  )
}
