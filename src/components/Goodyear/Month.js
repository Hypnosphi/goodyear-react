import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Goodyear.scss';
import cx from 'classnames';

function Day(props) {
  const {
    day,
    date,
    parsedDate,
    empty,
    onSelect,
    onHover
  } = props;
  return (
    <div
      className={cx(
        s.day,
        day.isSame(date, 'day') && s.current,
        day.isSame(moment(), 'day') && s.today,
        parsedDate && day.isSame(parsedDate, 'day') && s.parsed,
        day.weekday() > 4 && s.weekend,
        empty && s.empty
      )}
      onClick={() => onSelect(day)}
      onMouseOver={() => onHover(day)}
      onMouseOut={() => onHover()}
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

export default withStyles(Month, s);
