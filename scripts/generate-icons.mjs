import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'public', 'icon.svg')

await Promise.all([
  sharp(source).resize(192, 192).png().toFile(path.join(root, 'public', 'pwa-192.png')),
  sharp(source).resize(512, 512).png().toFile(path.join(root, 'public', 'pwa-512.png')),
  sharp(source).resize(512, 512).extend({ top: 64, bottom: 64, left: 64, right: 64, background: '#071b24' }).resize(512, 512).png().toFile(path.join(root, 'public', 'pwa-maskable-512.png')),
  sharp(source).resize(180, 180).png().toFile(path.join(root, 'public', 'apple-touch-icon.png'))
])
