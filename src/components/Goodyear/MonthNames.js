import React, { Component, PropTypes } from 'react';
import {cellHeight, yearLength} from './consts';
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

    this.onMouseMove = e => {
      this.props.onScroll(this.props.scrollDate + e.movementY / (12 * cellHeight) * yearLength);
    };
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
    const sides = ['top', 'middle', 'bottom']

    return (
      <div>
        {sides.map((side, i) => (
          <div
            key={side}
            className={cx(
              s.slider,
              this.state.dragging && s.dragging
            )}
            style={{
                top: Math.floor(((this.props.offset + i - 1) * 12 - 1) * cellHeight)
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

  const yearStart = scrollDate
    .clone()
    .startOf('year');
  const offset = (scrollDate - yearStart) / yearLength;

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
      <Slider
        {...props}
        offset={offset}
      />
    </div>
  );
}

export default withStyles(s)(MonthNames);
