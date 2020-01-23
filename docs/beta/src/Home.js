import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs'

let Badge = ({ src, alt, href }) => {
  let style = { marginRight: '5px' }
  let image = <img {...{ src, alt, style }} />
  return href ? <a href={href}>{image}</a> : image
}
let Badges = () => (
  <>
    <Badge
      href="https://circleci.com/gh/smartprocure/futil-js"
      src="https://circleci.com/gh/smartprocure/futil-js.svg?style=svg"
      alt="CircleCI"
    />
    <Badge
      href="https://greenkeeper.io/"
      src="https://badges.greenkeeper.io/smartprocure/futil-js.svg"
      alt="Greenkeeper badge"
    />
    <Badge
      href="https://badge.fury.io/js/futil-js"
      src="https://badge.fury.io/js/futil-js.svg"
      alt="npm version"
    />
    <Badge
      src="https://david-dm.org/smartprocure/futil-js.svg"
      alt="dependencies"
    />
    <Badge
      href="https://codeclimate.com/github/smartprocure/futil-js"
      src="https://codeclimate.com/github/smartprocure/futil-js/badges/gpa.svg"
      alt="Code Climate"
    />
    <Badge
      href="https://www.codacy.com/app/daedalus28/futil-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=smartprocure/futil-js&amp;utm_campaign=Badge_Grade"
      src="https://api.codacy.com/project/badge/Grade/1302fe4c3f0447be9d5dbd00f9baa12f"
      alt="Codacy Badge"
    />
    <Badge
      href="https://coveralls.io/github/smartprocure/futil-js?branch=master"
      src="https://coveralls.io/repos/github/smartprocure/futil-js/badge.svg?branch=master"
      alt="Coverage Status"
    />
    <Badge
      href="https://github.com/prettier/prettier"
      src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"
      alt="code style: prettier"
    />

    <Badge
      href="https://npm.runkit.com/futil-js"
      src="https://badge.runkitcdn.com/futil-js.svg"
      alt="Try futil-js on RunKit"
    />
  </>
)

let Logo = props => (
  <img
    src="https://user-images.githubusercontent.com/8062245/28718527-796382ac-7374-11e7-98a3-9791223042a4.png"
    alt="futil"
    {...props}
  />
)

let Summary = () => (
  <>
    <Logo width={200} />
    <p>
      A collection of <b>F</b>unctional <b>Util</b>ities. Resistance is{' '}
      <b>futil</b>e.
    </p>
    <p>
      Mostly, these are generic utilities that could conceivably be part of a
      library like lodash/fp, but for some reason or other are not.
    </p>
  </>
)

let BrowserCoverage = () => (
  <>
    <h1>Browser Compatibility</h1>
    <a href="https://saucelabs.com/u/futil">
      <img
        src="https://saucelabs.com/browser-matrix/futil.svg"
        alt="Sauce Test Status"
      />
    </a>
  </>
)

let Intro = () => (
  <>
    <h1>Installing</h1>
    <SyntaxHighlighter language="console" style={vs2015}>
      > npm i -S futil
    </SyntaxHighlighter>
    <p>
      This package requires lodash/fp, so make sure it is available in your app.
    </p>
    <h1>Usage</h1>
    All of these work:
    <SyntaxHighlighter language="javascript" style={vs2015}>
      {`import F from 'futil'
  import * as F from 'futil'
  import {x,y,z} from 'futil'`}
    </SyntaxHighlighter>
  </>
)

export default () => (
  <>
    <Summary />
    <Badges />
    <BrowserCoverage />
    <Intro />
  </>
)
