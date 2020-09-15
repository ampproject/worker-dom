/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

!(function () {
  'use strict';
  function e(e, t, n) {
    (this.nodeName = e), (this.attributes = t), (this.children = n), (this.key = t && t.key);
  }
  function t(t, n) {
    var o = [],
      r = void 0,
      i = void 0,
      l = void 0,
      a = void 0;
    for (a = arguments.length; a-- > 2; ) Z.push(arguments[a]);
    for (n && n.children && (Z.length || Z.push(n.children), delete n.children); Z.length; )
      if ((i = Z.pop()) instanceof Array) for (a = i.length; a--; ) Z.push(i[a]);
      else
        null != i &&
          i !== !1 &&
          (('number' != typeof i && i !== !0) || (i += ''), (l = 'string' == typeof i), l && r ? (o[o.length - 1] += i) : (o.push(i), (r = l)));
    var s = new e(t, n || void 0, o);
    return Y.vnode && Y.vnode(s), s;
  }
  function n(e, t) {
    if (t) for (var n in t) e[n] = t[n];
    return e;
  }
  function o(e) {
    return n({}, e);
  }
  function r(e, t) {
    for (var n = t.split('.'), o = 0; o < n.length && e; o++) e = e[n[o]];
    return e;
  }
  function i(e) {
    return 'function' == typeof e;
  }
  function l(e) {
    return 'string' == typeof e;
  }
  function a(e) {
    var t = '';
    for (var n in e) e[n] && (t && (t += ' '), (t += n));
    return t;
  }
  function s(e, t, n) {
    var o = t.split('.');
    return function (t) {
      for (
        var i = (t && t.target) || this, a = {}, s = a, c = l(n) ? r(t, n) : i.nodeName ? (i.type.match(/^che|rad/) ? i.checked : i.value) : t, u = 0;
        u < o.length - 1;
        u++
      )
        s = s[o[u]] || (s[o[u]] = (!u && e.state[o[u]]) || {});
      (s[o[u]] = c), e.setState(a);
    };
  }
  function c(e) {
    !e._dirty && (e._dirty = !0) && 1 == fe.push(e) && (Y.debounceRendering || ne)(u);
  }
  function u() {
    var e = void 0,
      t = fe;
    for (fe = []; (e = t.pop()); ) e._dirty && P(e);
  }
  function f(e) {
    var t = e && e.nodeName;
    return t && i(t) && !(t.prototype && t.prototype.render);
  }
  function d(e, t) {
    return e.nodeName(m(e), t || ae);
  }
  function p(e, t) {
    return l(t)
      ? e instanceof Text
      : l(t.nodeName)
      ? !e._componentConstructor && h(e, t.nodeName)
      : i(t.nodeName)
      ? !e._componentConstructor || e._componentConstructor === t.nodeName
      : void 0;
  }
  function h(e, t) {
    return e.normalizedNodeName === t || ee(e.nodeName) === ee(t);
  }
  function m(e) {
    var t = o(e.attributes);
    t.children = e.children;
    var n = e.nodeName.defaultProps;
    if (n) for (var r in n) void 0 === t[r] && (t[r] = n[r]);
    return t;
  }
  function v(e) {
    var t = e.parentNode;
    t && t.removeChild(e);
  }
  function y(e, t, n, o, r) {
    if (('className' === t && (t = 'class'), 'class' === t && o && 'object' === (void 0 === o ? 'undefined' : de(o)) && (o = a(o)), 'key' === t));
    else if ('class' !== t || r)
      if ('style' === t) {
        if (((!o || l(o) || l(n)) && (e.style.cssText = o || ''), o && 'object' === (void 0 === o ? 'undefined' : de(o)))) {
          if (!l(n)) for (var s in n) s in o || (e.style[s] = '');
          for (var c in o) e.style[c] = 'number' != typeof o[c] || ce[c] ? o[c] : o[c] + 'px';
        }
      } else if ('dangerouslySetInnerHTML' === t) e.innerHTML = (o && o.__html) || '';
      else if ('o' == t[0] && 'n' == t[1]) {
        var u = e._listeners || (e._listeners = {});
        (t = ee(t.substring(2))), o ? u[t] || e.addEventListener(t, g, !!ue[t]) : u[t] && e.removeEventListener(t, g, !!ue[t]), (u[t] = o);
      } else if ('list' !== t && 'type' !== t && !r && t in e) b(e, t, null == o ? '' : o), (null != o && o !== !1) || e.removeAttribute(t);
      else {
        var f = r && t.match(/^xlink\:?(.+)/);
        null == o || o === !1
          ? f
            ? e.removeAttributeNS('http://www.w3.org/1999/xlink', ee(f[1]))
            : e.removeAttribute(t)
          : 'object' === (void 0 === o ? 'undefined' : de(o)) ||
            i(o) ||
            (f ? e.setAttributeNS('http://www.w3.org/1999/xlink', ee(f[1]), o) : e.setAttribute(t, o));
      }
    else e.className = o || '';
  }
  function b(e, t, n) {
    try {
      e[t] = n;
    } catch (e) {}
  }
  function g(e) {
    return this._listeners[e.type]((Y.event && Y.event(e)) || e);
  }
  function _(e) {
    if ((v(e), e instanceof Element)) {
      e._component = e._componentConstructor = null;
      var t = e.normalizedNodeName || ee(e.nodeName);
      (pe[t] || (pe[t] = [])).push(e);
    }
  }
  function w(e, t) {
    var n = ee(e),
      o = (pe[n] && pe[n].pop()) || (t ? document.createElementNS('http://www.w3.org/2000/svg', e) : document.createElement(e));
    return (o.normalizedNodeName = n), o;
  }
  function C() {
    for (var e = void 0; (e = he.pop()); ) Y.afterMount && Y.afterMount(e), e.componentDidMount && e.componentDidMount();
  }
  function S(e, t, n, o, r, i) {
    me++ || ((ve = r instanceof SVGElement), (ye = e && !(se in e)));
    var l = x(e, t, n, o);
    return r && l.parentNode !== r && r.appendChild(l), --me || ((ye = !1), i || C()), l;
  }
  function x(e, t, n, o) {
    for (var r = t && t.attributes; f(t); ) t = d(t, n);
    if ((null == t && (t = ''), l(t)))
      return e && e instanceof Text ? e.nodeValue != t && (e.nodeValue = t) : (e && T(e), (e = document.createTextNode(t))), (e[se] = !0), e;
    if (i(t.nodeName)) return U(e, t, n, o);
    var a = e,
      s = t.nodeName + '',
      c = ve,
      u = t.children;
    if (((ve = 'svg' === s || ('foreignObject' !== s && ve)), e)) {
      if (!h(e, s)) {
        for (a = w(s, ve); e.firstChild; ) a.appendChild(e.firstChild);
        T(e);
      }
    } else a = w(s, ve);
    var p = a.firstChild,
      m = a[se];
    if (!m) {
      a[se] = m = {};
      for (var v = a.attributes, y = v.length; y--; ) m[v[y].name] = v[y].value;
    }
    return (
      O(a, t.attributes, m),
      !ye && u && 1 === u.length && 'string' == typeof u[0] && p instanceof Text && !p.nextSibling
        ? p.nodeValue != u[0] && (p.nodeValue = u[0])
        : ((u && u.length) || p) && N(a, u, n, o),
      r && 'function' == typeof r.ref && (m.ref = r.ref)(a),
      (ve = c),
      a
    );
  }
  function N(e, t, n, o) {
    var r = e.childNodes,
      l = [],
      a = {},
      s = 0,
      c = 0,
      u = r.length,
      f = 0,
      d = t && t.length,
      h = void 0,
      m = void 0,
      v = void 0,
      y = void 0;
    if (u)
      for (var b = 0; b < u; b++) {
        var g = r[b],
          _ = g[se],
          w = d ? ((m = g._component) ? m.__key : _ ? _.key : null) : null;
        null != w ? (s++, (a[w] = g)) : (ye || _) && (l[f++] = g);
      }
    if (d)
      for (var C = 0; C < d; C++) {
        (v = t[C]), (y = null);
        var S = v.key;
        if (null != S) s && S in a && ((y = a[S]), (a[S] = void 0), s--);
        else if (!y && c < f) {
          for (h = c; h < f; h++)
            if (((m = l[h]), m && p(m, v))) {
              (y = m), (l[h] = void 0), h === f - 1 && f--, h === c && c++;
              break;
            }
          !y && c < f && i(v.nodeName) && o && ((y = l[c]), (l[c++] = void 0));
        }
        (y = x(y, v, n, o)), y && y !== e && y !== r[C] && e.insertBefore(y, r[C] || null);
      }
    if (s) for (var N in a) a[N] && T(a[N]);
    c < f && k(l);
  }
  function k(e, t) {
    for (var n = e.length; n--; ) e[n] && T(e[n], t);
  }
  function T(e, t) {
    var n = e._component;
    n ? A(n, !t) : (e[se] && e[se].ref && e[se].ref(null), t || _(e), e.childNodes && e.childNodes.length && k(e.childNodes, t));
  }
  function O(e, t, n) {
    for (var o in n) (t && o in t) || null == n[o] || y(e, o, n[o], (n[o] = void 0), ve);
    if (t)
      for (var r in t)
        'children' === r ||
          'innerHTML' === r ||
          (r in n && t[r] === ('value' === r || 'checked' === r ? e[r] : n[r])) ||
          y(e, r, n[r], (n[r] = t[r]), ve);
  }
  function E(e) {
    var t = e.constructor.name,
      n = be[t];
    n ? n.push(e) : (be[t] = [e]);
  }
  function D(e, t, n) {
    var o = new e(t, n),
      r = be[e.name];
    if ((B.call(o, t, n), r))
      for (var i = r.length; i--; )
        if (r[i].constructor === e) {
          (o.nextBase = r[i].nextBase), r.splice(i, 1);
          break;
        }
    return o;
  }
  function j(e, t, n, o, r) {
    e._disable ||
      ((e._disable = !0),
      (e.__ref = t.ref) && delete t.ref,
      (e.__key = t.key) && delete t.key,
      !e.base || r ? e.componentWillMount && e.componentWillMount() : e.componentWillReceiveProps && e.componentWillReceiveProps(t, o),
      o && o !== e.context && (e.prevContext || (e.prevContext = e.context), (e.context = o)),
      e.prevProps || (e.prevProps = e.props),
      (e.props = t),
      (e._disable = !1),
      n !== oe && (n !== re && Y.syncComponentUpdates === !1 && e.base ? c(e) : P(e, re, r)),
      e.__ref && e.__ref(e));
  }
  function P(e, t, r, l) {
    if (!e._disable) {
      var a = void 0,
        s = void 0,
        c = e.props,
        u = e.state,
        p = e.context,
        h = e.prevProps || c,
        v = e.prevState || u,
        y = e.prevContext || p,
        b = e.base,
        g = e.nextBase,
        _ = b || g,
        w = e._component,
        x = void 0,
        N = void 0;
      if (
        (b &&
          ((e.props = h),
          (e.state = v),
          (e.context = y),
          t !== ie && e.shouldComponentUpdate && e.shouldComponentUpdate(c, u, p) === !1
            ? (a = !0)
            : e.componentWillUpdate && e.componentWillUpdate(c, u, p),
          (e.props = c),
          (e.state = u),
          (e.context = p)),
        (e.prevProps = e.prevState = e.prevContext = e.nextBase = null),
        (e._dirty = !1),
        !a)
      ) {
        for (e.render && (s = e.render(c, u, p)), e.getChildContext && (p = n(o(p), e.getChildContext())); f(s); ) s = d(s, p);
        var k = s && s.nodeName,
          O = void 0,
          E = void 0;
        if (i(k)) {
          x = w;
          var U = m(s);
          x && x.constructor === k
            ? j(x, U, re, p)
            : ((O = x),
              (x = D(k, U, p)),
              (x.nextBase = x.nextBase || g),
              (x._parentComponent = e),
              (e._component = x),
              j(x, U, oe, p),
              P(x, re, r, !0)),
            (E = x.base);
        } else
          (N = _),
            (O = w),
            O && (N = e._component = null),
            (_ || t === re) && (N && (N._component = null), (E = S(N, s, p, r || !b, _ && _.parentNode, !0)));
        if (_ && E !== _ && x !== w) {
          var B = _.parentNode;
          B && E !== B && (B.replaceChild(E, _), O || ((_._component = null), T(_)));
        }
        if ((O && A(O, E !== _), (e.base = E), E && !l)) {
          for (var M = e, W = e; (W = W._parentComponent); ) (M = W).base = E;
          (E._component = M), (E._componentConstructor = M.constructor);
        }
      }
      !b || r ? he.unshift(e) : a || (e.componentDidUpdate && e.componentDidUpdate(h, v, y), Y.afterUpdate && Y.afterUpdate(e));
      var L = e._renderCallbacks,
        R = void 0;
      if (L) for (; (R = L.pop()); ) R.call(e);
      me || l || C();
    }
  }
  function U(e, t, n, o) {
    for (var r = e && e._component, i = e, l = r && e._componentConstructor === t.nodeName, a = l, s = m(t); r && !a && (r = r._parentComponent); )
      a = r.constructor === t.nodeName;
    return (
      r && a && (!o || r._component)
        ? (j(r, s, le, n, o), (e = r.base))
        : (r && !l && (A(r, !0), (e = i = null)),
          (r = D(t.nodeName, s, n)),
          e && !r.nextBase && ((r.nextBase = e), (i = null)),
          j(r, s, re, n, o),
          (e = r.base),
          i && e !== i && ((i._component = null), T(i))),
      e
    );
  }
  function A(e, t) {
    Y.beforeUnmount && Y.beforeUnmount(e);
    var n = e.base;
    (e._disable = !0), e.componentWillUnmount && e.componentWillUnmount(), (e.base = null);
    var o = e._component;
    o ? A(o, t) : n && (n[se] && n[se].ref && n[se].ref(null), (e.nextBase = n), t && (v(n), E(e)), k(n.childNodes, !t)),
      e.__ref && e.__ref(null),
      e.componentDidUnmount && e.componentDidUnmount();
  }
  function B(e, t) {
    (this._dirty = !0), (this.context = t), (this.props = e), this.state || (this.state = {});
  }
  function M(e, t, n) {
    return S(n, e, {}, !1, t);
  }
  function W() {
    for (var e = '', t = 0; t < 32; t++) {
      var n = (16 * Math.random()) | 0;
      (8 !== t && 12 !== t && 16 !== t && 20 !== t) || (e += '-'), (e += (12 === t ? 4 : 16 === t ? (3 & n) | 8 : n).toString(16));
    }
    return e;
  }
  function L(e, t) {
    return 1 === e ? t : t + 's';
  }
  function R(e, t) {
    if (t) return (localStorage[e] = JSON.stringify(t));
    var n = localStorage[e];
    return (n && JSON.parse(n)) || [];
  }
  function z(e, t) {
    if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
  }
  function K(e, t) {
    if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
  }
  function V(e, t) {
    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
  }
  function H(e, t) {
    if ('function' != typeof t && null !== t) throw new TypeError('Super expression must either be null or a function, not ' + typeof t);
    (e.prototype = Object.create(t && t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } })),
      t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
  }
  function I(e, t) {
    if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
  }
  function F(e, t) {
    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
  }
  function G(e, t) {
    if ('function' != typeof t && null !== t) throw new TypeError('Super expression must either be null or a function, not ' + typeof t);
    (e.prototype = Object.create(t && t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } })),
      t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
  }
  function q(e) {
    if (null == e) throw new TypeError('Cannot destructure undefined');
  }
  function J(e, t) {
    if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
  }
  function Q(e, t) {
    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
  }
  function X(e, t) {
    if ('function' != typeof t && null !== t) throw new TypeError('Super expression must either be null or a function, not ' + typeof t);
    (e.prototype = Object.create(t && t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } })),
      t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
  }
  var Y = {},
    Z = [],
    $ = {},
    ee = function (e) {
      return $[e] || ($[e] = e.toLowerCase());
    },
    te = 'undefined' != typeof Promise && Promise.resolve(),
    ne = te
      ? function (e) {
          te.then(e);
        }
      : setTimeout,
    oe = 0,
    re = 1,
    ie = 2,
    le = 3,
    ae = {},
    se = 'undefined' != typeof Symbol ? Symbol.for('preactattr') : '__preactattr_',
    ce = {
      boxFlex: 1,
      boxFlexGroup: 1,
      columnCount: 1,
      fillOpacity: 1,
      flex: 1,
      flexGrow: 1,
      flexPositive: 1,
      flexShrink: 1,
      flexNegative: 1,
      fontWeight: 1,
      lineClamp: 1,
      lineHeight: 1,
      opacity: 1,
      order: 1,
      orphans: 1,
      strokeOpacity: 1,
      widows: 1,
      zIndex: 1,
      zoom: 1,
    },
    ue = { blur: 1, error: 1, focus: 1, load: 1, resize: 1, scroll: 1 },
    fe = [],
    de =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e;
          },
    pe = {},
    he = [],
    me = 0,
    ve = !1,
    ye = !1,
    be = {};
  n(B.prototype, {
    linkState: function (e, t) {
      var n = this._linkedStates || (this._linkedStates = {});
      return n[e + t] || (n[e + t] = s(this, e, t));
    },
    setState: function (e, t) {
      var r = this.state;
      this.prevState || (this.prevState = o(r)),
        n(r, i(e) ? e(r, this.props) : e),
        t && (this._renderCallbacks = this._renderCallbacks || []).push(t),
        c(this);
    },
    forceUpdate: function () {
      P(this, ie);
    },
    render: function () {},
  });
  var ge =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
        }
        return e;
      },
    _e = (function () {
      function e(t, n) {
        z(this, e), (this.key = t), (this.todos = R(t) || []), (this.onChanges = [n]);
      }
      return (
        (e.prototype.inform = function () {
          R(this.key, this.todos),
            this.onChanges.forEach(function (e) {
              return e();
            });
        }),
        (e.prototype.addTodo = function (e) {
          (this.todos = this.todos.concat({ id: W(), title: e, completed: !1 })), this.inform();
        }),
        (e.prototype.toggleAll = function (e) {
          (this.todos = this.todos.map(function (t) {
            return ge({}, t, { completed: e });
          })),
            this.inform();
        }),
        (e.prototype.toggle = function (e) {
          (this.todos = this.todos.map(function (t) {
            return t !== e ? t : ge({}, t, { completed: !t.completed });
          })),
            this.inform();
        }),
        (e.prototype.destroy = function (e) {
          (this.todos = this.todos.filter(function (t) {
            return t !== e;
          })),
            this.inform();
        }),
        (e.prototype.save = function (e, t) {
          (this.todos = this.todos.map(function (n) {
            return n !== e ? n : ge({}, n, { title: t });
          })),
            this.inform();
        }),
        (e.prototype.clearCompleted = function () {
          (this.todos = this.todos.filter(function (e) {
            return !e.completed;
          })),
            this.inform();
        }),
        e
      );
    })(),
    we = (function (e) {
      function n() {
        return K(this, n), V(this, e.apply(this, arguments));
      }
      return (
        H(n, e),
        (n.prototype.render = function (e) {
          var n = e.nowShowing,
            o = e.count,
            r = e.completedCount,
            i = e.onClearCompleted;
          return t(
            'footer',
            { class: 'footer' },
            t('span', { class: 'todo-count' }, t('strong', null, o), ' ', L(o, 'item'), ' left'),
            t(
              'ul',
              { class: 'filters' },
              t('li', null, t('a', { href: '#/', class: 'all' == n && 'selected' }, 'All')),
              ' ',
              t('li', null, t('a', { href: '#/active', class: 'active' == n && 'selected' }, 'Active')),
              ' ',
              t('li', null, t('a', { href: '#/completed', class: 'completed' == n && 'selected' }, 'Completed')),
            ),
            r > 0 && t('button', { class: 'clear-completed', onClick: i }, 'Clear completed'),
          );
        }),
        n
      );
    })(B),
    Ce = 27,
    Se = 13,
    xe = (function (e) {
      function n() {
        var t, o, r;
        I(this, n);
        for (var i = arguments.length, l = Array(i), a = 0; a < i; a++) l[a] = arguments[a];
        return (
          (t = o = F(this, e.call.apply(e, [this].concat(l)))),
          (o.handleSubmit = function () {
            var e = o.props,
              t = e.onSave,
              n = e.onDestroy,
              r = e.todo,
              i = o.state.editText.trim();
            i ? (t(r, i), o.setState({ editText: i })) : n(r);
          }),
          (o.handleEdit = function () {
            var e = o.props,
              t = e.onEdit,
              n = e.todo;
            t(n), o.setState({ editText: n.title });
          }),
          (o.toggle = function (e) {
            var t = o.props;
            (0, t.onToggle)(t.todo), e.preventDefault();
          }),
          (o.handleKeyDown = function (e) {
            if (e.which === Ce) {
              var t = o.props.todo;
              o.setState({ editText: t.title }), o.props.onCancel(t);
            } else e.which === Se && o.handleSubmit();
          }),
          (o.handleDestroy = function () {
            o.props.onDestroy(o.props.todo);
          }),
          (r = t),
          F(o, r)
        );
      }
      return (
        G(n, e),
        (n.prototype.componentDidUpdate = function () {
          var e = this.base && this.base.querySelector('.edit');
          e && e.focus();
        }),
        (n.prototype.render = function (e, n) {
          var o = e.todo,
            r = o.title,
            i = o.completed,
            l = e.editing,
            a = n.editText;
          return t(
            'li',
            { class: { completed: i, editing: l } },
            t(
              'div',
              { class: 'view' },
              t('input', { class: 'toggle', type: 'checkbox', checked: i, onChange: this.toggle }),
              t('label', { onDblClick: this.handleEdit }, r),
              t('button', { class: 'destroy', onClick: this.handleDestroy }),
            ),
            l &&
              t('input', { class: 'edit', value: a, onBlur: this.handleSubmit, onInput: this.linkState('editText'), onKeyDown: this.handleKeyDown }),
          );
        }),
        n
      );
    })(B),
    Ne = {
      all: function () {
        return !0;
      },
      active: function (e) {
        return !e.completed;
      },
      completed: function (e) {
        return e.completed;
      },
    };
  M(
    t(
      (function (e) {
        function n() {
          J(this, n);
          var t = Q(this, e.call(this));
          return (
            (t.handleNewTodoKeyDown = function (e) {
              if (13 === e.keyCode) {
                e.preventDefault();
                var n = t.state.newTodo.trim();
                n && (t.model.addTodo(n), t.setState({ newTodo: '' }));
              }
            }),
            (t.toggleAll = function (e) {
              t.model.toggleAll(e.target.checked);
            }),
            (t.toggle = function (e) {
              t.model.toggle(e);
            }),
            (t.destroy = function (e) {
              t.model.destroy(e);
            }),
            (t.edit = function (e) {
              t.setState({ editing: e.id });
            }),
            (t.save = function (e, n) {
              t.model.save(e, n), t.setState({ editing: null });
            }),
            (t.cancel = function () {
              t.setState({ editing: null });
            }),
            (t.clearCompleted = function () {
              t.model.clearCompleted();
            }),
            (t.model = new _e('preact-todos', function () {
              return t.setState({});
            })),
            addEventListener('hashchange', t.handleRoute.bind(t)),
            t.handleRoute(),
            t
          );
        }
        return (
          X(n, e),
          (n.prototype.handleRoute = function () {
            var e = ((location.hash || '') + '').split('/').pop();
            Ne[e] || (e = 'all'), this.setState({ nowShowing: e });
          }),
          (n.prototype.render = function (e, n) {
            var o = this,
              r = n.nowShowing,
              i = void 0 === r ? ALL_TODOS : r,
              l = n.newTodo,
              a = n.editing;
            q(e);
            var s = this.model.todos,
              c = s.filter(Ne[i]),
              u = s.reduce(function (e, t) {
                return e + (t.completed ? 0 : 1);
              }, 0),
              f = s.length - u;
            return t(
              'div',
              null,
              t(
                'header',
                { class: 'header' },
                t('h1', null, 'todos'),
                t('input', {
                  class: 'new-todo',
                  placeholder: 'What needs to be done?',
                  value: l,
                  onKeyDown: this.handleNewTodoKeyDown,
                  onInput: this.linkState('newTodo'),
                  autoFocus: !0,
                }),
              ),
              s.length
                ? t(
                    'section',
                    { class: 'main' },
                    t('input', { class: 'toggle-all', type: 'checkbox', onChange: this.toggleAll, checked: 0 === u }),
                    t(
                      'ul',
                      { class: 'todo-list' },
                      c.map(function (e) {
                        return t(xe, {
                          todo: e,
                          onToggle: o.toggle,
                          onDestroy: o.destroy,
                          onEdit: o.edit,
                          editing: a === e.id,
                          onSave: o.save,
                          onCancel: o.cancel,
                        });
                      }),
                    ),
                  )
                : null,
              u || f ? t(we, { count: u, completedCount: f, nowShowing: i, onClearCompleted: this.clearCompleted }) : null,
            );
          }),
          n
        );
      })(B),
      null,
    ),
    document.querySelector('.todoapp'),
  );
})();
//# sourceMappingURL=app.js.map
