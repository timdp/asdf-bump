import { Box, Text } from 'ink'
import React from 'react'

import {
  COLOR_HEADING,
  WIDTH_MARKER,
  WIDTH_NAME,
  WIDTH_VERSION
} from '../constants'

export const ToolGridHeading = () => (
  <Box marginBottom={1}>
    <Box width={WIDTH_MARKER} />
    <Box width={WIDTH_NAME} />
    <Box width={WIDTH_VERSION}>
      <Text color={COLOR_HEADING} bold underline>
        Current
      </Text>
    </Box>
    <Box width={WIDTH_VERSION}>
      <Text color={COLOR_HEADING} bold underline>
        Compatible
      </Text>
    </Box>
    <Box width={WIDTH_VERSION}>
      <Text color={COLOR_HEADING} bold underline>
        Latest
      </Text>
    </Box>
  </Box>
)
