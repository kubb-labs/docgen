import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { createFilter } from 'unplugin-utils'
import type { Options } from './types.ts'
import { generate } from './utils.ts'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options = {}) => {
  const name = 'unplugin-docgen' as const

  const filter = createFilter(['**/*.ts', '**/*.tsx'], ['**/node_modules/**'])

  const files = new Set<string>()

  return {
    name,
    buildStart() {
      files.clear()
    },
    load(id) {
      if (filter(id)) {
        files.add(id)
      }

      return null
    },
    async buildEnd() {
      await generate([...files], {
        ...options,
      })
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
