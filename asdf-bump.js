#!/usr/bin/env node

import ansiColors from 'ansi-colors'
import { execa } from 'execa'
import { readFile, writeFile } from 'node:fs/promises'
import { EOL } from 'node:os'
import { resolve } from 'node:path'
import * as readline from 'node:readline/promises'

let rl

const tokenize = (str) => [...str.matchAll(/(\S+)/g)].map(([, m1]) => m1)

const splitLines = (str) => str.trimRight().split(EOL)

const openReadline = () => {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
}

const closeReadline = () => {
  rl.close()
}

const prompt = async (text) => await rl.question(ansiColors.bold(text + ': '))

const getToolVersionsPath = () => resolve(process.cwd(), '.tool-versions')

const asdf = async (args) => {
  const { stdout } = await execa('asdf', args, {
    stdio: ['inherit', 'pipe', 'inherit']
  })
  return splitLines(stdout.toString())
}

const getLatestVersion = async (toolName) =>
  (await asdf(['latest', toolName]))[0]

const listAllVersions = async (toolName) =>
  await asdf(['list', 'all', toolName])

const readToolVersions = async () => {
  const versions = new Map()
  const data = await readFile(getToolVersionsPath(), 'utf8')
  for (const line of splitLines(data)) {
    const [, toolName, version] = /(\S+)\s+(\S+)/.exec(line)
    versions.set(toolName, version)
  }
  return versions
}

const writeToolVersions = async (versions) => {
  const data = [...versions.entries()]
    .map(([toolName, version]) => `${toolName} ${version}${EOL}`)
    .join('')
  await writeFile(getToolVersionsPath(), data, 'utf8')
}

const addLatestVersions = async (toolVersions) => {
  const versionInfo = new Map()
  await Promise.all(
    [...toolVersions.entries()].map(async ([toolName, currentVersion]) => {
      const latestVersion = await getLatestVersion(toolName)
      versionInfo.set(toolName, { currentVersion, latestVersion })
    })
  )
  return versionInfo
}

const addAllVersions = async (currentAndLatestVersion) => {
  const versionInfo = new Map()
  await Promise.all(
    [...currentAndLatestVersion.entries()].map(async ([toolName, info]) => {
      const allVersions = await listAllVersions(toolName)
      versionInfo.set(toolName, { ...info, allVersions })
    })
  )
  return versionInfo
}

const printVersionLine = (toolName, currentVersion, latestVersion, color) => {
  console.log(
    color(
      [
        toolName.padEnd(24),
        currentVersion.padStart(12),
        latestVersion.padStart(12)
      ].join('')
    )
  )
}

const printVersionInfo = (versionInfo) => {
  console.log()
  printVersionLine('Tool', 'Current', 'Latest', ansiColors.bold)
  console.log()
  const entries = [...versionInfo.entries()].sort(([a], [b]) =>
    a.localeCompare(b)
  )
  for (const [toolName, { currentVersion, latestVersion }] of entries) {
    const color =
      currentVersion === latestVersion ? ansiColors.dim : ansiColors.yellow
    printVersionLine(toolName, currentVersion, latestVersion, color)
  }
}

const getUpdatableTools = (versionInfo) =>
  [...versionInfo.entries()]
    .filter(
      ([, { currentVersion, latestVersion }]) =>
        currentVersion !== latestVersion
    )
    .map(([toolName]) => toolName)

const getToolsToUpdate = async (updatableTools) => {
  let choices
  console.log()
  while (true) {
    const line = await prompt('Tools to update')
    choices = tokenize(line)
    if (choices.every((toolName) => updatableTools.includes(toolName))) {
      break
    }
    console.log(ansiColors.red('Invalid tool name!'))
    console.log()
  }
  return [...new Set(choices)]
}

const getNewToolVersions = async (versionInfoUpdatable) => {
  const updates = new Map()
  for (const [
    toolName,
    { currentVersion, latestVersion, allVersions }
  ] of versionInfoUpdatable) {
    console.log()
    console.log(
      ansiColors.cyan(`Ready to update ${ansiColors.bold(toolName)}...`)
    )
    console.log()
    console.log(`Current version: ${ansiColors.yellow(currentVersion)}`)
    console.log(`Latest version:  ${ansiColors.green(latestVersion)}`)
    console.log(`All versions:    ${allVersions.join(' ')}`)
    while (true) {
      console.log()
      const newVersion = await prompt(`New ${toolName} version`)
      if (allVersions.includes(newVersion)) {
        if (newVersion !== currentVersion) {
          updates.set(toolName, newVersion)
        } else {
          console.log(`Already using ${toolName} ${newVersion}`)
        }
        break
      }
      console.log(ansiColors.red('Invalid version!'))
    }
  }
  return updates
}

const applyUpdates = async (toolVersions, updates) => {
  console.log()
  console.log(`Applying ${updates.size} update(s)...`)
  await writeToolVersions(new Map([...toolVersions, ...updates]))
  console.log('Completed!')
  console.log()
}

const main = async () => {
  const toolVersions = await readToolVersions()
  const versionInfo = await addLatestVersions(toolVersions)
  printVersionInfo(versionInfo)
  const updatableTools = getUpdatableTools(versionInfo)
  if (updatableTools.length === 0) {
    console.log()
    console.log(
      ansiColors.greenBright(ansiColors.bold('Everything up to date!'))
    )
    console.log()
    return
  }
  const toolsToUpdate = await getToolsToUpdate(updatableTools)
  if (toolsToUpdate.length === 0) {
    console.log()
    console.log('No tools to update')
    console.log()
    return
  }
  const toolsToUpdateVersionInfo = new Map(
    toolsToUpdate.map((toolName) => [toolName, versionInfo.get(toolName)])
  )
  const versionInfoUpdatable = await addAllVersions(toolsToUpdateVersionInfo)
  const updates = await getNewToolVersions(versionInfoUpdatable)
  if (updates.size === 0) {
    console.log()
    console.log('No tools to update')
    console.log()
    return
  }
  await applyUpdates(toolVersions, updates)
}

try {
  openReadline()
  await main()
} finally {
  closeReadline()
}
