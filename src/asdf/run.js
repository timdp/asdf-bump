import { execa, ExecaError } from 'execa'
import splitLines from 'split-lines'

export const runAsdf = async (args, stream = false, allowExit1 = false) => {
  let result
  try {
    result = await execa('asdf', args, {
      stdio: ['inherit', stream ? 'inherit' : 'pipe', 'inherit']
    })
  } catch (error) {
    // Workaround for https://github.com/asdf-vm/asdf/issues/1893
    if (!(allowExit1 && error instanceof ExecaError && error.exitCode === 1)) {
      throw error
    }
  }
  if (stream) {
    return
  }
  return splitLines(result.stdout.toString())
}
