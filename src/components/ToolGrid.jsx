import { Box, useInput } from 'ink'
import React, { useState } from 'react'

import { Instructions } from './Instructions'
import { ToolGridHeading } from './ToolGridHeading'
import { ToolRow } from './ToolRow'

const changeSelectedVersion = (
  versionInfo,
  activeIndex,
  selectedVersions,
  setSelectedVersions,
  delta
) => {
  const { toolName, currentVersion, latestCompatibleVersion, latestVersion } =
    versionInfo[activeIndex]
  const selectedVersion = selectedVersions[toolName] ?? currentVersion
  const availableVersions = [currentVersion]
  if (latestCompatibleVersion != null) {
    availableVersions.push(latestCompatibleVersion)
  }
  if (latestVersion != null) {
    availableVersions.push(latestVersion)
  }
  const currentIndex = availableVersions.indexOf(selectedVersion)
  const newIndex =
    (currentIndex + availableVersions.length + delta) % availableVersions.length
  const newVersion = availableVersions[newIndex]
  const newSelectedVersions = { ...selectedVersions }
  if (newVersion === currentVersion) {
    delete newSelectedVersions[toolName]
  } else {
    newSelectedVersions[toolName] = newVersion
  }
  setSelectedVersions(newSelectedVersions)
}

export const ToolGrid = ({ versionInfo, onConfirm }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedVersions, setSelectedVersions] = useState({})
  useInput((_, key) => {
    switch (true) {
      case key.upArrow:
        setActiveIndex(
          activeIndex === 0 ? versionInfo.length - 1 : activeIndex - 1
        )
        break
      case key.downArrow:
        setActiveIndex(
          activeIndex === versionInfo.length - 1 ? 0 : activeIndex + 1
        )
        break
      case key.leftArrow:
        changeSelectedVersion(
          versionInfo,
          activeIndex,
          selectedVersions,
          setSelectedVersions,
          -1
        )
        break
      case key.rightArrow:
        changeSelectedVersion(
          versionInfo,
          activeIndex,
          selectedVersions,
          setSelectedVersions,
          1
        )
        break
      case key.return:
        onConfirm(selectedVersions)
        break
    }
  })
  return (
    <Box flexDirection='column' marginY={1}>
      <Instructions />
      <ToolGridHeading />
      {versionInfo.map(
        (
          { toolName, currentVersion, latestCompatibleVersion, latestVersion },
          index
        ) => (
          <ToolRow
            key={toolName}
            toolName={toolName}
            currentVersion={currentVersion}
            latestCompatibleVersion={latestCompatibleVersion}
            latestVersion={latestVersion}
            isActive={index === activeIndex}
            selectedVersion={selectedVersions[toolName] ?? currentVersion}
          />
        )
      )}
    </Box>
  )
}
