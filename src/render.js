import ReactDOM from 'react-dom/server';
import Router from './routes';
import assets from './assets';
import fs from 'fs';
import path from 'path';

async function render(req, prefix = '') {
  let statusCode = 200;
  const template = require('./views/index.jade');
  const data = {
    title: '',
    description: '',
    css: '',
    body: '',
    entry: path.join(prefix, assets.main.js)
  };

  const css = [];
  const context = {
    insertCss: styles => css.push(styles._getCss()),
    onSetTitle: value => (data.title = value),
    onSetMeta: (key, value) => (data[key] = value),
    onPageNotFound: () => (statusCode = 404),
  };

  await Router.dispatch({ path: req.path, query: req.query, context }, (state, component) => {
    data.body = ReactDOM.renderToString(component);
    data.css = css.join('');
  });

  return {statusCode, html: template(data)};
}

render({}, 'build/public').then(({html}) => fs.writeFile(
  'index.html',
  html
));

export default render;


