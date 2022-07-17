import { Text } from 'ink'
import React from 'react'

import { COLOR_KEY } from '../constants'

export const Key = ({ children }) => (
  <Text color={COLOR_KEY} bold>
    {'<'}
    {children}
    {'>'}
  </Text>
)
