/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ContentPage.scss';
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import pr from 'isomorphic-style!css!prismjs/themes/prism-solarizedlight.css';

import Goodyear from '../Goodyear';

const md = new MarkdownIt({
  highlight(str, lang) {
    if (lang && Prism.languages[lang]) {
      try {
        return Prism.highlight(str, Prism.languages[lang]);
      } catch (e) {}
    }

    return '';
  }
});

function Markup({text}) {
  return <div dangerouslySetInnerHTML={{ __html: md.render(text) }}/>;
}

class ContentPage extends Component {
  constructor(...args) {
    super(...args);
    this.state = {}
  }

  render() {
    return (
      <div className={s.root}>
        <h2>Одна дата</h2>
        <div key="single">
          <Goodyear
            date={this.state.date}
            onChange={date => this.setState({...this.state, date})}
          />
        </div>
        <Markup text={`
\`\`\`jsx
<Goodyear
  date={this.state.date}
  onChange={date => this.setState({...this.state, date})}
/>
\`\`\`
          `}/>
        <br/>
        <h2>Диапазон дат</h2>
        <div>
          <Goodyear
            range={true}
            from={this.state.from}
            to={this.state.to}
            onChange={({from, to}) => this.setState({...this.state, from, to})}
          />
        </div>
        <Markup text={`
\`\`\`jsx
<Goodyear
  range={true}
  from={this.state.from}
  to={this.state.to}
  onChange={({from, to}) => this.setState({...this.state, from, to})}
/>
\`\`\`
          `}/>
      </div>
    );
  }
}

export default withStyles(s)(withStyles(pr)(ContentPage));
