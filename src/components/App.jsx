import pMap from 'p-map'
import React, { useEffect, useState } from 'react'

import { runAsdf } from '../asdf/run.js'
import {
  locateToolVersions,
  readToolVersions,
  writeToolVersions
} from '../asdf/tool-versions.js'
import { Result } from '../constants.js'
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

export const App = ({ allowUnstable, onDone }) => {
  const [toolVersionsPath, setToolVersionsPath] = useState(null)
  const [versionInfo, setVersionInfo] = useState(null)
  const [selectedVersions, setSelectedVersions] = useState(null)

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
  }, [toolVersionsPath, allowUnstable])

  useEffect(() => {
    if (versionInfo == null) {
      return
    }
    if (versionInfo.length === 0) {
      onDone(Result.NO_TOOLS_CONFIGURED)
      return
    }
    if (!updatesAvailable(versionInfo)) {
      onDone(Result.ALL_TOOLS_UP_TO_DATE)
    }
  }, [versionInfo, onDone])

  useEffect(() => {
    if (selectedVersions == null) {
      return
    }
    if (Object.keys(selectedVersions).length === 0) {
      onDone(Result.NOTHING_TO_UPDATE)
      return
    }
    const toolVersions = applySelectedVersions(versionInfo, selectedVersions)
    writeToolVersions(toolVersionsPath, toolVersions).then(() => {
      onDone(Result.UPDATE_COMPLETED)
    })
  }, [selectedVersions, toolVersionsPath, versionInfo, onDone])

  if (selectedVersions != null) {
    return <ProgressIndicator>Saving...</ProgressIndicator>
  }

  if (versionInfo == null) {
    return <ProgressIndicator>Loading...</ProgressIndicator>
  }

  return <ToolGrid versionInfo={versionInfo} onConfirm={setSelectedVersions} />
}
