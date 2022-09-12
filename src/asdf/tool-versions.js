import { readFile, writeFile } from 'node:fs/promises'
import { EOL } from 'node:os'

import findUp from 'find-up'
import splitLines from 'split-lines'

const getToolVersionsPath = () => findUp.sync('.tool-versions')

export const readToolVersions = async () => {
  const versions = {}
  const data = await readFile(getToolVersionsPath(), 'utf8')
  for (const line of splitLines(data)) {
    const match = /(\S+)\s+(\S+)/.exec(line)
    if (match != null) {
      versions[match[1]] = match[2]
    }
  }
  return versions
}

export const writeToolVersions = async (versions) => {
  const data = Object.entries(versions)
    .map(([toolName, version]) => `${toolName} ${version}${EOL}`)
    .join('')
  await writeFile(getToolVersionsPath(), data, 'utf8')
}
