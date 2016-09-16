import React, { Component, PropTypes } from 'react';
import Calendar from './Calendar';
import {formats} from './consts';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Goodyear.scss';
import cx from 'classnames';
import moment from 'moment';
import 'moment/locale/ru';
import fa from 'isomorphic-style!css!font-awesome/css/font-awesome.css';

moment.locale('ru');

const initialState = {
  text: '',
  scrollDate: null,
  open: false,
  parsedDate: null
};
class Goodyear extends Component {
  constructor(...args) {
    super(...args);
    this.state = initialState;
    this.onOuterClick = e => {
      if (!this.refs.root.contains(e.target)) {
        this.set('open', false);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.open && !prevState.open) {
      window.addEventListener('click', this.onOuterClick);
    } else if (!this.state.open && prevState.open) {
      window.removeEventListener('click', this.onOuterClick);
    }
  }

  set(key = {}, value) {
    let extension = {};
    if (typeof key === 'object') {
      extension = key;
    } else {
      extension[key] = value;
    }
    this.setState({
      ...this.state,
      ...extension
    })
  }

  select(date) {
    this.props.onChange(date);
    this.set(initialState);
  }

  handleInput(text) {
    const date = moment(text, this.formats);
    if (date.isValid()) {
      this.set({
        text,
        parsedDate: date,
        scrollDate: date,
        open: true
      });
    } else {
      this.set({text});
    }
  }

  render() {
    //console.log(this.props, this.state);
    this.formats = [
      this.props.format,
      ...formats
    ];

    let date = moment(this.props.date, this.formats);
    if (!date.isValid()) date = moment();

    return (
      <div
        className={s.goodyear}
        ref="root"
      >
        <div className={s.inputContainer}>
          <input
            ref={el => {
              if (!el) return;
              if(this.state.open) {
                el.focus();
                if (!this.state.parsedDate) {
                  el.select();
                }
              } else {
                el.selectionEnd = 0;
              }
            }}
            className={cx(
              s.input,
              this.state.open && s.focus
            )}
            value={this.state.hoverText || this.state.text || date.format(this.props.format)}
            onChange={e => this.handleInput(e.target.value)}
            onFocus={e => this.set('open', true)}
            onBlur={e => {
              if (this.state.parsedDate) {
                this.set('text', this.state.parsedDate.format(this.props.format));
              } else {
                // can't use e.select() here as it returns focus
                e.target.selectionEnd = e.target.value.length;
              }
            }}
            onKeyDown={e => e.key === 'Enter' && this.select(this.state.parsedDate || this.props.date)}
          />
          <i
            className={cx(
              s.icon,
              "fa",
              "fa-calendar"
            )}
            onClick={() => this.set('open', true)}
          />
        </div>
        <Calendar
          open={this.state.open}
          scrollDate={this.state.scrollDate || date}
          parsedDate={this.state.parsedDate}
          date={date}
          onScroll={scrollDate => this.set({scrollDate})}
          onHover={date => this.set({
            hoverText: date && date.format(this.props.format)
          })}
          onSelect={date => this.select(date)}
        />
      </div>
    );
  }
}

Goodyear.defaultProps = {
  date: moment(),
  format: 'D MMMM YYYY г.',
  onChange: Function.prototype // noop function
};

export default withStyles(Goodyear, fa, s);

