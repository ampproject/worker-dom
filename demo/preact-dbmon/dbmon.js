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

(function() {
  'use strict';

  /** Virtual DOM Node */
  function VNode() {}

  /** Global options
   *	@public
   *	@namespace options {Object}
   */
  var options = {
    /** If `true`, `prop` changes trigger synchronous component updates.
     *	@name syncComponentUpdates
     *	@type Boolean
     *	@default true
     */
    //syncComponentUpdates: true,
    /** Processes all created VNodes.
     *	@param {VNode} vnode	A newly-created VNode to normalize/process
     */
    //vnode(vnode) { }
    /** Hook invoked after a component is mounted. */
    // afterMount(component) { }
    /** Hook invoked after the DOM is updated with a component's latest render. */
    // afterUpdate(component) { }
    /** Hook invoked immediately before a component is unmounted. */
    // beforeUnmount(component) { }
  };

  var stack = [];

  var EMPTY_CHILDREN = [];

  /**
   * JSX/hyperscript reviver.
   * @see http://jasonformat.com/wtf-is-jsx
   * Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
   *
   * Note: this is exported as both `h()` and `createElement()` for compatibility reasons.
   *
   * Creates a VNode (virtual DOM element). A tree of VNodes can be used as a lightweight representation
   * of the structure of a DOM tree. This structure can be realized by recursively comparing it against
   * the current _actual_ DOM structure, and applying only the differences.
   *
   * `h()`/`createElement()` accepts an element name, a list of attributes/props,
   * and optionally children to append to the element.
   *
   * @example The following DOM tree
   *
   * `<div id="foo" name="bar">Hello!</div>`
   *
   * can be constructed using this function as:
   *
   * `h('div', { id: 'foo', name : 'bar' }, 'Hello!');`
   *
   * @param {string} nodeName	An element name. Ex: `div`, `a`, `span`, etc.
   * @param {Object} attributes	Any attributes/props to set on the created element.
   * @param rest			Additional arguments are taken to be children to append. Can be infinitely nested Arrays.
   *
   * @public
   */
  function h(nodeName, attributes) {
    var children = EMPTY_CHILDREN,
      lastSimple,
      child,
      simple,
      i;
    for (i = arguments.length; i-- > 2; ) {
      stack.push(arguments[i]);
    }
    if (attributes && attributes.children != null) {
      if (!stack.length) stack.push(attributes.children);
      delete attributes.children;
    }
    while (stack.length) {
      if ((child = stack.pop()) && child.pop !== undefined) {
        for (i = child.length; i--; ) {
          stack.push(child[i]);
        }
      } else {
        if (typeof child === 'boolean') child = null;

        if ((simple = typeof nodeName !== 'function')) {
          if (child == null) child = '';
          else if (typeof child === 'number') child = String(child);
          else if (typeof child !== 'string') simple = false;
        }

        if (simple && lastSimple) {
          children[children.length - 1] += child;
        } else if (children === EMPTY_CHILDREN) {
          children = [child];
        } else {
          children.push(child);
        }

        lastSimple = simple;
      }
    }

    var p = new VNode();
    p.nodeName = nodeName;
    p.children = children;
    p.attributes = attributes == null ? undefined : attributes;
    p.key = attributes == null ? undefined : attributes.key;

    // if a "vnode hook" is defined, pass every created VNode to it
    if (options.vnode !== undefined) options.vnode(p);

    return p;
  }

  /**
   *  Copy all properties from `props` onto `obj`.
   *  @param {Object} obj		Object onto which properties should be copied.
   *  @param {Object} props	Object from which to copy properties.
   *  @return obj
   *  @private
   */
  function extend(obj, props) {
    for (var i in props) {
      obj[i] = props[i];
    }
    return obj;
  }

  /**
   * Call a function asynchronously, as soon as possible. Makes
   * use of HTML Promise to schedule the callback if available,
   * otherwise falling back to `setTimeout` (mainly for IE<11).
   *
   * @param {Function} callback
   */
  var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

  // DOM properties that should NOT have "px" added when numeric
  var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

  /** Managed queue of dirty components to be re-rendered */

  var items = [];

  function enqueueRender(component) {
    if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
      (options.debounceRendering || defer)(rerender);
    }
  }

  function rerender() {
    var p,
      list = items;
    items = [];
    while ((p = list.pop())) {
      if (p._dirty) renderComponent(p);
    }
  }

  /**
   * Check if two nodes are equivalent.
   *
   * @param {Node} node			DOM Node to compare
   * @param {VNode} vnode			Virtual DOM node to compare
   * @param {boolean} [hyrdating=false]	If true, ignores component constructors when comparing.
   * @private
   */
  function isSameNodeType(node, vnode, hydrating) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
      return node.splitText !== undefined;
    }
    if (typeof vnode.nodeName === 'string') {
      return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
    }
    return hydrating || node._componentConstructor === vnode.nodeName;
  }

  /**
   * Check if an Element has a given nodeName, case-insensitively.
   *
   * @param {Element} node	A DOM Element to inspect the name of.
   * @param {String} nodeName	Unnormalized name to compare against.
   */
  function isNamedNode(node, nodeName) {
    return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
  }

  /**
   * Reconstruct Component-style `props` from a VNode.
   * Ensures default/fallback values from `defaultProps`:
   * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
   *
   * @param {VNode} vnode
   * @return {Object} props
   */
  function getNodeProps(vnode) {
    var props = extend({}, vnode.attributes);
    props.children = vnode.children;

    var defaultProps = vnode.nodeName.defaultProps;
    if (defaultProps !== undefined) {
      for (var i in defaultProps) {
        if (props[i] === undefined) {
          props[i] = defaultProps[i];
        }
      }
    }

    return props;
  }

  /** Create an element with the given nodeName.
   *	@param {String} nodeName
   *	@param {Boolean} [isSvg=false]	If `true`, creates an element within the SVG namespace.
   *	@return {Element} node
   */
  function createNode(nodeName, isSvg) {
    var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
    node.normalizedNodeName = nodeName;
    return node;
  }

  /** Remove a child node from its parent if attached.
   *	@param {Element} node		The node to remove
   */
  function removeNode(node) {
    var parentNode = node.parentNode;
    if (parentNode) parentNode.removeChild(node);
  }

  /** Set a named attribute on the given Node, with special behavior for some names and event handlers.
   *	If `value` is `null`, the attribute/handler will be removed.
   *	@param {Element} node	An element to mutate
   *	@param {string} name	The name/key to set, such as an event or attribute name
   *	@param {any} old	The last value that was set for this name/node pair
   *	@param {any} value	An attribute value, such as a function to be used as an event handler
   *	@param {Boolean} isSvg	Are we currently diffing inside an svg?
   *	@private
   */
  function setAccessor(node, name, old, value, isSvg) {
    if (name === 'className') name = 'class';

    if (name === 'key') {
      // ignore
    } else if (name === 'ref') {
      if (old) old(null);
      if (value) value(node);
    } else if (name === 'class' && !isSvg) {
      node.className = value || '';
    } else if (name === 'style') {
      if (!value || typeof value === 'string' || typeof old === 'string') {
        node.style.cssText = value || '';
      }
      if (value && typeof value === 'object') {
        if (typeof old !== 'string') {
          for (var i in old) {
            if (!(i in value)) node.style[i] = '';
          }
        }
        for (var i in value) {
          node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
        }
      }
    } else if (name === 'dangerouslySetInnerHTML') {
      if (value) node.innerHTML = value.__html || '';
    } else if (name[0] == 'o' && name[1] == 'n') {
      var useCapture = name !== (name = name.replace(/Capture$/, ''));
      name = name.toLowerCase().substring(2);
      if (value) {
        if (!old) node.addEventListener(name, eventProxy, useCapture);
      } else {
        node.removeEventListener(name, eventProxy, useCapture);
      }
      (node._listeners || (node._listeners = {}))[name] = value;
    } else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
      setProperty(node, name, value == null ? '' : value);
      if (value == null || value === false) node.removeAttribute(name);
    } else {
      var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
      if (value == null || value === false) {
        if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());
        else node.removeAttribute(name);
      } else if (typeof value !== 'function') {
        if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);
        else node.setAttribute(name, value);
      }
    }
  }

  /** Attempt to set a DOM property to the given value.
   *	IE & FF throw for certain property-value combinations.
   */
  function setProperty(node, name, value) {
    try {
      node[name] = value;
    } catch (e) {}
  }

  /** Proxy an event to hooked event handlers
   *	@private
   */
  function eventProxy(e) {
    return this._listeners[e.type]((options.event && options.event(e)) || e);
  }

  /** Queue of components that have been mounted and are awaiting componentDidMount */
  var mounts = [];

  /** Diff recursion count, used to track the end of the diff cycle. */
  var diffLevel = 0;

  /** Global flag indicating if the diff is currently within an SVG */
  var isSvgMode = false;

  /** Global flag indicating if the diff is performing hydration */
  var hydrating = false;

  /** Invoke queued componentDidMount lifecycle methods */
  function flushMounts() {
    var c;
    while ((c = mounts.pop())) {
      if (options.afterMount) options.afterMount(c);
      if (c.componentDidMount) c.componentDidMount();
    }
  }

  /** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
   *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
   *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
   *	@return {Element} dom			The created/mutated element
   *	@private
   */
  function diff(dom, vnode, context, mountAll, parent, componentRoot) {
    // diffLevel having been 0 here indicates initial entry into the diff (not a subdiff)
    if (!diffLevel++) {
      // when first starting the diff, check if we're diffing an SVG or within an SVG
      isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

      // hydration is indicated by the existing element to be diffed not having a prop cache
      hydrating = dom != null && !('__preactattr_' in dom);
    }

    var ret = idiff(dom, vnode, context, mountAll, componentRoot);

    // append the element if its a new parent
    if (parent && ret.parentNode !== parent) parent.appendChild(ret);

    // diffLevel being reduced to 0 means we're exiting the diff
    if (!--diffLevel) {
      hydrating = false;
      // invoke queued componentDidMount lifecycle methods
      if (!componentRoot) flushMounts();
    }

    return ret;
  }

  /** Internals of `diff()`, separated to allow bypassing diffLevel / mount flushing. */
  function idiff(dom, vnode, context, mountAll, componentRoot) {
    var out = dom,
      prevSvgMode = isSvgMode;

    // empty values (null, undefined, booleans) render as empty Text nodes
    if (vnode == null || typeof vnode === 'boolean') vnode = '';

    // Fast case: Strings & Numbers create/update Text nodes.
    if (typeof vnode === 'string' || typeof vnode === 'number') {
      // update if it's already a Text node:
      if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
        /* istanbul ignore if */ /* Browser quirk that can't be covered: https://github.com/developit/preact/commit/fd4f21f5c45dfd75151bd27b4c217d8003aa5eb9 */
        if (dom.nodeValue != vnode) {
          dom.nodeValue = vnode;
        }
      } else {
        // it wasn't a Text node: replace it with one and recycle the old Element
        out = document.createTextNode(vnode);
        if (dom) {
          if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
          recollectNodeTree(dom, true);
        }
      }

      out['__preactattr_'] = true;

      return out;
    }

    // If the VNode represents a Component, perform a component diff:
    var vnodeName = vnode.nodeName;
    if (typeof vnodeName === 'function') {
      return buildComponentFromVNode(dom, vnode, context, mountAll);
    }

    // Tracks entering and exiting SVG namespace when descending through the tree.
    isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

    // If there's no existing element or it's the wrong type, create a new one:
    vnodeName = String(vnodeName);
    if (!dom || !isNamedNode(dom, vnodeName)) {
      out = createNode(vnodeName, isSvgMode);

      if (dom) {
        // move children into the replacement node
        while (dom.firstChild) {
          out.appendChild(dom.firstChild);
        } // if the previous Element was mounted into the DOM, replace it inline
        if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

        // recycle the old element (skips non-Element node types)
        recollectNodeTree(dom, true);
      }
    }

    var fc = out.firstChild,
      props = out['__preactattr_'],
      vchildren = vnode.children;

    if (props == null) {
      props = out['__preactattr_'] = {};
      for (var a = out.attributes, i = a.length; i--; ) {
        props[a[i].name] = a[i].value;
      }
    }

    // Optimization: fast-path for elements containing a single TextNode:
    if (
      !hydrating &&
      vchildren &&
      vchildren.length === 1 &&
      typeof vchildren[0] === 'string' &&
      fc != null &&
      fc.splitText !== undefined &&
      fc.nextSibling == null
    ) {
      if (fc.nodeValue != vchildren[0]) {
        fc.nodeValue = vchildren[0];
      }
    }
    // otherwise, if there are existing or new children, diff them:
    else if ((vchildren && vchildren.length) || fc != null) {
      innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
    }

    // Apply attributes/props from VNode to the DOM Element:
    diffAttributes(out, vnode.attributes, props);

    // restore previous SVG mode: (in case we're exiting an SVG namespace)
    isSvgMode = prevSvgMode;

    return out;
  }

  /** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
   *	@param {Element} dom			Element whose children should be compared & mutated
   *	@param {Array} vchildren		Array of VNodes to compare to `dom.childNodes`
   *	@param {Object} context			Implicitly descendant context object (from most recent `getChildContext()`)
   *	@param {Boolean} mountAll
   *	@param {Boolean} isHydrating	If `true`, consumes externally created elements similar to hydration
   */
  function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
    var originalChildren = dom.childNodes,
      children = [],
      keyed = {},
      keyedLen = 0,
      min = 0,
      len = originalChildren.length,
      childrenLen = 0,
      vlen = vchildren ? vchildren.length : 0,
      j,
      c,
      f,
      vchild,
      child;

    // Build up a map of keyed children and an Array of unkeyed children:
    if (len !== 0) {
      for (var i = 0; i < len; i++) {
        var _child = originalChildren[i],
          props = _child['__preactattr_'],
          key = vlen && props ? (_child._component ? _child._component.__key : props.key) : null;
        if (key != null) {
          keyedLen++;
          keyed[key] = _child;
        } else if (props || (_child.splitText !== undefined ? (isHydrating ? _child.nodeValue.trim() : true) : isHydrating)) {
          children[childrenLen++] = _child;
        }
      }
    }

    if (vlen !== 0) {
      for (var i = 0; i < vlen; i++) {
        vchild = vchildren[i];
        child = null;

        // attempt to find a node based on key matching
        var key = vchild.key;
        if (key != null) {
          if (keyedLen && keyed[key] !== undefined) {
            child = keyed[key];
            keyed[key] = undefined;
            keyedLen--;
          }
        }
        // attempt to pluck a node of the same type from the existing children
        else if (!child && min < childrenLen) {
          for (j = min; j < childrenLen; j++) {
            if (children[j] !== undefined && isSameNodeType((c = children[j]), vchild, isHydrating)) {
              child = c;
              children[j] = undefined;
              if (j === childrenLen - 1) childrenLen--;
              if (j === min) min++;
              break;
            }
          }
        }

        // morph the matched/found/created DOM child to match vchild (deep)
        child = idiff(child, vchild, context, mountAll);

        f = originalChildren[i];
        if (child && child !== dom && child !== f) {
          if (f == null) {
            dom.appendChild(child);
          } else if (child === f.nextSibling) {
            removeNode(f);
          } else {
            dom.insertBefore(child, f);
          }
        }
      }
    }

    // remove unused keyed children:
    if (keyedLen) {
      for (var i in keyed) {
        if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
      }
    }

    // remove orphaned unkeyed children:
    while (min <= childrenLen) {
      if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
    }
  }

  /** Recursively recycle (or just unmount) a node and its descendants.
   *	@param {Node} node						DOM node to start unmount/removal from
   *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
   */
  function recollectNodeTree(node, unmountOnly) {
    var component = node._component;
    if (component) {
      // if node is owned by a Component, unmount that component (ends up recursing back here)
      unmountComponent(component);
    } else {
      // If the node's VNode had a ref function, invoke it with null here.
      // (this is part of the React spec, and smart for unsetting references)
      if (node['__preactattr_'] != null && node['__preactattr_'].ref) node['__preactattr_'].ref(null);

      if (unmountOnly === false || node['__preactattr_'] == null) {
        removeNode(node);
      }

      removeChildren(node);
    }
  }

  /** Recollect/unmount all children.
   *	- we use .lastChild here because it causes less reflow than .firstChild
   *	- it's also cheaper than accessing the .childNodes Live NodeList
   */
  function removeChildren(node) {
    node = node.lastChild;
    while (node) {
      var next = node.previousSibling;
      recollectNodeTree(node, true);
      node = next;
    }
  }

  /** Apply differences in attributes from a VNode to the given DOM Element.
   *	@param {Element} dom		Element with attributes to diff `attrs` against
   *	@param {Object} attrs		The desired end-state key-value attribute pairs
   *	@param {Object} old			Current/previous attributes (from previous VNode or element's prop cache)
   */
  function diffAttributes(dom, attrs, old) {
    var name;

    // remove attributes no longer present on the vnode by setting them to undefined
    for (name in old) {
      if (!(attrs && attrs[name] != null) && old[name] != null) {
        setAccessor(dom, name, old[name], (old[name] = undefined), isSvgMode);
      }
    }

    // add new & update changed attributes
    for (name in attrs) {
      if (
        name !== 'children' &&
        name !== 'innerHTML' &&
        (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))
      ) {
        setAccessor(dom, name, old[name], (old[name] = attrs[name]), isSvgMode);
      }
    }
  }

  /** Retains a pool of Components for re-use, keyed on component name.
   *	Note: since component names are not unique or even necessarily available, these are primarily a form of sharding.
   *	@private
   */
  var components = {};

  /** Reclaim a component for later re-use by the recycler. */
  function collectComponent(component) {
    var name = component.constructor.name;
    (components[name] || (components[name] = [])).push(component);
  }

  /** Create a component. Normalizes differences between PFC's and classful Components. */
  function createComponent(Ctor, props, context) {
    var list = components[Ctor.name],
      inst;

    if (Ctor.prototype && Ctor.prototype.render) {
      inst = new Ctor(props, context);
      Component.call(inst, props, context);
    } else {
      inst = new Component(props, context);
      inst.constructor = Ctor;
      inst.render = doRender;
    }

    if (list) {
      for (var i = list.length; i--; ) {
        if (list[i].constructor === Ctor) {
          inst.nextBase = list[i].nextBase;
          list.splice(i, 1);
          break;
        }
      }
    }
    return inst;
  }

  /** The `.render()` method for a PFC backing instance. */
  function doRender(props, state, context) {
    return this.constructor(props, context);
  }

  /** Set a component's `props` (generally derived from JSX attributes).
   *	@param {Object} props
   *	@param {Object} [opts]
   *	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
   *	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
   */
  function setComponentProps(component, props, opts, context, mountAll) {
    if (component._disable) return;
    component._disable = true;

    if ((component.__ref = props.ref)) delete props.ref;
    if ((component.__key = props.key)) delete props.key;

    if (!component.base || mountAll) {
      if (component.componentWillMount) component.componentWillMount();
    } else if (component.componentWillReceiveProps) {
      component.componentWillReceiveProps(props, context);
    }

    if (context && context !== component.context) {
      if (!component.prevContext) component.prevContext = component.context;
      component.context = context;
    }

    if (!component.prevProps) component.prevProps = component.props;
    component.props = props;

    component._disable = false;

    if (opts !== 0) {
      if (opts === 1 || options.syncComponentUpdates !== false || !component.base) {
        renderComponent(component, 1, mountAll);
      } else {
        enqueueRender(component);
      }
    }

    if (component.__ref) component.__ref(component);
  }

  /** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
   *	@param {Component} component
   *	@param {Object} [opts]
   *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
   *	@private
   */
  function renderComponent(component, opts, mountAll, isChild) {
    if (component._disable) return;

    var props = component.props,
      state = component.state,
      context = component.context,
      previousProps = component.prevProps || props,
      previousState = component.prevState || state,
      previousContext = component.prevContext || context,
      isUpdate = component.base,
      nextBase = component.nextBase,
      initialBase = isUpdate || nextBase,
      initialChildComponent = component._component,
      skip = false,
      rendered,
      inst,
      cbase;

    // if updating
    if (isUpdate) {
      component.props = previousProps;
      component.state = previousState;
      component.context = previousContext;
      if (opts !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
        skip = true;
      } else if (component.componentWillUpdate) {
        component.componentWillUpdate(props, state, context);
      }
      component.props = props;
      component.state = state;
      component.context = context;
    }

    component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
    component._dirty = false;

    if (!skip) {
      rendered = component.render(props, state, context);

      // context to pass to the child, can be updated via (grand-)parent component
      if (component.getChildContext) {
        context = extend(extend({}, context), component.getChildContext());
      }

      var childComponent = rendered && rendered.nodeName,
        toUnmount,
        base;

      if (typeof childComponent === 'function') {
        // set up high order component link

        var childProps = getNodeProps(rendered);
        inst = initialChildComponent;

        if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
          setComponentProps(inst, childProps, 1, context, false);
        } else {
          toUnmount = inst;

          component._component = inst = createComponent(childComponent, childProps, context);
          inst.nextBase = inst.nextBase || nextBase;
          inst._parentComponent = component;
          setComponentProps(inst, childProps, 0, context, false);
          renderComponent(inst, 1, mountAll, true);
        }

        base = inst.base;
      } else {
        cbase = initialBase;

        // destroy high order component link
        toUnmount = initialChildComponent;
        if (toUnmount) {
          cbase = component._component = null;
        }

        if (initialBase || opts === 1) {
          if (cbase) cbase._component = null;
          base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
        }
      }

      if (initialBase && base !== initialBase && inst !== initialChildComponent) {
        var baseParent = initialBase.parentNode;
        if (baseParent && base !== baseParent) {
          baseParent.replaceChild(base, initialBase);

          if (!toUnmount) {
            initialBase._component = null;
            recollectNodeTree(initialBase, false);
          }
        }
      }

      if (toUnmount) {
        unmountComponent(toUnmount);
      }

      component.base = base;
      if (base && !isChild) {
        var componentRef = component,
          t = component;
        while ((t = t._parentComponent)) {
          (componentRef = t).base = base;
        }
        base._component = componentRef;
        base._componentConstructor = componentRef.constructor;
      }
    }

    if (!isUpdate || mountAll) {
      mounts.unshift(component);
    } else if (!skip) {
      // Ensure that pending componentDidMount() hooks of child components
      // are called before the componentDidUpdate() hook in the parent.
      // Note: disabled as it causes duplicate hooks, see https://github.com/developit/preact/issues/750
      // flushMounts();

      if (component.componentDidUpdate) {
        component.componentDidUpdate(previousProps, previousState, previousContext);
      }
      if (options.afterUpdate) options.afterUpdate(component);
    }

    if (component._renderCallbacks != null) {
      while (component._renderCallbacks.length) {
        component._renderCallbacks.pop().call(component);
      }
    }

    if (!diffLevel && !isChild) flushMounts();
  }

  /** Apply the Component referenced by a VNode to the DOM.
   *	@param {Element} dom	The DOM node to mutate
   *	@param {VNode} vnode	A Component-referencing VNode
   *	@return {Element} dom	The created/mutated element
   *	@private
   */
  function buildComponentFromVNode(dom, vnode, context, mountAll) {
    var c = dom && dom._component,
      originalComponent = c,
      oldDom = dom,
      isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
      isOwner = isDirectOwner,
      props = getNodeProps(vnode);
    while (c && !isOwner && (c = c._parentComponent)) {
      isOwner = c.constructor === vnode.nodeName;
    }

    if (c && isOwner && (!mountAll || c._component)) {
      setComponentProps(c, props, 3, context, mountAll);
      dom = c.base;
    } else {
      if (originalComponent && !isDirectOwner) {
        unmountComponent(originalComponent);
        dom = oldDom = null;
      }

      c = createComponent(vnode.nodeName, props, context);
      if (dom && !c.nextBase) {
        c.nextBase = dom;
        // passing dom/oldDom as nextBase will recycle it if unused, so bypass recycling on L229:
        oldDom = null;
      }
      setComponentProps(c, props, 1, context, mountAll);
      dom = c.base;

      if (oldDom && dom !== oldDom) {
        oldDom._component = null;
        recollectNodeTree(oldDom, false);
      }
    }

    return dom;
  }

  /** Remove a component from the DOM and recycle it.
   *	@param {Component} component	The Component instance to unmount
   *	@private
   */
  function unmountComponent(component) {
    if (options.beforeUnmount) options.beforeUnmount(component);

    var base = component.base;

    component._disable = true;

    if (component.componentWillUnmount) component.componentWillUnmount();

    component.base = null;

    // recursively tear down & recollect high-order component children:
    var inner = component._component;
    if (inner) {
      unmountComponent(inner);
    } else if (base) {
      if (base['__preactattr_'] && base['__preactattr_'].ref) base['__preactattr_'].ref(null);

      component.nextBase = base;

      removeNode(base);
      collectComponent(component);

      removeChildren(base);
    }

    if (component.__ref) component.__ref(null);
  }

  /** Base Component class.
   *	Provides `setState()` and `forceUpdate()`, which trigger rendering.
   *	@public
   *
   *	@example
   *	class MyFoo extends Component {
   *		render(props, state) {
   *			return <div />;
   *		}
   *	}
   */
  function Component(props, context) {
    this._dirty = true;

    /** @public
     *	@type {object}
     */
    this.context = context;

    /** @public
     *	@type {object}
     */
    this.props = props;

    /** @public
     *	@type {object}
     */
    this.state = this.state || {};
  }

  extend(Component.prototype, {
    /** Returns a `boolean` indicating if the component should re-render when receiving the given `props` and `state`.
     *	@param {object} nextProps
     *	@param {object} nextState
     *	@param {object} nextContext
     *	@return {Boolean} should the component re-render
     *	@name shouldComponentUpdate
     *	@function
     */

    /** Update component state by copying properties from `state` to `this.state`.
     *	@param {object} state		A hash of state properties to update with new values
     *	@param {function} callback	A function to be called once component state is updated
     */
    setState: function setState(state, callback) {
      var s = this.state;
      if (!this.prevState) this.prevState = extend({}, s);
      extend(s, typeof state === 'function' ? state(s, this.props) : state);
      if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
      enqueueRender(this);
    },

    /** Immediately perform a synchronous re-render of the component.
     *	@param {function} callback		A function to be called after component is re-rendered.
     *	@private
     */
    forceUpdate: function forceUpdate(callback) {
      if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
      renderComponent(this, 2);
    },

    /** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
     *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
     *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
     *	@param {object} state		The component's current state
     *	@param {object} context		Context object (if a parent component has provided context)
     *	@return VNode
     */
    render: function render() {},
  });

  /** Render JSX into a `parent` Element.
   *	@param {VNode} vnode		A (JSX) VNode to render
   *	@param {Element} parent		DOM element to render into
   *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
   *	@public
   *
   *	@example
   *	// render a div into <body>:
   *	render(<div id="hello">hello!</div>, document.body);
   *
   *	@example
   *	// render a "Thing" component into #foo:
   *	const Thing = ({ name }) => <span>{ name }</span>;
   *	render(<Thing name="one" />, document.querySelector('#foo'));
   */
  function render(vnode, parent, merge) {
    return diff(merge, vnode, {}, false, parent, false);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var ENV =
    ENV ||
    (function() {
      var counter = 0;
      var data;

      var _base;

      (_base = String.prototype).lpad ||
        (_base.lpad = function(padding, toLength) {
          return padding.repeat((toLength - this.length) / padding.length).concat(this);
        });

      function formatElapsed(value) {
        var str = parseFloat(value).toFixed(2);

        if (value > 60) {
          minutes = Math.floor(value / 60);
          comps = (value % 60).toFixed(2).split('.');
          seconds = comps[0].lpad('0', 2);
          ms = comps[1];
          str = minutes + ':' + seconds + '.' + ms;
        }

        return str;
      }

      function getElapsedClassName(elapsed) {
        var className = 'Query elapsed';

        if (elapsed >= 10.0) {
          className += ' warn_long';
        } else if (elapsed >= 1.0) {
          className += ' warn';
        } else {
          className += ' short';
        }

        return className;
      }

      function countClassName(queries) {
        var countClassName = 'label';

        if (queries >= 20) {
          countClassName += ' label-important';
        } else if (queries >= 10) {
          countClassName += ' label-warning';
        } else {
          countClassName += ' label-success';
        }

        return countClassName;
      }

      function updateQuery(object) {
        if (!object) {
          object = {};
        }

        var elapsed = Math.random() * 15;
        object.elapsed = elapsed;
        object.formatElapsed = formatElapsed(elapsed);
        object.elapsedClassName = getElapsedClassName(elapsed);
        object.query = 'SELECT blah FROM something';
        object.waiting = Math.random() < 0.5;

        if (Math.random() < 0.2) {
          object.query = '<IDLE> in transaction';
        }

        if (Math.random() < 0.1) {
          object.query = 'vacuum';
        }

        return object;
      }

      function cleanQuery(value) {
        if (value) {
          value.formatElapsed = '';
          value.elapsedClassName = '';
          value.query = '';
          value.elapsed = null;
          value.waiting = null;
        } else {
          return {
            query: '***',
            formatElapsed: '',
            elapsedClassName: '',
          };
        }
      }

      function generateRow(object, keepIdentity, counter) {
        var nbQueries = Math.floor(Math.random() * 10 + 1);

        if (!object) {
          object = {};
        }

        object.lastMutationId = counter;
        object.nbQueries = nbQueries;

        if (!object.lastSample) {
          object.lastSample = {};
        }

        if (!object.lastSample.topFiveQueries) {
          object.lastSample.topFiveQueries = [];
        }

        if (keepIdentity) {
          // for Angular optimization
          if (!object.lastSample.queries) {
            object.lastSample.queries = [];

            for (var l = 0; l < 12; l++) {
              object.lastSample.queries[l] = cleanQuery();
            }
          }

          for (var j in object.lastSample.queries) {
            var value = object.lastSample.queries[j];

            if (j <= nbQueries) {
              updateQuery(value);
            } else {
              cleanQuery(value);
            }
          }
        } else {
          object.lastSample.queries = [];

          for (var j = 0; j < 12; j++) {
            if (j < nbQueries) {
              var value = updateQuery(cleanQuery());
              object.lastSample.queries.push(value);
            } else {
              object.lastSample.queries.push(cleanQuery());
            }
          }
        }

        for (var i = 0; i < 5; i++) {
          var source = object.lastSample.queries[i];
          object.lastSample.topFiveQueries[i] = source;
        }

        object.lastSample.nbQueries = nbQueries;
        object.lastSample.countClassName = countClassName(nbQueries);
        return object;
      }

      function getData(keepIdentity) {
        var oldData = data;

        if (!keepIdentity) {
          // reset for each tick when !keepIdentity
          data = [];

          for (var i = 1; i <= ENV.rows; i++) {
            data.push({
              dbname: 'cluster' + i,
              query: '',
              formatElapsed: '',
              elapsedClassName: '',
            });
            data.push({
              dbname: 'cluster' + i + ' replica',
              query: '',
              formatElapsed: '',
              elapsedClassName: '',
            });
          }
        }

        if (!data) {
          // first init when keepIdentity
          data = [];

          for (var i = 1; i <= ENV.rows; i++) {
            data.push({
              dbname: 'cluster' + i,
            });
            data.push({
              dbname: 'cluster' + i + ' replica',
            });
          }

          oldData = data;
        }

        for (var i in data) {
          var row = data[i];

          if (!keepIdentity && oldData && oldData[i]) {
            row.lastSample = oldData[i].lastSample;
          }

          if (!row.lastSample || Math.random() < mutationsValue) {
            counter = counter + 1;

            if (!keepIdentity) {
              row.lastSample = null;
            }

            generateRow(row, keepIdentity, counter);
          } else {
            data[i] = oldData[i];
          }
        }

        return {
          toArray: function toArray() {
            return data;
          },
        };
      }

      var mutationsValue = 0.5;

      function mutations(value) {
        console.log('set new mutations, ' + value);
        mutationsValue = value;
      }

      return {
        generateData: getData,
        rows: 50,
        timeout: 0,
        mutations: mutations,
      };
    })();

  var Query =
    /*#__PURE__*/
    (function(_Component) {
      _inheritsLoose(Query, _Component);

      function Query() {
        return _Component.apply(this, arguments) || this;
      }

      var _proto = Query.prototype;

      _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.elapsedClassName !== this.props.elapsedClassName) return true;
        if (nextProps.formatElapsed !== this.props.formatElapsed) return true;
        if (nextProps.query !== this.props.query) return true;
        return false;
      };

      _proto.render = function render$$1(props) {
        return h(
          'td',
          {
            class: 'Query ' + props.elapsedClassName,
          },
          props.formatElapsed,
          h(
            'div',
            {
              class: 'popover left',
            },
            h(
              'div',
              {
                class: 'popover-content',
              },
              props.query,
            ),
            h('div', {
              class: 'arrow',
            }),
          ),
        );
      };

      return Query;
    })(Component);

  var Database =
    /*#__PURE__*/
    (function(_Component2) {
      _inheritsLoose(Database, _Component2);

      function Database() {
        return _Component2.apply(this, arguments) || this;
      }

      var _proto2 = Database.prototype;

      _proto2.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        return nextProps.lastMutationId !== this.props.lastMutationId;
      };

      _proto2.render = function render$$1(_ref) {
        var lastSample = _ref.lastSample,
          dbname = _ref.dbname;
        return h(
          'tr',
          {
            key: dbname,
          },
          h(
            'td',
            {
              class: 'dbname',
            },
            dbname,
          ),
          h(
            'td',
            {
              class: 'query-count',
            },
            h(
              'span',
              {
                class: lastSample.countClassName,
              },
              lastSample.nbQueries,
            ),
          ),
          lastSample.topFiveQueries.map(function(query, index) {
            return h(Query, {
              key: index,
              query: query.query,
              elapsed: query.elapsed,
              formatElapsed: query.formatElapsed,
              elapsedClassName: query.elapsedClassName,
            });
          }),
        );
      };

      return Database;
    })(Component);

  var Databases =
    /*#__PURE__*/
    (function(_Component3) {
      _inheritsLoose(Databases, _Component3);

      function Databases() {
        var _temp, _this;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return (
          ((_temp = _this = _Component3.call.apply(_Component3, [this].concat(args)) || this),
          Object.defineProperty(_assertThisInitialized(_this), 'state', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: {
              databases: [],
            },
          }),
          Object.defineProperty(_assertThisInitialized(_this), 'loadSamples', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function value(_) {
              _this.setState({
                databases: ENV.generateData(true).toArray(),
              }); // Monitoring.renderRate.ping();

              setTimeout(_this.loadSamples, ENV.timeout);
            },
          }),
          _temp) || _assertThisInitialized(_this)
        );
      }

      var _proto3 = Databases.prototype;

      _proto3.componentDidMount = function componentDidMount() {
        this.loadSamples();
      };

      _proto3.render = function render$$1(_, state) {
        return h(
          'tbody',
          null,
          state.databases.map(function(database) {
            return h(Database, {
              key: database.dbname,
              lastMutationId: database.lastMutationId,
              dbname: database.dbname,
              samples: database.samples,
              lastSample: database.lastSample,
            });
          }),
        );
      };

      return Databases;
    })(Component);

  var DBMon =
    /*#__PURE__*/
    (function(_Component4) {
      _inheritsLoose(DBMon, _Component4);

      function DBMon() {
        var _temp2, _this2;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return (
          ((_temp2 = _this2 = _Component4.call.apply(_Component4, [this].concat(args)) || this),
          Object.defineProperty(_assertThisInitialized(_this2), 'state', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: {
              mutations: 0.5,
            },
          }),
          Object.defineProperty(_assertThisInitialized(_this2), 'handleSliderChange', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function value(e) {
              var mutations = e.target.value / 100;
              ENV.mutations(mutations);

              _this2.setState({
                mutations: mutations,
              });
            },
          }),
          _temp2) || _assertThisInitialized(_this2)
        );
      }

      var _proto4 = DBMon.prototype;

      _proto4.render = function render$$1(_, state) {
        return h(
          'div',
          null,
          h(
            'div',
            {
              id: 'mutations',
            },
            h(
              'label',
              {
                id: 'ratioval',
              },
              'mutations: ',
              (state.mutations * 100).toFixed(0),
              '%',
            ),
            h('input', {
              type: 'range',
              onchange: this.handleSliderChange,
            }),
          ),
          h(
            'table',
            {
              class: 'table table-striped latest-data',
            },
            h(Databases, null),
          ),
        );
      };

      return DBMon;
    })(Component); // export class DBMon extends Component {
  //   state = {databases: []};
  //   loadSamples = _ => {
  //     this.setState({
  //       databases: ENV.generateData(true).toArray(),
  //     });
  //     // Monitoring.renderRate.ping();
  //     setTimeout(this.loadSamples, ENV.timeout);
  //   }
  //   componentDidMount() {
  //     this.loadSamples();
  //   }
  //   render(_, state) {
  //     return (
  //       <div>
  //         <div style={'display:flex'}>
  //         </div>
  //         <table class="table table-striped latest-data">
  //           <tbody>
  //             {state.databases.map(database => (
  //               <Database
  //                 key={database.dbname}
  //                 lastMutationId={database.lastMutationId}
  //                 dbname={database.dbname}
  //                 samples={database.samples}
  //                 lastSample={database.lastSample}
  //               />
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     );
  //   }
  // }

  /** "Hello World" component w/ a button click listener. */

  var Hello =
    /*#__PURE__*/
    (function(_Component) {
      _inheritsLoose(Hello, _Component);

      function Hello(props) {
        var _this;

        _this = _Component.call(this, props) || this;
        _this.state = {
          clicked: false,
        };
        _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
        return _this;
      }

      var _proto = Hello.prototype;

      _proto.handleClick = function handleClick(event) {
        this.setState({
          clicked: true,
        });
      };

      _proto.render = function render$$1(props, state) {
        return h(
          'div',
          null,
          h('p', null, 'Hello ', props.name, '! Button was clicked? ', state.clicked),
          h(
            'button',
            {
              onClick: this.handleClick,
            },
            'Button',
          ),
        );
      };

      return Hello;
    })(Component);
  /** To-do list adapted from example on https://reactjs.org. */

  var TodoList = function TodoList(props) {
    return h(
      'ul',
      null,
      props.items.map(function(item) {
        return h(
          'li',
          {
            key: item.id,
          },
          item.text,
        );
      }),
    );
  };

  var TodoApp =
    /*#__PURE__*/
    (function(_Component2) {
      _inheritsLoose(TodoApp, _Component2);

      function TodoApp() {
        var _temp, _this2;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return (
          ((_temp = _this2 = _Component2.call.apply(_Component2, [this].concat(args)) || this),
          Object.defineProperty(_assertThisInitialized(_this2), 'state', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: {
              items: [],
              text: '<Add TODO>',
              id: 0,
              focused: false,
            },
          }),
          Object.defineProperty(_assertThisInitialized(_this2), 'handleChange', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function value(e) {
              _this2.setState({
                text: e.target.value,
              });
            },
          }),
          Object.defineProperty(_assertThisInitialized(_this2), 'handleFocus', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function value(e) {
              // Clear placeholder text on first focus.
              if (!_this2.state.focused) {
                _this2.setState({
                  text: '',
                  focused: true,
                });
              }
            },
          }),
          Object.defineProperty(_assertThisInitialized(_this2), 'handleSubmit', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function value(e) {
              var _this2$state = _this2.state,
                text = _this2$state.text,
                id = _this2$state.id;

              if (!text.length) {
                return;
              }

              _this2.setState(function(prevState) {
                return {
                  items: prevState.items.concat({
                    text: text,
                    id: id,
                  }),
                  text: '',
                  id: prevState.id + 1,
                };
              });
            },
          }),
          _temp) || _assertThisInitialized(_this2)
        );
      }

      var _proto2 = TodoApp.prototype;

      _proto2.render = function render$$1(_, state) {
        return h(
          'div',
          null,
          h('h3', null, 'TODO'),
          h(TodoList, {
            items: state.items,
          }),
          h('input', {
            onChange: this.handleChange,
            onFocus: this.handleFocus,
            value: state.text,
          }),
          h(
            'button',
            {
              onClick: this.handleSubmit,
            },
            'Add #',
            state.items.length + 1,
          ),
        );
      };

      return TodoApp;
    })(Component);
  /** Timer example from https://reactjs.org */

  var Timer =
    /*#__PURE__*/
    (function(_Component3) {
      _inheritsLoose(Timer, _Component3);

      function Timer() {
        var _temp2, _this3;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return (
          ((_temp2 = _this3 = _Component3.call.apply(_Component3, [this].concat(args)) || this),
          Object.defineProperty(_assertThisInitialized(_this3), 'state', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: {
              seconds: 0,
            },
          }),
          Object.defineProperty(_assertThisInitialized(_this3), 'tick', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function value() {
              _this3.setState(function(prevState) {
                return {
                  seconds: prevState.seconds + 1,
                };
              });
            },
          }),
          _temp2) || _assertThisInitialized(_this3)
        );
      }

      var _proto3 = Timer.prototype;

      _proto3.componentDidMount = function componentDidMount() {
        this.interval = setInterval(this.tick, 1000);
      };

      _proto3.componentWillUnmount = function componentWillUnmount() {
        clearInterval(this.interval);
      };

      _proto3.render = function render$$1(_, state) {
        return h('div', null, 'Seconds: ', state.seconds);
      };

      return Timer;
    })(Component); // TODO(willchou): Support rendering to nodes other than body.
  // render(<Hello />, document.body);
  // render(<TodoApp />, document.body);
  // render(<Timer />, document.body);

  render(h(DBMon, null), document.body);
})();
//# sourceMappingURL=app.js.map
