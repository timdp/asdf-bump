import { Text } from 'ink'
import pMap from 'p-map'
import React, { useEffect, useState } from 'react'

import { runAsdf } from '../asdf/run'
import { readToolVersions, writeToolVersions } from '../asdf/tool-versions'
import { ProgressIndicator } from './ProgressIndicator'
import { ToolGrid } from './ToolGrid'

const listAllVersions = async (toolName) =>
  await runAsdf(['list', 'all', toolName])

const determineLatestCompatibleVersion = (allVersions, currentVersion) => {
  const match = /^(\d+)/.exec(currentVersion)
  if (match == null) {
    return null
  }
  const major = match[1]
  return allVersions.find(
    (version) => version === major || version.startsWith(major + '.')
  )
}

const filterVersions = (allVersions) =>
  allVersions.filter((version) => /^\d+(\.\d+)*$/.test(version))

const getVersionInfo = async (toolVersions, allowUnstable) => {
  const versionInfo = await pMap(
    Object.entries(toolVersions),
    async ([toolName, currentVersion]) => {
      const allVersions = await listAllVersions(toolName)
      const allowedVersions = allowUnstable
        ? allVersions
        : filterVersions(allVersions)
      allowedVersions.reverse()
      const latestCompatibleVersion = determineLatestCompatibleVersion(
        allowedVersions,
        currentVersion
      )
      const latestVersion = allowedVersions[0]
      return {
        toolName,
        currentVersion,
        latestCompatibleVersion:
          latestCompatibleVersion !== currentVersion
            ? latestCompatibleVersion
            : null,
        latestVersion:
          latestVersion !== currentVersion &&
          latestVersion !== latestCompatibleVersion
            ? latestVersion
            : null
      }
    }
  )
  versionInfo.sort((a, b) => a.toolName.localeCompare(b.toolName))
  return versionInfo
}

const updatesAvailable = (versionInfo) =>
  versionInfo.some(
    ({ latestCompatibleVersion, latestVersion }) =>
      latestCompatibleVersion != null || latestVersion != null
  )

const applySelectedVersions = (versionInfo, selectedVersions) => ({
  ...Object.fromEntries(
    versionInfo.map(({ toolName, currentVersion }) => [
      toolName,
      currentVersion
    ])
  ),
  ...selectedVersions
})

export const App = ({ allowUnstable }) => {
  const [versionInfo, setVersionInfo] = useState(null)
  const [selectedVersions, setSelectedVersions] = useState(null)
  const [resultText, setResultText] = useState(null)

  useEffect(() => {
    readToolVersions()
      .then((toolVersions) => getVersionInfo(toolVersions, allowUnstable))
      .then(setVersionInfo)
  }, [])

  useEffect(() => {
    if (versionInfo == null) {
      return
    }
    if (versionInfo.length === 0) {
      setResultText('No tools configured.')
      return
    }
    if (!updatesAvailable(versionInfo)) {
      setResultText('All tools up to date.')
    }
  }, [versionInfo])

  useEffect(() => {
    if (selectedVersions == null) {
      return
    }
    if (Object.keys(selectedVersions).length === 0) {
      setResultText('Nothing to update.')
      return
    }
    const toolVersions = applySelectedVersions(versionInfo, selectedVersions)
    writeToolVersions(toolVersions).then(() =>
      setResultText('Update completed.')
    )
  }, [selectedVersions])

  if (resultText != null) {
    return <Text>{resultText}</Text>
  }

  if (selectedVersions != null) {
    return <ProgressIndicator>Saving...</ProgressIndicator>
  }

  if (versionInfo == null) {
    return <ProgressIndicator>Loading...</ProgressIndicator>
  }

  return <ToolGrid versionInfo={versionInfo} onConfirm={setSelectedVersions} />
}
