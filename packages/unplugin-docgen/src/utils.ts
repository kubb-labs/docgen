import fs from 'node:fs'
import path from 'node:path'
import type { ComponentDoc } from 'react-docgen-typescript'
import reactDocgenTS from 'react-docgen-typescript'
import type { Options } from './types.ts'

function getAllRelevantTSFiles(dir: string): string[] {
  return fs.readdirSync(dir).flatMap((file: string) => {
    const fullPath = path.join(dir, file)
    const stats = fs.statSync(fullPath)

    if (stats.isDirectory()) {
      // Skip "mocks" or "__mocks__" folders
      if (file === 'mocks' || file === '__mocks__' || file === 'stories') {
        return []
      }
      return getAllRelevantTSFiles(fullPath)
    }

    const isValidFile = /\.(ts|tsx)$/.test(file) && !/\.spec\.(ts|tsx)$/.test(file) && !/\.scss\.d\.ts$/.test(file)

    return isValidFile ? [fullPath] : []
  })
}

function generateTable(filename: string, componentDoc: ComponentDoc[]) {
  const items = componentDoc.map((param) => {
    const { props } = param
    const PROP_TABLE_HEADER = '|Name|Description|Type|Default|\n|:---:|:---:|:---:|:---:|'

    const tableContent = Object.keys(props)
      .filter((propName) => {
        const { name, description } = props[propName]!
        return description || ['className', 'style', 'disabled', 'children'].indexOf(name) > -1
      })
      .map((propName) => {
        const { defaultValue, description, name, required, type } = props[propName]!
        const getType = () => `\`${type.name.replace(/\|/g, '\\|')}\`${required ? ' **(required)**' : ''}`
        const getDefaultValue = () => `\`${defaultValue?.value || '-'}\``

        const getDescription = () => {
          switch (name) {
            case 'className':
              return description || 'className'
            case 'style':
              return description || 'style'
            case 'children':
              return description || 'children'
            case 'disabled':
              return description || 'disabled'
            default:
              return description
          }
        }

        const formattedDescription = getDescription()
          // allow newline
          .replace(/\n/g, '&#10;')

        return `|${[name, formattedDescription, getType(), getDefaultValue()].map((str) => str.replace(/(?<!\\)\|/g, '&#124;')).join('|')}|`
      })

    return [
      param.displayName ? `## ${param.displayName}` : '',
      '### API',
      param.description ? `**${param.description}**\n` : '',
      tableContent?.length ? PROP_TABLE_HEADER : '',
      tableContent?.length ? tableContent.join('\n') : '',
    ].join('\n')
  })

  return `---
layout: doc
title: ${filename}
outline: deep
---

# ${filename}
${items.join('\n')}
`
}

type GetFilesProps = Pick<Options, 'root' | 'output'>

export async function getFiles({ root = process.cwd(), output }: GetFilesProps) {
  const srcDir = path.join(root, 'src')
  const outputBase = path.resolve(root, output?.path || '.')

  fs.mkdirSync(outputBase, { recursive: true })

  return getAllRelevantTSFiles(srcDir)
}

export async function generate(files: Array<string>, { root = process.cwd(), tsconfig = 'tsconfig.json', output }: Options) {
  const tsconfigPath = path.join(root, tsconfig)
  const srcDir = path.join(root, 'src')
  const outputBase = path.resolve(root, output?.path || './docs')

  const parser = reactDocgenTS.withCustomConfig(tsconfigPath, {
    savePropValueAsString: true,
    shouldExtractValuesFromUnion: true,
  })

  files.forEach((filePath: string) => {
    try {
      const relativePath = path.relative(srcDir, filePath)
      const outPath = path.join(outputBase, relativePath).replace(/\.(tsx|ts)$/, '.md')
      const filename = path.basename(filePath, path.extname(filePath))

      const componentDoc = parser.parse(filePath)
      if (!componentDoc.length) {
        return null
      }

      const markdown = generateTable(filename, componentDoc)

      fs.mkdirSync(path.dirname(outPath), { recursive: true })
      fs.writeFileSync(outPath, markdown)
      console.log(`✅ Generated docs: ${path.relative(outputBase, outPath)}`)
    } catch (err) {
      console.warn(`⚠️ Skipped ${filePath}: ${(err as Error).message}`)
    }
  })
}
