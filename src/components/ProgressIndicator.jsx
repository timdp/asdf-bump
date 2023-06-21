import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import React from 'react'

import { COLOR_SPINNER } from '../constants.js'

export const ProgressIndicator = ({ children }) => (
  <Box>
    <Text color={COLOR_SPINNER}>
      <Spinner />
    </Text>
    <Text> {children}</Text>
  </Box>
)
