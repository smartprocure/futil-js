// TODO:
// add arguments
// gatsby?

import F from 'futil'
import _ from 'lodash/fp'
import * as R from 'ramda'
import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import {
  Flex,
  Fonts,
  Style,
  Box,
  TextHighlight,
  Table,
  Modal,
  TextInput,
  Tabs,
  Tab,
  ButtonRadio,
} from 'grey-vest'
import Runkit from 'react-runkit'
import { exploreAPI, tolerantEval, tolerantArrayEval } from './exploreAPI'
import tests from './tests'
import source from './source'
import tagDocs from './tagDocs'
import docs from './docs'

let toSentence = F.intersperse(
  F.differentLast(
    () => ', ',
    () => ' and '
  )
)

let Tag = ({ children, ...props }) => {
  let [modal, setModal] = React.useState(false)
  let docs = tagDocs[children]
  return (
    <>
      {docs && (
        <Modal isOpen={modal} onClose={() => setModal(false)}>
          <h1 style={{ marginTop: 0 }}>{children}</h1>
          {docs}
        </Modal>
      )}
      <span
        onClick={() => setModal(true)}
        className="code-tag"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          marginLeft: 5,
          ...(docs && { cursor: 'pointer', color: '#77f' }),
        }}
        {...props}
      >
        {children}{' '}
        {docs && (
          <i
            className="material-icons"
            style={{ fontSize: 18, paddingLeft: 5 }}
          >
            help_outline
          </i>
        )}
      </span>
    </>
  )
}

let Signature = x => {
  let [showArgs, setShowArgs] = React.useState(false)
  return (
    <>
      {x.signature && (
        <pre
          className="code-tag"
          style={{ cursor: 'pointer', whiteSpace: 'pre-wrap' }}
          onClick={() => setShowArgs(!showArgs)}
        >
          {x.signature}
        </pre>
      )}
      {showArgs && (
        <>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {_.map(
                arg => (
                  <tr>
                    <td>{arg.name}</td>
                    <td>{arg.type}</td>
                    <td>{arg.description}</td>
                  </tr>
                ),
                x.arguments
              )}
            </tbody>
          </Table>
        </>
      )}
    </>
  )
}
let imports = `
  let _ = require('lodash/fp')
  let F = require('futil')
  let {expect} = require('chai')
`
let preventDefault = f => e => {
  e.preventDefault()
  f()
}
let CodeSnippet = ({ children, noRepl }) => {
  let [repl, setRepl] = React.useState(false)
  return repl ? (
    <Runkit source={children} preamble={imports} />
  ) : (
    <>
      <SyntaxHighlighter language="javascript" style={vs2015}>
        {children}
      </SyntaxHighlighter>
      {!noRepl && (
        <Flex justifyContent="flex-end">
          <button onClick={preventDefault(() => setRepl(!repl))}>
            Try in REPL
          </button>
        </Flex>
      )}
    </>
  )
}

let scrollToMethod = name => {
  let element = document.getElementById(`${name}-box`)
  element && element.scrollIntoViewIfNeeded()
}

// Sometimes you know a function exists but not what it's called. Use this to
// find all the methods that match an expected input and output!
let SearchByIO = () => {
  let [input, setInput] = React.useState('')
  let [output, setOutput] = React.useState('')
  let processedInput = tolerantArrayEval(input)
  let processedOutput = tolerantEval(output)
  let exploreMatches = exploreAPI(F, processedInput, processedOutput)
  let exploreLodash = exploreAPI(_, processedInput, processedOutput)
  let exploreRamda = exploreAPI(R, processedInput, processedOutput)
  let filteredDocs = _.filter(x => _.includes(x.name, exploreMatches), docs)
  return (
    <>
      <div>
        <TextInput
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Input (e.g. {a:1})"
        />
        <TextInput
          value={output}
          onChange={e => setOutput(e.target.value)}
          placeholder="Output (e.g. {a:1})"
        />
      </div>
      {exploreMatches.length ? (
        <div>
          {_.flow(
            _.map(x => (
              <a
                href={`#${x}`}
                onClick={() => {
                  scrollToMethod(x)
                }}
              >{`F.${x}`}</a>
            )),
            toSentence
          )(exploreMatches)}
        </div>
      ) : null}
      {exploreLodash.length ? (
        <div>
          {_.flow(
            _.map(x => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://lodash.com/docs/4.17.15#${x}`}
              >{`_.${x}`}</a>
            )),
            toSentence
          )(exploreLodash)}
        </div>
      ) : null}
      {exploreRamda.length ? (
        <div>
          {_.flow(
            _.map(x => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://ramdajs.com/docs/#${x}`}
              >{`R.${x}`}</a>
            )),
            toSentence
          )(exploreRamda)}
        </div>
      ) : null}
    </>
  )
}

let ListItem = ({ as: Component = 'li', style, ...props }) => (
  <Component
    className="list-item"
    style={{ padding: 8, borderBottom: border, ...style }}
    {...props}
  />
)

let Tags = ({ tags }) => (
  <div>
    {_.map(
      t => (
        <Tag key={t}>{t}</Tag>
      ),
      tags
    )}
  </div>
)

let SearchByName = () => {
  let [search, setSearch] = React.useState('')
  return (
    <>
      <TextInput
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Box style={{ overflow: 'scroll', padding: 0 }}>
        {_.map(
          ({ name, tags }) => (
            <ListItem
              as="a"
              href={`#${name}`}
              key={name}
              style={{
                fontFamily: 'monospace',
                display: !_.includes(search, _.toLower(name)) ? 'none' : 'flex',
              }}
            >
              <Flex
                alignItems="center"
                justifyContent="space-between"
                style={{ width: '100%' }}
              >
                <div>
                  <TextHighlight pattern={search} text={name} />
                </div>
                <Tags tags={tags} />
              </Flex>
            </ListItem>
          ),
          docs
        )}
      </Box>
    </>
  )
}

let SearchSideBar = ({ style }) => (
  <Flex column style={style}>
    <Tabs
      TabsList={props => (
        <div style={{ marginBottom: 16 }}>
          <TabsList tabStyle={{ marginRight: 16 }} {...props} />
        </div>
      )}
      TabPanel={React.Fragment}
    >
      <Tab label="Search By Name">
        <SearchByName />
      </Tab>
      <Tab label="Search By Input/Output">
        <SearchByIO />
      </Tab>
    </Tabs>
  </Flex>
)

let Functions = props => (
  <div {...props}>
    {_.map(
      x => (
        <Box style={{ marginBottom: 16 }} id={x.name}>
          <Flex alignItems="center" justifyContent="space-between">
            <div style={{ fontSize: 18, fontFamily: 'monospace' }}>
              {x.name}
            </div>
            <Tags tags={x.tags} />
          </Flex>
          <Signature {...x} />
          {x.description}
          {(tests[x.name] || source[x.name]) && (
            <Tabs TabsList={ButtonRadio} TabPanel={React.Fragment}>
              {_.compact([
                tests[x.name] && (
                  <Tab label="Example">
                    <CodeSnippet>{tests[x.name] + ''}</CodeSnippet>
                  </Tab>
                ),
                source[x.name] && (
                  <Tab label="Source">
                    <CodeSnippet noRepl>{source[x.name]}</CodeSnippet>
                  </Tab>
                ),
              ])}
            </Tabs>
          )}
        </Box>
      ),
      docs
    )}
  </div>
)

let primary = '#0076de'
let secondary = 'grey'
let border = '1px solid lightgrey'

let TabsList = ({ value, onChange, options, tabStyle }) =>
  _.map(
    option => (
      <span
        key={option.value}
        onClick={() => onChange(option.value, value)}
        style={{
          cursor: 'pointer',
          color: value === option.value ? primary : secondary,
          borderBottom:
            value === option.value ? `2px solid ${primary}` : 'none',
          fontWeight: 'bold',
          ...tabStyle,
        }}
      >
        {option.label}
      </span>
    ),
    options
  )

let App = () => (
  <>
    <Fonts />
    <Style />
    <Flex column style={{ width: '100vw', height: '100vh' }}>
      <Tabs
        defaultValue={1}
        TabsList={props => (
          <Flex
            alignItems="center"
            style={{
              zIndex: 2,
              boxShadow: '0 0 2rem lightgrey',
              borderBottom: border,
              backgroundColor: 'white',
              fontSize: 18,
              textTransform: 'uppercase',
            }}
          >
            <img
              src="https://user-images.githubusercontent.com/8062245/28718527-796382ac-7374-11e7-98a3-9791223042a4.png"
              alt="futil"
              style={{ float: 'left', height: 30, padding: '0px 16px' }}
            />
            <TabsList tabStyle={{ padding: '8px 16px' }} {...props} />
          </Flex>
        )}
        TabPanel={props => (
          <Flex
            justifyContent="center"
            style={{ flex: 1, overflowY: 'auto', padding: 16 }}
            {...props}
          />
        )}
      >
        <Tab label="Home">
          <Box style={{ width: '100%', maxWidth: 1200, height: 'fit-content' }}>
            <zero-md
              key="home"
              src="https://raw.githubusercontent.com/smartprocure/futil-js/master/README.md"
            />
          </Box>
        </Tab>
        <Tab label="Docs">
          <SearchSideBar style={{ width: 400, marginRight: 16 }} />
          <Functions
            style={{
              flex: 1,
              overflow: 'scroll',
              borderRadius: 4,
              borderBottom: border,
              borderTop: border,
            }}
          />
        </Tab>
        <Tab label="Changelog">
          <Box style={{ width: '100%', maxWidth: 1200, height: 'fit-content' }}>
            <zero-md
              key="changelog"
              src="https://raw.githubusercontent.com/smartprocure/futil-js/master/CHANGELOG.md"
            />
          </Box>
        </Tab>
      </Tabs>
    </Flex>
  </>
)

export default App
