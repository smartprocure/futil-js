// https://github.com/chakra-ui/chakra-ui/issues/2016
// import 'focus-visible/dist/focus-visible'
import _ from 'lodash/fp.js'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  ChakraProvider,
  Icon,
  Flex,
  Box,
  List,
  ListItem,
  Link,
  Button,
} from '@chakra-ui/core'
import {
  MdMenu,
  MdSettings,
  MdDashboard,
  MdVideoLibrary,
  MdMonetizationOn,
  MdGavel,
  MdDescription,
  MdShowChart,
  MdSave,
  MdViewList,
  MdDoneAll,
  MdNotifications,
  MdHelp,
  MdAccountCircle,
  MdFlightTakeoff,
  MdContactMail,
} from 'react-icons/md'

// https://www.scottohara.me/blog/2019/05/22/contextual-images-svgs-and-a11y.html
let LabeledIcon = ({ icon, label, children, sx, ...props }) => (
  <Box
    aria-label={label}
    sx={{ display: 'inline-block', verticalAlign: 'unset', ...sx }}
    {...props}
  >
    {icon && (
      <Icon
        as={icon}
        aria-hidden={true}
        focusable={false}
        verticalAlign="-0.125em"
        mr={children && 1}
      />
    )}
    {children}
  </Box>
)

let ButtonIcon = props => (
  <LabeledIcon
    as={Button}
    variant="unstyled"
    h="unset"
    w="unset"
    minW="unset"
    {...props}
  />
)

// https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html
let MenuBar = ({ label, ...props }) => (
  <nav aria-label={label}>
    <Flex
      as={List}
      role="menubar"
      aria-label={label}
      aria-orientation="horizontal"
      direction="row"
      whiteSpace="nowrap"
      {...props}
    />
  </nav>
)

// NavGroup in a menu hierarchy.
let NavGroup = ({ label, children }) => (
  <ListItem role="none">
    {label}
    <List role="group">{children}</List>
  </ListItem>
)

// A node that is also a button.
let NavButton = ({ icon, label, _menu, sx, children, ...props }) => (
  <ListItem
    role="none"
    position="relative"
    sx={{
      ':hover > [role="menu"]': { display: 'flex' },
      '[role="menuitem"] + *': { ml: 2 },
      ...sx,
    }}
    {...props}
  >
    <ButtonIcon
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={false}
      icon={icon}
    >
      {label}
    </ButtonIcon>
    <List
      role="menu"
      aria-orientation="vertical"
      top="100%"
      maxH="calc(100vh - 100%)"
      overflow="scroll"
      position="absolute"
      display="none"
      {..._menu}
    >
      {children}
    </List>
  </ListItem>
)

// Leaves in a menu hierarchy. May or may not have an icon.
let NavItem = ({ route, icon, children }) => (
  <ListItem role="none">
    <LabeledIcon as={Link} icon={icon} role="menuitem" href={route}>
      {children}
    </LabeledIcon>
  </ListItem>
)

let NavMenu = () => (
  <MenuBar label="Site Navigation">
    <NavButton icon={MdMenu} mr="auto" _menu={{ left: 0 }}>
      <NavItem route="launchpad" icon={MdDashboard}>
        Launchpad
      </NavItem>
      <NavGroup icon={MdMonetizationOn} label="Quotes & RFQs">
        <NavItem route="quoteRequests.allOpenRequests">
          All Open Requests
        </NavItem>
        <NavItem route="quoteRequests.myOrganizationRequests">
          Organization Requests
        </NavItem>
        <NavItem route="quoteRequests.myOrganizationResponses">
          Organization Responses
        </NavItem>
      </NavGroup>
      <NavItem route="bids" icon={MdGavel}>
        Bids & RFPs
      </NavItem>
      <NavItem route="contracts" icon={MdDescription}>
        Co-ops & Contracts
      </NavItem>
      <NavItem route="spending" icon={MdShowChart}>
        Spending & POs
      </NavItem>
      <NavItem route="contacts" icon={MdContactMail}>
        Contacts
      </NavItem>
      <NavItem route="trainingVideos" icon={MdVideoLibrary}>
        Sales Training
      </NavItem>
      <NavItem route="alerts" icon={MdSave}>
        Saved Searches
      </NavItem>
      <NavItem route="lists" icon={MdViewList}>
        Lists
      </NavItem>
      <NavItem route="allTasks" icon={MdDoneAll}>
        Tasks
      </NavItem>
      <NavItem route="exports" icon={MdFlightTakeoff}>
        Exports
      </NavItem>
    </NavButton>
    <NavItem route="notifications" icon={MdNotifications} />
    <NavButton icon={MdSettings} label="Admin" _menu={{ right: 0 }}>
      <NavGroup label="Usage">
        <NavItem route="admin.activity">Activity</NavItem>
        <NavItem route="admin.searchHistory">Search History</NavItem>
        <NavItem route="admin.savedSearchStatistics">
          Saved Search Stats
        </NavItem>
        <NavItem route="admin.blockedIP">Blocked IPs</NavItem>
        <NavItem route="admin.pageViews">Page Views</NavItem>
        <NavItem route="admin.rateLimitViolations">
          Rate Limit Violations
        </NavItem>
        <NavItem route="admin.pageViewTotals">Page View Totals</NavItem>
      </NavGroup>
      <NavGroup label="Sales">
        <NavItem route="admin.salesTeams">Sales Teams</NavItem>
        <NavItem route="admin.commissions">Commissions</NavItem>
        <NavItem route="admin.orders">Proposals</NavItem>
      </NavGroup>
      <NavGroup label="Data Acquisition">
        <NavItem route="admin.agencyData">Agency Data</NavItem>
        <NavItem route="admin.daFiles">DA Files</NavItem>
        <NavGroup label="Exports">
          <NavItem route="admin.exportBalanceReport">
            Export Balance Report
          </NavItem>
          <NavItem route="admin.exportCredits">Export Credits</NavItem>
        </NavGroup>
      </NavGroup>
      <NavGroup label="Finance">
        <NavItem route="admin.commissionsReport">Commission Report</NavItem>
        <NavItem route="admin.earnedBonus">Earned Bonuses</NavItem>
        <NavItem route="admin.subscriptions">Subscriptions</NavItem>
        <NavItem route="admin.transactions">Transactions</NavItem>
        <NavItem route="admin.orderReport">Orders</NavItem>
      </NavGroup>
      <NavGroup label="Other">
        <NavItem route="admin.organization">Organizations</NavItem>
        <NavItem route="admin.user">Users</NavItem>
        <NavItem route="admin.quoteRequests">Quotes</NavItem>
        <NavItem route="admin.labs">Labs</NavItem>
        <NavItem route="admin.reporting">Reporting</NavItem>
        <NavItem route="admin.runScript">Run Script</NavItem>
        <NavItem route="admin.manualAlert">Manual Alert</NavItem>
      </NavGroup>
    </NavButton>
    <NavButton icon={MdHelp} label="Help" _menu={{ right: 0 }}>
      <NavItem route="help">Help Center</NavItem>
      <NavItem route="whatsNew">What's New</NavItem>
    </NavButton>
    <NavButton icon={MdAccountCircle} label="Account" _menu={{ right: 0 }}>
      <NavItem route="account.myProfile">My Profile</NavItem>
      <NavGroup label="My Organization">
        <NavItem route="account.organizationProfile">
          Organization Profile
        </NavItem>
        <NavItem route="account.users">Users</NavItem>
        <NavItem route="account.activity">Activity</NavItem>
        <NavItem route="account.customizeRequests">Customize Requests</NavItem>
      </NavGroup>
      <NavItem route="account.integrations">Integrations</NavItem>
      <NavItem route="account.billing">Billing</NavItem>
      <NavItem route="account.notificationPreferences">Notifications</NavItem>
      <NavItem route="account.referrals">Referrals</NavItem>
      <NavItem route="logout">Sign Out</NavItem>
    </NavButton>
  </MenuBar>
)

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <Box
        h="100vh"
        bg="red.100"
        sx={{
          '*': { border: '1px solid' },
          '[role="menuitem"]': { p: 4 },
        }}
      >
        <NavMenu />
      </Box>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
