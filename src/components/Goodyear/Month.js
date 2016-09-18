import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Goodyear.scss';
import cx from 'classnames';


let hoverTO;

function Day(props) {
  const {
    day,
    range,
    from,
    to,
    activeDate,
    currentRange,
    activeRange,
    empty,
    onSelect,
    onHover
  } = props;

  function is(name) {
    return props[name] && isDay(props[name]);
  }

  function isDay(date) {
    return day.isSame(date, 'day');
  }

  function inRange(range) {
    return range && day.isBetween(...range, 'days');
  }

  const reverse = activeRange && activeRange[1] === from;

  return (
    <div
      className={cx(
        s.day,
        ['date', 'from', 'to'].some(is) && s.current,
        day.isSame(moment(), 'day') && s.today,
        is('activeDate') && s.active,
        (currentRange && isDay(currentRange[0]) && !reverse || activeRange && isDay(activeRange[0])) && s.from,
        (currentRange && isDay(currentRange[1]) || activeRange && isDay(activeRange[1])) && s.to,
        inRange(currentRange) && s.between,
        inRange(activeRange) && s.activeBetween,
        day.weekday() > 4 && s.weekend,
        empty && s.empty
      )}
      onClick={() => onSelect(day)}
      onMouseOver={() => {
        if (hoverTO) {
          window.clearTimeout(hoverTO);
          hoverTO = null;
        }
        onHover(day);
      }}
      onMouseOut={() => hoverTO = window.setTimeout(onHover, 0)}
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
