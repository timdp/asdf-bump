import { Box, Text } from 'ink'
import React from 'react'

import {
  COLOR_HEADING,
  WIDTH_MARKER,
  WIDTH_PACKAGE_NAME,
  WIDTH_VERSION
} from '../constants.js'

export const ColumnHeading = ({ width, children }) => (
  <Box width={width}>
    <Text color={COLOR_HEADING} bold underline>
      {children}
    </Text>
  </Box>
)

export const ToolGridHeading = () => (
  <Box marginBottom={1}>
    <Box width={WIDTH_MARKER} />
    <Box width={WIDTH_PACKAGE_NAME} />
    <ColumnHeading width={WIDTH_VERSION}>Current</ColumnHeading>
    <ColumnHeading width={WIDTH_VERSION}>Compatible</ColumnHeading>
    <ColumnHeading width={WIDTH_VERSION}>Latest</ColumnHeading>
  </Box>
)
