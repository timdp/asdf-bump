import { Box, useInput } from 'ink'
import React, { useEffect, useState } from 'react'

import { Instructions } from './Instructions'
import { ToolGridHeading } from './ToolGridHeading'
import { ToolRow } from './ToolRow'

const isNotNullish = (value) => value != null

const shiftIndex = (index, total, delta) => (index + delta + total) % total

const buildAvailableVersions = ({
  currentVersion,
  latestCompatibleVersion,
  latestVersion
}) =>
  [currentVersion, latestCompatibleVersion, latestVersion].filter(isNotNullish)

const getSelectedVersion = (toolVersions, { toolName, currentVersion }) =>
  toolVersions[toolName] ?? currentVersion

const applyVersionSelection = (
  toolVersions,
  { toolName, currentVersion },
  newVersion
) => {
  const newToolVersions = { ...toolVersions }
  if (newVersion === currentVersion) {
    delete newToolVersions[toolName]
  } else {
    newToolVersions[toolName] = newVersion
  }
  return newToolVersions
}

const updateToolVersions = (toolVersions, activeVersionInfo, delta) => {
  const choices = buildAvailableVersions(activeVersionInfo)
  const choice = getSelectedVersion(toolVersions, activeVersionInfo)
  const newIndex = shiftIndex(choices.indexOf(choice), choices.length, delta)
  const newVersion = choices[newIndex]
  return applyVersionSelection(toolVersions, activeVersionInfo, newVersion)
}

export const ToolGrid = ({ versionInfo, onConfirm }) => {
  const [toolVersions, setToolVersions] = useState({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeVersionInfo, setActiveVersionInfo] = useState(null)

  useEffect(() => {
    setActiveVersionInfo(versionInfo[activeIndex])
  }, [activeIndex])

  useInput((_, key) => {
    if (key.upArrow) {
      setActiveIndex(shiftIndex(activeIndex, versionInfo.length, -1))
    }
    if (key.downArrow) {
      setActiveIndex(shiftIndex(activeIndex, versionInfo.length, +1))
    }
    if (key.leftArrow) {
      setToolVersions(updateToolVersions(toolVersions, activeVersionInfo, -1))
    }
    if (key.rightArrow) {
      setToolVersions(updateToolVersions(toolVersions, activeVersionInfo, +1))
    }
    if (key.return) {
      onConfirm(toolVersions)
    }
  })

  return (
    <Box flexDirection='column' marginY={1}>
      <Instructions />
      <ToolGridHeading />
      {versionInfo.map((toolVersionInfo, index) => (
        <ToolRow
          key={toolVersionInfo.toolName}
          toolName={toolVersionInfo.toolName}
          currentVersion={toolVersionInfo.currentVersion}
          latestCompatibleVersion={toolVersionInfo.latestCompatibleVersion}
          latestVersion={toolVersionInfo.latestVersion}
          isActive={index === activeIndex}
          selectedVersion={getSelectedVersion(toolVersions, toolVersionInfo)}
        />
      ))}
    </Box>
  )
}
