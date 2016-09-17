import React, { Component, PropTypes } from 'react';
import Calendar from './Calendar';
import Input from './Input';
import {formats} from './consts';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Goodyear.scss';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const initialState = {
  hoverDate: null,
  scrollDate: null,
  active: null,
  parsedDate: null
};

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
    this.state = initialState;
    this.onOuterClick = e => {
      if (!this.refs.root.contains(e.target)) {
        this.set('active', null);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.active && !prevState.active) {
      window.addEventListener('click', this.onOuterClick);
    } else if (!this.state.active && prevState.active) {
      window.removeEventListener('click', this.onOuterClick);
    }

    if (!this.props.range) {
      if (this.props.date && !sameDay(this.props.date, prevProps.date)) this.set(initialState);
    } else {
      if (this.props.from && !sameDay(this.props.from, prevProps.from)) {
        this.set({
          active: 'to',
          parsedDate: null
        });
      } else if (this.props.to && !sameDay(this.props.to, prevProps.to)) {
        this.set(this.state.active === 'to' && this.props.from
          ? initialState
          : {
            parsedDate: null,
            active: 'from'
          });
      }
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
    if (!this.props.range) return this.props.onChange(changes.date);

    let {from, to} = {
      ...this.props,
      ...changes
    };

    if (from && to && from.isAfter(to, 'days')) {
      if (this.state.active === 'from') {
        to = null;
      } else if (this.state.active === 'to') {
        from = null;
      }
    }

    this.props.onChange({from, to});
  }

  render() {
    const extendedFormats = [
      this.props.format,
      ...formats
    ];

    const names = this.props.range ? ['from', 'to'] : ['date'];
    const dates = names.reduce((obj, key) => {
      let date = this.props[key] && moment(this.props[key], extendedFormats);
      if (date && !date.isValid()) date = null;
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
            key={name}
            date={dates[name]}
            formats={extendedFormats}
            active={this.state.active === name}
            hoverText={this.state.hoverText}
            parsedDate={this.state.parsedDate}
            onActivate={() => this.set('active', name)}
            onParse={date => this.set({
              parsedDate: date,
              scrollDate: date
            })}
            onConfirm={() => this.state.parsedDate && this.select({[name]: this.state.parsedDate})}
          />
        ))}
        <Calendar
          {...this.props}
          active={this.state.active}
          scrollDate={this.state.scrollDate || dates[this.state.active] || moment()}
          activeDate={this.state.hoverDate || this.state.parsedDate}
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

