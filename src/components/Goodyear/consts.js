import moment from 'moment';

export const calHeight = 270;
export const cellHeight = 20;
export const yearHeight = 32;
export const yearLength = +moment.duration(1, 'year');

export function linear(x0, y0, a) {
  return {
    y(x) {
      return +y0 + (x - x0) * a;
    },

    x(y) {
      return +x0 + (y - y0) / a;
    },
  };
}

export function scheduleRAF() {
  let scheduledCb;
  let RAF;
  return function schedule(cb) {
    scheduledCb = cb;
    if (!RAF) {
      RAF = window.requestAnimationFrame(() => {
        scheduledCb();
        RAF = null;
        scheduledCb = null;
      });
    }
  };
}
