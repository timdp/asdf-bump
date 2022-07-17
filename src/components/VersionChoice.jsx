import { Box, Text } from 'ink'
import React from 'react'

import { RadioButton } from './RadioButton'

export const VersionChoice = ({ color, children, isSelected }) => (
  <Box>
    <RadioButton color={color} isChecked={isSelected} />
    <Text> </Text>
    <Text color={color} bold={isSelected} wrap='truncate'>
      {children}
    </Text>
  </Box>
)
