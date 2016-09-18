import React, { Component, PropTypes } from 'react';
import Month from './Month';
import MonthNames from './MonthNames';
import Years from './Years';
import {cellHeight, calHeight, linear} from './consts';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Goodyear.scss';
import cx from 'classnames';

function monthHeight(date) {
  const monthStart = moment(date).startOf('month');
  const daysSinceLastThursday = (monthStart.weekday() + 4) % 7;
  const monthLines = daysSinceLastThursday + monthStart.daysInMonth() > 32 ? 6.5 : 5.5;
  return monthLines * cellHeight;
}

// in milliseconds per pixel
function monthSpeed(date) {
  const monthStart = moment(date).startOf('month');
  const monthEnd = moment(date).endOf('month');
  return (monthEnd - monthStart) / monthHeight(monthStart);
}

function Weekdays() {
  let days = [];
  for (let i = 0; i < 7; i++) {
    days.push(moment().weekday(i).startOf('day'));
  }

  return (
    <div className={s.weekdays}>
      {days.map((day, i) => (
        <span
          className={cx(
            s.weekday,
            i > 4 && s.weekend
          )}
          key={+day}
        >
          {day.format('dd')}
        </span>
      ))}
    </div>
  );
}

function Months(props) {
  let scrollDate = moment(props.scrollDate);
  const monthStart = scrollDate.clone().startOf('month');

  let month = monthStart
    .clone()
    .subtract(2, 'months');
  let months = [month];
  for (let i = 0; i < 4; i++) {
    month = month
      .clone()
      .add(1, 'month');
    months.push(month);
  }

  const currentSpeed = monthSpeed(scrollDate);
  const pxToDate = linear(0, scrollDate, currentSpeed);
  const offset = pxToDate.X(monthStart); // is a negative number
  const bottomOffset = monthHeight(scrollDate) + offset;

  return (
    <div
      className={s.months}
      onWheel={e => {
        e.preventDefault();
        const dy = e.deltaY;
        let date;
        // adjust scroll speed to prevent glitches
        if (dy < offset) {
          date = pxToDate.Y(offset) + (dy - offset) * monthSpeed(months[1]);
        } else if (dy > bottomOffset) {
          date = pxToDate.Y(bottomOffset) + (dy - bottomOffset) * monthSpeed(months[3]);
        } else {
          date = pxToDate.Y(dy);
        }
        props.onScroll(date);
      }}
    >
      <Weekdays />
      <div
        style={{
          top: Math.floor(calHeight / 2 - monthHeight(months[0]) - monthHeight(months[1]) + offset)
        }}
        className={s.days}
      >
        {months.map(month => (
          <Month
            {...props}
            month={month}
            key={+month}
          />
        ))}
      </div>
      <MonthNames {...props}/>
    </div>
  );
}

function Calendar(props) {
  const {
    range,
    from,
    to,
    active,
    activeDate
  } = props;
  
  const currentRange = range && from && to && [from, to];
  let activeRange = null;
  if (range && activeDate) {
    switch (active) {
      case 'from':
        if (to && !activeDate.isAfter(to, 'days')) {
          activeRange = [activeDate, to];
        }
        break;
      case 'to': {
        if (!from) break;
        if (activeDate.isBefore(from, 'days')) {
          activeRange = [activeDate, from];
        } else {
          activeRange = [from, activeDate];
        }
      }
    }
  }
  
  const extendedProps = {
    ...props,
    currentRange,
    activeRange
  };

  return (
    <div
      className={s.calendar}
      hidden={!active}
    >
      <Months {...extendedProps} />
      <Years {...extendedProps} />
      <div className={s.marker} />
    </div>
  );
}

export default withStyles(s)(Calendar);
