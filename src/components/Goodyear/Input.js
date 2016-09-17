import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Goodyear.scss';
import cx from 'classnames';
import moment from 'moment';
import fa from 'isomorphic-style!css!font-awesome/css/font-awesome.css';

class Input extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      text: ''
    };
  }

  componentDidUpdate(prevProps) {
    if (!this.props.active && prevProps.active) {
      this.props.onConfirm();
      this.setState({
        ...this.state,
        text: ''
      });
    }
  }

  handleInput(text) {
    this.setState({
      ...this.state,
      text
    });
    const date = moment(text, this.props.formats);
    if (date.isValid()) {
      this.props.onActivate();
      this.props.onParse(date);
    }
  }

  render() {
    const {
      active,
      parsedDate,
      hoverDate,
      date,
      format,
      onActivate,
      onConfirm
    } = this.props;

    return (
      <div className={s.inputContainer}>
        <input
          ref={el => el && (active ? el.focus() : el.blur())}
          className={cx(
                s.input,
                active && s.focus
              )}
          value={active && hoverDate && hoverDate.format(format) || this.state.text || date && date.format(format) || ''}
          onChange={e => this.handleInput(e.target.value)}
          onFocus={onActivate}
          onBlur={e => {
            if (active && parsedDate) {
              this.setState({
                ...this.state,
                text: parsedDate.format(format)
              });
            }
          }}
          onKeyDown={e => e.key === 'Enter' && onConfirm()}
        />
        <i
          className={cx(
                s.icon,
                "fa",
                "fa-calendar"
              )}
          onClick={onActivate}
        />
      </div>
    );
  }
}

export default withStyles(fa, s)(Input);
