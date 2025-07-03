import { createUnplugin } from 'unplugin'

import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types.ts'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
  const name = 'unplugin-docgen' as const


  return {
    name,
    enforce: 'pre',
    async buildStart() {
      console.log(options)
    }
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
