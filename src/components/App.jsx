import { Text } from 'ink'
import pMap from 'p-map'
import React, { useEffect, useState } from 'react'

import { runAsdf } from '../asdf/run.js'
import {
  locateToolVersions,
  readToolVersions,
  writeToolVersions
} from '../asdf/tool-versions.js'
import { ProgressIndicator } from './ProgressIndicator.jsx'
import { ToolGrid } from './ToolGrid.jsx'

const listAllVersions = async (packageName) =>
  await runAsdf(['list', 'all', packageName])

const determineLatestCompatibleVersion = (allVersions, currentVersion) => {
  const [major, minor] = currentVersion.split('.')
  const prefix = major === '0' && minor != null ? major + '.' + minor : major
  return allVersions.find(
    (version) => version === prefix || version.startsWith(prefix + '.')
  )
}

const filterVersions = (allVersions) =>
  allVersions.filter((version) => /^\d+(\.\d+)*$/.test(version))

const getVersionInfo = async (toolVersions, allowUnstable) => {
  const versionInfo = await pMap(
    Object.entries(toolVersions),
    async ([packageName, currentVersion]) => {
      const allVersions = await listAllVersions(packageName)
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
        packageName,
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
  versionInfo.sort((a, b) => a.packageName.localeCompare(b.packageName))
  return versionInfo
}

const updatesAvailable = (versionInfo) =>
  versionInfo.some(
    ({ latestCompatibleVersion, latestVersion }) =>
      latestCompatibleVersion != null || latestVersion != null
  )

const applySelectedVersions = (versionInfo, selectedVersions) => ({
  ...Object.fromEntries(
    versionInfo.map(({ packageName, currentVersion }) => [
      packageName,
      currentVersion
    ])
  ),
  ...selectedVersions
})

export const App = ({ allowUnstable }) => {
  const [toolVersionsPath, setToolVersionsPath] = useState(null)
  const [versionInfo, setVersionInfo] = useState(null)
  const [selectedVersions, setSelectedVersions] = useState(null)
  const [resultText, setResultText] = useState(null)

  useEffect(() => {
    locateToolVersions().then(setToolVersionsPath)
  }, [])

  useEffect(() => {
    if (toolVersionsPath == null) {
      return
    }
    readToolVersions(toolVersionsPath)
      .then((toolVersions) => getVersionInfo(toolVersions, allowUnstable))
      .then(setVersionInfo)
  }, [toolVersionsPath])

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
    writeToolVersions(toolVersionsPath, toolVersions).then(() =>
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
