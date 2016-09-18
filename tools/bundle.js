/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fs from 'fs';
import webpack from 'webpack';
import webpackConfig from './webpack.config';

/**
 * Creates application bundles from the source files.
 */
function bundle() {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      process.nextTick(() => {
        const statsJson = stats.toJson('verbose');
        fs.writeFile(
          'webpack-stats.json',
          JSON.stringify(statsJson.children[0])
        );
      });

      console.log(stats.toString(webpackConfig[0].stats));
      return resolve();
    });
  });
}

export default bundle;
