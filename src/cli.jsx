#!/usr/bin/env node

import 'source-map-support/register'

import { render } from 'ink'
import mri from 'mri'
import React from 'react'

import { App } from './components/App'

const { any } = mri(process.argv.slice(2))
render(<App allowUnstable={!!any} />)
