import React, { Component, PropTypes } from 'react';
import {cellHeight, yearLength, linear} from './consts';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Goodyear.scss';
import cx from 'classnames';

class Slider extends Component {
  constructor(...attrs) {
    super(...attrs);
    this.state = {
      dragging: false
    };

    this.onMouseUp = () => {
      this.setState({dragging: false});
    };

    this.onMouseMove = e => this.props.onScroll(
      linear(0, this.props.scrollDate, yearLength/(12 * cellHeight)).Y(e.movementY)
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.dragging && !prevState.dragging) {
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.dragging && prevState.dragging) {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  render() {
    let year = moment(this.props.scrollDate)
      .startOf('day')
      .subtract(1, 'year');
    const years = [year];
    for (let i = 0; i < 2; i++) {
      year = year
        .clone()
        .add(1, 'year');
      years.push(year);
    }

    return (
      <div>
        {years.map(year => (
          <div
            key={+year}
            className={cx(
              s.slider,
              this.state.dragging && s.dragging
            )}
            style={{
                top: Math.floor(this.props.pxToDate.X(year) - cellHeight)
            }}
            onMouseDown={e => {
              this.setState({dragging: true});
            }}
          />
        ))}
      </div>
    );
  }
}

function MonthNames(props) {
  const scrollDate = moment(props.scrollDate);
  let months = [];
  for (let i = 0; i < 12; i++) {
    months.push(
      scrollDate
        .clone()
        .month(i)
        .startOf('month')
    );
  }

  const pxToDate = linear(
    0,
    moment(props.scrollDate).startOf('year'),
    yearLength/(12 * cellHeight)
  );

  return (
    <div className={s.monthNames}>
      {months.map(month => (
        <div
          className={cx(
            s.monthName,
            month.isSame(moment(), 'month') && s.today
          )}
          key={+month}
          onClick={() => {
            const end = month
              .clone()
              .endOf('month');
            props.onScroll((month + end) / 2);
          }}
        >
          {month.format('MMM')}
        </div>
      ))}
      {['currentRange', 'activeRange'].map(name => {
        const range = props[name];
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
      <Slider {...props} pxToDate={pxToDate}/>
    </div>
  );
}

export default withStyles(s)(MonthNames);
