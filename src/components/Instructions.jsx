import { Box, Text } from 'ink'
import React from 'react'

import { WIDTH_MARKER, WIDTH_PACKAGE_NAME } from '../constants.js'
import { Key } from './Key.jsx'

export const Instructions = () => (
  <Box flexDirection='column' marginBottom={1}>
    <Box>
      <Box width={WIDTH_MARKER} />
      <Box width={WIDTH_PACKAGE_NAME}>
        <Text>
          Press <Key>up</Key>/<Key>down</Key> to select tools.
        </Text>
      </Box>
      <Box>
        <Text>
          Press <Key>enter</Key> to install.
        </Text>
      </Box>
    </Box>
    <Box>
      <Box width={WIDTH_MARKER} />
      <Box width={WIDTH_PACKAGE_NAME}>
        <Text>
          Press <Key>left</Key>/<Key>right</Key> to select versions.
        </Text>
      </Box>
      <Box>
        <Text>
          Press <Key>ctrl+c</Key> to abort.
        </Text>
      </Box>
    </Box>
  </Box>
)
