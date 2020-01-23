// TODO:
// add remaining tests
// add arguments
// gatsby?

import F from 'futil'
import _ from 'lodash/fp'
import * as R from 'ramda'
import React, { useState, useEffect } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import AutosizeInput from 'react-input-autosize'
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
  Icon,
  Button
} from 'grey-vest'
import Runkit from 'react-runkit'
import ReactMarkdown from 'react-markdown'
import useEventListener from 'use-event-listener'
import { exploreAPI, tolerantEval, tolerantArrayEval } from './exploreAPI'
import tests from './tests'
import source from './source'
import tagDocs from './tagDocs'
import docs from './docscomplete'
import Home from './Home'
// import docs from './docsfull'
// import docs from './docs'

let toSentence = F.intersperse(F.differentLast(() => ', ', () => ' and '))

let fetchText = async url => await (await fetch(url)).text()
let useAsync = fn => {
  let [data, setData] = useState('')
  useEffect(
    () => {
      fn().then(setData)
    },
    [fn]
  )
  return data
}

let changelogUrl =
  'https://raw.githubusercontent.com/smartprocure/futil-js/master/CHANGELOG.md'
let Changelog = () => {
  let data = useAsync(() => fetchText(changelogUrl))
  return <ReactMarkdown source={data} />
}

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

let TagSection = ({ tag }) => {
  let [show, setShow] = React.useState(false)
  let docs = tagDocs[tag]

  return (
    <>
      <div style={{ margin: 20 }}>
        <Flex
          alignItems="center"
          onClick={() => setShow(!show)}
          style={{ ...(docs && { cursor: 'pointer' }) }}
        >
          <h1 style={{ margin: 0 }}>{tag} Methods</h1>
          {docs && (
            <i
              className="material-icons"
              style={{
                fontSize: 18,
                paddingLeft: 5,
                ...(docs && { color: '#77f' }),
              }}
            >
              help_outline
            </i>
          )}
        </Flex>
        {show && docs}
      </div>
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
          style={{ cursor: 'pointer' }}
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

let PageHeader = ({ style, ...props }) => (
  <div
    style={{
      width: '100%',
      borderBottom: '1px solid #d8d8d8',
      margin: '0 10px 10px',
      ...style,
    }}
    {...props}
  />
)

let HeaderRadio = ({ value, options }) => (
  <div style={{ width: '100%', marginLeft: 24 }}>
    {F.mapIndexed(
      (x, i, list) => (
        <h1
          key={x.value}
          style={{
            display: 'inline-block',
            margin: '24px 0',
            // Divider Line
            ...(i !== list.length - 1 && {
              borderRight: 'solid 1px #d8d8d8',
              paddingRight: 24,
              marginRight: 24,
            }),
          }}
        >
          <span
            onClick={x.onClick}
            style={{
              // This will show a pointer even when the href is empty
              cursor: 'pointer',
              color:
                x.value === value ? 'rgb(39, 44, 65)' : 'rgba(39, 44, 65, 0.3)',
            }}
          >
            {x.label}
          </span>
        </h1>
      ),
      options
    )}
  </div>
)
HeaderRadio.displayName = 'HeaderRadio'

let tagIndexes = _.flow(
  _.flatMap('tags'),
  _.uniq,
  _.map(x => ({
    tag: x,
    name: _.find(doc => _.includes(x, doc.tags), docs).name,
  })),
  _.groupBy('name'),
  _.mapValues(_.map('tag'))
)(docs)

let scrollToMethod = name => {
  let element = document.getElementById(`${name}-box`)
  element && element.scrollIntoView()
}
let scrollToHash = () => {
  scrollToMethod(window.location.hash.replace('#', ''))
}

let DocsPage = ({ search, setSearch }) => {
  let [input, setInput] = React.useState('')
  let [output, setOutput] = React.useState('')
  let [matchesOnly, setMatchesOnly] = React.useState(false)

  useEventListener('hashchange', scrollToHash)

  let processedInput = tolerantArrayEval(input)
  let processedOutput = tolerantEval(output)
  let regex = new RegExp(search)
  let exploreMatches = exploreAPI(F, processedInput, processedOutput)
  let exploreLodash = exploreAPI(_, processedInput, processedOutput)
  let exploreRamda = exploreAPI(R, processedInput, processedOutput)

  let filteredDocs = _.filter(x => {
    if (input) return _.includes(x.name, exploreMatches)
    return regex.test(x.name) || (matchesOnly && regex.test(x.description))
  }, docs)
  return (
    <>
      <h1 style={{ margin: 10 }}>What was that method? Let's find it!</h1>
      <Box style={{ margin: 10 }}>
        <p>
          Sometimes you know a method exists but not what it's called. Use this
          to find all the methods that match an expected input and output!
        </p>
        <Flex alignItems="center" justifyContent="center" style={{ fontSize: 18 }}>
          <AutosizeInput
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Input (e.g. {a:1})"
            style={{fontSize: 18}}
          />
          <Icon icon="arrow_right_alt" style={{fontSize:36}} />
          <AutosizeInput
            value={output}
            onChange={e => setOutput(e.target.value)}
            placeholder="Output (e.g. {a:1})"
          />
        </Flex>
        {exploreMatches.length ? (
          <div>
            {_.flow(
              _.map(x => (
                <a
                  href={`#${x}`}
                  onClick={() => {
                    // setSearch(x)
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
      </Box>
      <div
        style={{
          display: 'grid',
          marginBottom: 50,
          gridTemplateColumns: '325px minmax(0, 1fr)', // 325 is arbitrary
        }}
      >
        <div>
          <h1
            style={{
              margin: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>All {filteredDocs.length}</span>
            <input
              style={{ width: 'auto' }}
              type="checkbox"
              value={matchesOnly}
              onChange={() => setMatchesOnly(!matchesOnly)}
            />
          </h1>
          <Box
            style={{
              margin: 10,
              position: 'sticky',
              top: 0,
              overflow: 'scroll',
              height: '100vh',
            }}
          >
            {_.map(
              x => (
                <Flex
                  style={{
                    borderBottom: 'solid 1px #ccc',
                    padding: 10,
                  }}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <a
                    href={`#${x.name}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      scrollToMethod(x.name)
                    }}
                  >
                    <TextHighlight pattern={search} text={x.name} />
                  </a>
                  <div>
                    {_.map(
                      t => (
                        <Tag>{t}</Tag>
                      ),
                      x.tags
                    )}
                  </div>
                </Flex>
              ),
              filteredDocs
            )}
          </Box>
        </div>
        <div>
          {_.map(
            x => (
              <>
                {_.map(
                  tag => (
                    <TagSection tag={tag} />
                  ),
                  tagIndexes[x.name]
                )}
                <Box style={{ margin: 10 }} id={`${x.name}-box`}>
                  <Flex alignItems="center" justifyContent="space-between">
                    <div
                      style={{
                        fontSize: 18,
                        lineHeight: 1.3,
                        letterSpacing: 3,
                        fontFamily: `'Fira Code', monospace`,
                      }}
                    >
                      {x.name}{' '}
                      {x.added && (
                        <small style={{ fontSize: 10, color: '#777' }}>
                          {x.added}
                        </small>
                      )}
                    </div>
                    <div>
                      {_.map(
                        t => (
                          <Tag>{t}</Tag>
                        ),
                        x.tags
                      )}
                    </div>
                  </Flex>

                  <Signature {...x} />

                  {x.description}
                  {/* <TextHighlight pattern={search} text={x.description} /> */}
                  {(tests[x.name] || x.example || source[x.name]) && (
                    <Tabs TabsList={ButtonRadio} TabPanel={React.Fragment}>
                      {_.compact([
                        x.example && (
                          <Tab label="Example">
                            <CodeSnippet>{x.example}</CodeSnippet>
                          </Tab>
                        ),
                        tests[x.name] && (
                          <Tab label="Tests">
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
              </>
            ),
            matchesOnly ? filteredDocs : docs
          )}
        </div>
      </div>
    </>
  )
}

let App = () => {
  let [search, setSearch] = React.useState('')
  let [page, setPage] = React.useState('docs')

  return (
    <>
      <Fonts />
      <Style />
      <PageHeader>
        <Flex justifyContent="space-between" alignItems="center">
          <img
            src="https://user-images.githubusercontent.com/8062245/28718527-796382ac-7374-11e7-98a3-9791223042a4.png"
            height={50}
            alt="futil"
          />
          <HeaderRadio
            value={page}
            options={_.map(
              x => ({
                value: x,
                label: _.startCase(x),
                onClick: () => setPage(x),
              }),
              ['home', 'docs', 'changelog']
            )}
          />
          Search By
          <Button>Name&nbsp;v</Button>
          <TextInput
            style={{ marginLeft: 20 }}
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPage('docs')
            }}
            placeholder="Search..."
          />
        </Flex>
      </PageHeader>
      {page === 'home' && (
        <Box style={{ margin: '10px auto', maxWidth: 1199 }}>
          <Home />
        </Box>
      )}
      {page === 'changelog' && (
        <Box style={{ margin: '10px auto', maxWidth: 1199 }}>
          <h1>
            <a href="https://github.com/smartprocure/futil-js/blob/master/CHANGELOG.md">
              Version History/Changelog
            </a>
          </h1>
          <Changelog />
        </Box>
      )}
      {page === 'docs' && <DocsPage {...{ search, setSearch }} />}
    </>
  )
}

export default App
