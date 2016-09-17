import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Goodyear.scss';
import cx from 'classnames';
import moment from 'moment';
import fa from 'isomorphic-style!css!font-awesome/css/font-awesome.css';

function Input ({
  active,
  text,
  hoverDate,
  date,
  format,
  onInput,
  onActivate,
  onConfirm
}) {
  return (
    <div className={s.inputContainer}>
      <input
        ref={el => el && (active ? el.focus() : el.blur())}
        className={cx(
              s.input,
              active && s.focus
            )}
        value={active && (hoverDate && hoverDate.format(format) || text)
            || date && date.format(format) || ''}
        onChange={e => onInput(e.target.value)}
        onFocus={onActivate}
        onKeyDown={e => e.key === 'Enter' && onConfirm()}
      />
      <i
        className={cx(
              s.icon,
              "fa",
              "fa-calendar"
            )}
        onClick={onActivate}
      />
    </div>
  );
}

export default withStyles(fa, s)(Input);
