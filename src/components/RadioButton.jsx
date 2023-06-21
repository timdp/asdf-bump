import { Text } from 'ink'
import React from 'react'

import {
  COLOR_RADIO_BUTTON_UNCHECKED,
  RADIO_BUTTON_CHECKED,
  RADIO_BUTTON_UNCHECKED
} from '../constants.js'

export const RadioButton = ({ color, isChecked }) => (
  <Text color={isChecked ? color : COLOR_RADIO_BUTTON_UNCHECKED}>
    {isChecked ? RADIO_BUTTON_CHECKED : RADIO_BUTTON_UNCHECKED}
  </Text>
)
