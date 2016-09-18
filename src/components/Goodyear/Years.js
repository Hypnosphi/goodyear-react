import React, { Component, PropTypes } from 'react';
import {calHeight, yearLength, yearHeight, linear} from './consts';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Goodyear.scss';
import cx from 'classnames';

let scrollTO;

class Years extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      scrollDate: null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.stoppedScrolling = prevState.scrollDate && !this.state.scrollDate;
  }

  setYear(date) {
    if (scrollTO) {
      window.clearTimeout(scrollTO);
      scrollTO = null;
    }
    this.setState({
      ...this.state,
      scrollDate: null
    });
    this.props.onScroll(
      moment(this.props.scrollDate)
        .year(moment(date).year())
    );
  }

  render() {
    let date = moment(this.state.scrollDate || this.props.scrollDate);
    const yearStart = date.clone().startOf('year');
    let year = yearStart
      .clone()
      .subtract(5, 'years');
    const years = [year];
    for (let i = 0; i < 10; i++) {
      year = year
        .clone()
        .add(1, 'year');
      years.push(year);
    }
    console.log(years.map(y => y.format()))

    const pxToDate = linear(0, years[0], yearLength / yearHeight);

    return (
      <div
        className={s.years}
        onWheel={e => {
          e.preventDefault();
          const scrollDate = linear(0, date , yearLength / yearHeight)
              .Y(e.deltaY);
          this.setState({
            ...this.state,
            scrollDate
          });
          if (scrollTO) window.clearTimeout(scrollTO);
          scrollTO = window.setTimeout(() => this.setYear(scrollDate), 100);
        }}
        style={{
          transition: this.stoppedScrolling ? 'top .2s ease-out 0s' : 'none',
          top: Math.floor(calHeight / 2 - pxToDate.X(date))
        }}
      >
        {years.map(year => (
          <div
            key={+year}
            className={cx(
              s.year,
              year.isSame(date, 'year') && s.currentYear,
              year.isSame(moment(), 'year') && s.today
            )}
            onClick={() => this.setYear(year)}
          >
            {year.format('YYYY')}
          </div>
        ))}
        {['currentRange', 'activeRange'].map(name => {
          const range = this.props[name];
          if (!range) return;
          const [top, bottom] = range.map(date => Math.floor(pxToDate.X(date)));
          if (bottom - top <= 2) return;
          return (
            <div
              key={name}
              className={cx(
                s.range,
                s[name]
              )}
              style={{
                top : top - 1,
                height: bottom - top + 2
              }}
            />
          )
        })}
      </div>
    );
  }
}

export default withStyles(s)(Years);
