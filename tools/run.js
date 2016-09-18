/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import moment from 'moment';

function run(fn, options) {
  console.log('asdgfs');
  const task = typeof fn.default === 'undefined' ? fn : fn.default;
  const start = moment();
  console.log(`[${start.format('HH:mm:ss')}] Starting '${task.name}'...`);
  return task(options).then(() => {
    const end = moment();
    const time = end - start;
    console.log(`[${end.format('HH:mm:ss')}] Finished '${task.name}' after ${time} ms`);
  });
}

if (process.mainModule.children.length === 1 && process.argv.length > 2) {
  delete require.cache[__filename];
  const module = require(`./${process.argv[2]}.js`).default;
  run(module).catch(err => console.error(err.stack));
}

export default run;
