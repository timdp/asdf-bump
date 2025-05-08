import { Box, Text } from 'ink'
import React from 'react'

import {
  COLOR_LATEST_COMPATIBLE_VERSION,
  COLOR_LATEST_VERSION,
  COLOR_MARKER,
  COLOR_PACKAGE_NAME,
  MARKER,
  WIDTH_MARKER,
  WIDTH_PACKAGE_NAME,
  WIDTH_VERSION,
} from '../constants.js'
import { VersionChoice } from './VersionChoice.jsx'

export const ToolRow = ({
  isActive,
  packageName,
  currentVersion,
  latestCompatibleVersion,
  latestVersion,
  selectedVersion,
}) => (
  <Box>
    <Box width={WIDTH_MARKER}>
      {isActive && (
        <Text color={COLOR_MARKER} bold>
          {MARKER}
        </Text>
      )}
    </Box>
    <Box width={WIDTH_PACKAGE_NAME}>
      <Text color={COLOR_PACKAGE_NAME} bold wrap='truncate'>
        {packageName}
      </Text>
    </Box>
    <Box width={WIDTH_VERSION}>
      <VersionChoice isSelected={currentVersion === selectedVersion}>
        {currentVersion}
      </VersionChoice>
    </Box>
    <Box width={WIDTH_VERSION}>
      {latestCompatibleVersion != null && (
        <VersionChoice
          color={COLOR_LATEST_COMPATIBLE_VERSION}
          isSelected={latestCompatibleVersion === selectedVersion}
        >
          {latestCompatibleVersion}
        </VersionChoice>
      )}
    </Box>
    <Box width={WIDTH_VERSION}>
      {latestVersion != null && (
        <VersionChoice
          color={COLOR_LATEST_VERSION}
          isSelected={latestVersion === selectedVersion}
        >
          {latestVersion}
        </VersionChoice>
      )}
    </Box>
  </Box>
)
