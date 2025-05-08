import { readFile, writeFile } from 'node:fs/promises'
import { EOL } from 'node:os'

import { findUp } from 'find-up'
import splitLines from 'split-lines'

export const locateToolVersions = async () => {
  const cwd = process.cwd()
  const toolVersionsPath = await findUp('.tool-versions', { cwd })
  if (toolVersionsPath == null) {
    throw new Error(`Failed to locate .tool-versions in ${cwd}`)
  }
  return toolVersionsPath
}

export const readToolVersions = async (toolVersionsPath) => {
  const versions = {}
  const data = await readFile(toolVersionsPath, 'utf8')
  for (const line of splitLines(data)) {
    const match = /(\S+)\s+(\S+)/.exec(line)
    if (match != null) {
      versions[match[1]] = match[2]
    }
  }
  return versions
}

export const writeToolVersions = async (toolVersionsPath, versions) => {
  const data = Object.entries(versions)
    .map(([packageName, version]) => `${packageName} ${version}${EOL}`)
    .join('')
  await writeFile(toolVersionsPath, data, 'utf8')
}
