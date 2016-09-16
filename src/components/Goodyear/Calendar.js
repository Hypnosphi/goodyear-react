import React, { Component, PropTypes } from 'react';
import Month from './Month';
import MonthNames from './MonthNames';
import {cellHeight, calHeight, yearLength, yearHeight} from './consts';
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
  let month = scrollDate
    .clone()
    .startOf('month')
    .subtract(2, 'months');
  let months = [month];
  for (let i = 0; i < 4; i++) {
    month = month
      .clone()
      .add(1, 'month');
    months.push(month);
  }

  const monthStart = scrollDate.clone().startOf('month');
  const currentSpeed = monthSpeed(scrollDate);
  const offset = (scrollDate - monthStart) / currentSpeed;
  const bottomOffset = monthHeight(scrollDate) - offset;

  return (
    <div
      className={s.months}
      onWheel={e => {
        e.preventDefault();
        const dy = e.deltaY;
        let dt;
        // adjust scroll speed to prevent glitches
        if (dy < -offset) {
          dt = -offset * currentSpeed + (dy + offset) * monthSpeed(months[1]);
        } else if (dy > bottomOffset) {
          dt = bottomOffset * currentSpeed + (dy - bottomOffset) * monthSpeed(months[3]);
        } else {
          dt = dy * currentSpeed;
        }
        props.onScroll(scrollDate + dt);
      }}
    >
      <Weekdays />
      <div
        style={{
          top: Math.floor(calHeight / 2 - monthHeight(months[0]) - monthHeight(months[1]) - offset)
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

function Years(props) {
  let scrollDate = moment(props.scrollDate);
  let year = scrollDate
    .clone()
    .startOf('year')
    .subtract(5, 'years');
  const years = [year];
  for (let i = 0; i < 10; i++) {
    year = year
      .clone()
      .add(1, 'year');
    years.push(year);
  }

  const yearStart = scrollDate.clone().startOf('year');
  const speed = yearLength / yearHeight;
  const offset = (scrollDate - yearStart) / speed;

  return (
    <div
      className={s.years}
      onWheel={e => {
        e.preventDefault();
        props.onScroll(scrollDate + e.deltaY * speed);
      }}
      style={{
        top: Math.floor(calHeight / 2 - 5 * yearHeight - offset)
      }}
    >
      {years.map(year => (
        <div
          key={+year}
          className={cx(
            s.year,
            year.isSame(scrollDate, 'year') && s.currentYear,
            year.isSame(moment(), 'year') && s.today
          )}
          onClick={() => props.onScroll(scrollDate.year(year.year()))}
        >
          {year.format('YYYY')}
        </div>
      ))}
    </div>
  );
}

function Calendar(props) {
  return (
    <div
      className={s.calendar}
      hidden={!props.open}
    >
      <Months {...props} />
      <Years {...props} />
      <div className={s.marker} />
    </div>
  );
}

export default withStyles(Calendar, s);
