// Install approved kit exports and render the social card with the supplied mark.
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { site } from '../src/site.config.mjs';

const kit = new URL('../brand/logo-kit/', import.meta.url);
const output = new URL('../public/', import.meta.url);
await mkdir(new URL('brand/', output), { recursive: true });
for (const name of ['favicon.ico', 'favicon-16.png', 'favicon-32.png', 'favicon-48.png', 'icon-192.png', 'icon-512.png', 'maskable-512.png', 'site.webmanifest']) {
  await copyFile(new URL(name, kit), new URL(name, output));
}
for (const name of ['promptsbaba-symbol-white.png', 'promptsbaba-symbol-espresso.png', 'promptsbaba-symbol-color.png']) {
  await copyFile(new URL(name, kit), new URL('brand/' + name, output));
}
await copyFile(new URL('promptsbaba-icon-transparent-512.png', kit), new URL('logo.png', output));
const appIcon = await readFile(new URL('promptsbaba-app-icon-512.png', kit));
await sharp(appIcon).resize(180, 180).png().toFile(new URL('apple-touch-icon.png', output).pathname);
const mark = await sharp(appIcon).resize(80, 80).png().toBuffer();
const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0B0F17"/><text x="170" y="114" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="#F8FAFC">${site.name}</text><text x="70" y="285" font-family="Arial, sans-serif" font-size="84" font-weight="700" letter-spacing="-4" fill="#F8FAFC">Stop guessing.</text><text x="70" y="385" font-family="Arial, sans-serif" font-size="84" font-weight="700" letter-spacing="-4" fill="#F8FAFC">Ask the Baba.</text><path d="M70 445h1060" stroke="#1E293B"/><text x="70" y="505" font-family="Arial, sans-serif" font-size="26" fill="#94A3B8">Free AI prompts. Useful agent skills. No account needed.</text><text x="70" y="565" font-family="Arial, sans-serif" font-size="22" fill="#E87516">promptsbaba.com</text></svg>`;
await sharp(Buffer.from(card)).composite([{ input: mark, left: 70, top: 60 }]).png().toFile(new URL('og.png', output).pathname);
console.log('Installed the PromptsBaba logo kit, browser/app icons, touch icon and social image.');
