import fs from './lib/fs';

export default async function index() {
  const assets = require('../build/assets');
  const render = require('../src/render');
  const {html} = await render(assets);
  await fs.writeFile(
    'index.html',
    html
  );
}
