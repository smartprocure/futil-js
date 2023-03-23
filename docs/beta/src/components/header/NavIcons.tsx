import { HStack } from '@chakra-ui/react'
import { AiOutlineHome, AiFillGithub } from 'react-icons/ai'
import { BsJournalCode } from 'react-icons/bs'
import { FiGitPullRequest } from 'react-icons/fi'
import { ColorModeSwitcher } from '../ColorModeSwitcher'
import { NavIcon } from '../GSSinglePageLayout/NavIcon'

export let navIcons = ({ page, dispatch, responsive }) => (
  <>
    <HStack>
      <NavIcon
        name="home"
        icon={<AiOutlineHome />}
        type="navigation"
        ariaLabel={'navigate to home'}
        {...{ page, dispatch, responsive }}
      />
    </HStack>
    <HStack>
      <NavIcon
        name="docs"
        icon={<BsJournalCode />}
        type="navigation"
        ariaLabel={'navigate to docs'}
        {...{ page, dispatch, responsive }}
      />
    </HStack>
    <HStack>
      <NavIcon
        type="navigation"
        name="changelog"
        icon={<FiGitPullRequest />}
        {...{ page, dispatch, responsive }}
        ariaLabel={'navigate to change log'}
      />
    </HStack>
    <HStack>
      <NavIcon
        type="link"
        name="GitHub"
        icon={<AiFillGithub />}
        page={'https://github.com/smartprocure/futil-js'}
        {...{ dispatch, responsive }}
        ariaLabel={'Go to futil GitHub page'}
      />
    </HStack>
    <HStack>
      <ColorModeSwitcher marginX={0} title={'Dark/Light Toggle'} />
    </HStack>
  </>
)
