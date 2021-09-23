/**
 * @const {
 *   [key: string]: {
 *     global?: boolean,
 *     replacement?: string,
 *   }
 * }
 */
module.exports = {
  clientHeight: {},
  clientLeft: {},
  clientTop: {},
  clientWidth: {},
  computedName: {},
  computedRole: {},
  getBoundingClientRect: {
    replacement: 'getBoundingClientRectAsync()',
  },
  getClientRects: {},
  getComputedAccessibleNode: { global: true },
  getComputedStyle: { global: true },
  getSelection: { global: true },
  innerHeight: { global: true },
  innerWidth: { global: true },
  offsetHeight: {},
  offsetLeft: {},
  offsetParent: {},
  offsetTop: {},
  offsetWidth: {},
  outerHeight: { global: true },
  outerWidth: { global: true },
  pageXOffset: { global: true },
  pageYOffset: { global: true },
  screenLeft: { global: true },
  screenTop: { global: true },
  screenX: { global: true },
  screenY: { global: true },
  scrollHeight: {},
  scrollLeft: {},
  scrollTop: {},
  scrollWidth: {},
  scrollX: { global: true },
  scrollY: { global: true },
  scrollingElement: {},
};
