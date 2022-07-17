#!/usr/bin/env node

import 'source-map-support/register'

import { render } from 'ink'
import minimist from 'minimist'
import React from 'react'

import { App } from './components/App'

const { any } = minimist(process.argv.slice(2))
render(<App allowUnstable={!!any} />)
