/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ContentPage.scss';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import pr from 'isomorphic-style!css?minimize!prismjs/themes/prism-solarizedlight.css';

import Goodyear from '../Goodyear';

function Code({ text, language = 'jsx' }) {
  const attrs = { className: `language-${language}` };
  return (
    <pre { ...attrs }>
      <code { ...attrs }>
        <div
          dangerouslySetInnerHTML={{
            __html: Prism.languages[language]
              ? Prism.highlight(text, Prism.languages[language])
              : text,
          }}
        />
      </code>
    </pre>
  );
}

class ContentPage extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  render() {
    return (
      <div className={s.root}>
        <a
          className={s.github}
          href="https://github.com/hypnosphi/goodyear-react/"
          target="_blanc"
        >GitHub</a>
        <h2>Одна дата</h2>
        <div key="single">
          <Goodyear
            date={this.state.date}
            onChange={date => this.setState({ ...this.state, date })}
          />
        </div>
        <Code
          text={
`<Goodyear
  date={this.state.date}
  onChange={date => this.setState({ ...this.state, date })}
/>`
          }
        />
        <br />
        <h2>Диапазон дат</h2>
        <div>
          <Goodyear
            range
            from={this.state.from}
            to={this.state.to}
            onChange={({ from, to }) => this.setState({ ...this.state, from, to })}
          />
        </div>
        <Code
          text={
`<Goodyear
  range
  from={this.state.from}
  to={this.state.to}
  onChange={({ from, to }) => this.setState({ ...this.state, from, to })}
/>`
          }
        />
      </div>
    );
  }
}

export default withStyles(s)(withStyles(pr)(ContentPage));
