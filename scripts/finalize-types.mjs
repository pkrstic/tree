import { readFile, writeFile } from 'node:fs/promises'

// Vite extracts CSS into style.css. Consumers import it explicitly; the
// declaration entry must also work in projects without CSS module declarations.
const declaration = new URL('../dist/Tree.d.ts', import.meta.url)
const source = await readFile(declaration, 'utf8')
await writeFile(declaration, source.replace(/^import ['"]\.\/Tree\.css['"];?\r?\n/m, ''))
