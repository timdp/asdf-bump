const ORANGE = '#FF8000'
const GREEN = '#00C000'
const YELLOW = '#C0C000'
const CYAN = '#00D0FF'
const GRAY = '#909090'

// TODO Do not assume full-color support
// TODO Do not assume dark background
export const COLOR_SPINNER = CYAN
export const COLOR_KEY = CYAN
export const COLOR_HEADING = GRAY
export const COLOR_MARKER = CYAN
export const COLOR_PACKAGE_NAME = ORANGE
export const COLOR_LATEST_COMPATIBLE_VERSION = GREEN
export const COLOR_LATEST_VERSION = YELLOW
export const COLOR_RADIO_BUTTON_UNCHECKED = GRAY

export const WIDTH_MARKER = 2
export const WIDTH_PACKAGE_NAME = 48
export const WIDTH_VERSION = 16

export const MARKER = '▸'
export const RADIO_BUTTON_CHECKED = '◉'
export const RADIO_BUTTON_UNCHECKED = '○'

export const Result = Object.freeze({
  NO_TOOLS_CONFIGURED: 0,
  ALL_TOOLS_UP_TO_DATE: 1,
  NOTHING_TO_UPDATE: 2,
  UPDATE_COMPLETED: 3
})
