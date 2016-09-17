import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Goodyear.scss';
import cx from 'classnames';


let TO;

function Day(props) {
  const {
    day,
    range,
    from,
    to,
    active,
    activeDate,
    empty,
    onSelect,
    onHover
  } = props;

  const hoverFrom = range && activeDate && active === 'from' && to;
  const hoverTo = range && activeDate && active === 'to' && from;
  const reverse = hoverTo && activeDate.isBefore(from, 'days');

  function is(name) {
    return props[name] && day.isSame(props[name], 'day');
  }

  return (
    <div
      className={cx(
        s.day,
        ['date', 'from', 'to'].some(is) && s.current,
        day.isSame(moment(), 'day') && s.today,
        is('activeDate') && s.active,
        (is('from') && !reverse || (hoverFrom || reverse) && is('activeDate')) && s.from,
        (is('to') || is('from') && reverse || hoverTo && !reverse && is('activeDate')) && s.to,
        range && from && to && day.isBetween(from, to, 'days') && s.between,
        (
          hoverFrom && day.isBetween(activeDate, to, 'days') ||
          reverse && from && day.isBetween(activeDate, from, 'days') ||
          hoverTo && from && day.isBetween(from, activeDate, 'days')
        ) && s.activeBetween,
        day.weekday() > 4 && s.weekend,
        empty && s.empty
      )}
      onClick={() => onSelect(day)}
      onMouseOver={() => {
        if (TO) {
          window.clearTimeout(TO);
          TO = null;
        }
        onHover(day);
      }}
      onMouseOut={() => TO = window.setTimeout(onHover, 0)}
    >
      {empty || day.format('D')}
    </div>
  );
}

function Month(props) {
  const start = props.month;
  const end = start
    .clone()
    .endOf('month');

  // pad with empty cells starting from last thursday
  const weekday = start.weekday();
  let day = start
    .clone()
    .weekday(weekday >= 3 ? 3 : -4);
  let days = [];
  while (day < end) {
    days.push(day)
    day = day
      .clone()
      .add(1, 'day');
  }

  return (
    <div className={s.month}>
      <span className={s.monthTitle}>
        {props.month.format('MMMM')}
      </span>
      {days.map(day => (
        <Day
          {...props}
          day={day}
          empty={day < start}
          key={+day}
        />
      ))}
    </div>
  );
}

export default withStyles(s)(Month);
