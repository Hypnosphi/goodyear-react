import React, { Component, PropTypes } from 'react';
import Calendar from './Calendar';
import Input from './Input';
import {formats} from './consts';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Goodyear.scss';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

function sameDay(next, prev) {
  const nextMoment = moment(next);
  const prevMoment = moment(prev);
  if (nextMoment.isValid() && prevMoment.isValid()) {
    return nextMoment.isSame(prevMoment, 'day');
  } else {
    return next === prev;
  }
}

class Goodyear extends Component {
  constructor(...args) {
    super(...args);
    Object.assign(this, {
      parsed: Object.create(null),
      state: {
        text: '',
        hoverDate: null,
        scrollDate: null,
        active: null
      },
      onOuterClick: e => {
        if (!this.refs.root.contains(e.target)) {
          this.set('active', null);
        }
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.active !== prevState.active) {
      if (!prevState.active) {
        window.addEventListener('click', this.onOuterClick);
        window.addEventListener('focusin', this.onOuterClick);
      } else if (!this.state.active) {
        window.removeEventListener('click', this.onOuterClick);
        window.removeEventListener('focusin', this.onOuterClick);
      }

      this.state.text && prevState.active && this.confirm(prevState.active);
      this.set('text', '');
    }

    const name = this.state.active;
    if (this.props[name] && !sameDay(this.props[name], prevProps[name])){
      this.set('text', '');
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

  select(changes) {
    if (!this.props.range) {
      this.set({
        active: null,
        text: ''
      });
      return this.props.onChange(changes.date);
    }

    let {from, to} = {
      ...this.props,
      ...changes
    };

    // proceed to setting the end by default
    let active = 'to';

    // end is before beginning
    if (from && to && from.isAfter(to, 'days')) {
      // ignore the old end when beginning is changed
      if (changes.from) {
        to = null;
      // treat range as reverse when end is changed
      } else if (changes.to) {
        to = from;
        from = changes.to;
      }
    } else if (changes.to) {
      // proceed to setting the beginning if it's absent, otherwise we're done
      active = from ? null : 'from';
    }

    this.set({
      active,
      hoverDate: null,
      text: ''
    });
    this.props.onChange({from, to});
  }

  parseDate(text) {
    if (!(text in this.parsed)) {
      const extendedFormats = [
        this.props.format,
        ...formats
      ];
      const date = moment(text, extendedFormats);
      this.parsed[text] = date.isValid() ? date : null;
    }

    return this.parsed[text];
  }

  confirm(name) {
    this.select({
      [name]: this.parseDate(this.state.text) || this.props[name]
    });
  }

  render() {
    const names = this.props.range ? ['from', 'to'] : ['date'];
    const dates = names.reduce((obj, key) => {
      const date = this.parseDate(this.props[key]);
      return {...obj, [key]: date};
    }, {});
    return (
      <div
        className={s.goodyear}
        ref="root"
      >
        {names.map(name => (
          <Input
            {...this.props}
            {...this.state}
            key={name}
            date={dates[name]}
            active={this.state.active === name}
            onActivate={() => this.set('active', name)}
            onInput={text => {
              this.set({
                text,
                scrollDate: this.parseDate(text) || this.state.scrollDate
              })
            }}
            onConfirm={() => this.confirm(name)}
          />
        ))}
        <Calendar
          {...this.props}
          {...this.state}
          scrollDate={this.state.scrollDate || dates[this.state.active] || moment()}
          activeDate={this.state.hoverDate || this.state.text && this.parseDate(this.state.text)}
          onScroll={scrollDate => this.set({scrollDate})}
          onHover={date => this.set('hoverDate', date)}
          onSelect={date => this.select({[this.state.active]: date})}
        />
      </div>
    );
  }
}

Goodyear.defaultProps = {
  date: null,
  range: false,
  from: null,
  to: null,
  format: 'D MMMM YYYY г.',
  onChange: Function.prototype // noop function
};

export default withStyles(s)(Goodyear);

