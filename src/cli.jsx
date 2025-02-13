#!/usr/bin/env node

import 'source-map-support/register.js'

import { render } from 'ink'
import mri from 'mri'
import React from 'react'

import { runAsdf } from './asdf/run.js'
import { App } from './components/App.jsx'
import { Result } from './constants.js'

const RESULT_TO_MESSAGE = new Map([
  [Result.NO_TOOLS_CONFIGURED, 'No tools configured.'],
  [Result.ALL_TOOLS_UP_TO_DATE, 'All tools up to date.'],
  [Result.NOTHING_TO_UPDATE, 'Nothing to update.']
])

const handleResult = async (result, install) => {
  if (result !== Result.UPDATE_COMPLETED) {
    console.info(RESULT_TO_MESSAGE.get(result))
    return
  }
  if (!install) {
    console.info(
      'Updated .tool-versions file. Run `asdf install` to install new versions.'
    )
    return
  }
  console.info('Installing new versions...')
  await runAsdf(['install'], true, true)
  console.info('Installation complete.')
}

const { any = false, install = true } = mri(process.argv.slice(2))

const { clear, unmount } = render(
  <App
    allowUnstable={any}
    onDone={(result) => {
      clear()
      unmount()
      handleResult(result, install)
    }}
  />
)
