// deno-lint-ignore-file
var EMPTY_OBJ = {}
var EMPTY_ARR = []
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i

var isArray = Array.isArray
/**
 * Assign properties from `props` to `obj`
 * @template O, P The obj and props types
 * @param {O} obj The object to copy properties to
 * @param {P} props The object to copy properties from
 * @returns {O & P}
 */

function assign(obj, props) {
	// @ts-ignore We change the type of `obj` to be `O & P`
	for (var i in props) {
		obj[i] = props[i]
	}

	return obj
}
/**
 * Remove a child node from its parent if attached. This is a workaround for
 * IE11 which doesn't support `Element.prototype.remove()`. Using this function
 * is smaller than including a dedicated polyfill.
 * @param {Node} node The node to remove
 */

function removeNode(node) {
	var parentNode = node.parentNode
	if (parentNode) parentNode.removeChild(node)
}
var slice = EMPTY_ARR.slice

/**
 * Find the closest error boundary to a thrown error and call it
 * @param {object} error The thrown value
 * @param {import('./preact.d.ts').VNode} vnode The vnode that threw
 * the error that was caught (except for unmounting when this parameter
 * is the highest parent that was being unmounted)
 * @param {import('./preact.d.ts').VNode} [oldVNode]
 * @param {import('./preact.d.ts').ErrorInfo} [errorInfo]
 */
function _catchError(error, vnode, oldVNode, errorInfo) {
	/** @type {import('./preact.d.ts').Component} */
	var component, ctor, handled

	for (; (vnode = vnode.__);) {
		if ((component = vnode.__c) && !component.__) {
			try {
				ctor = component.constructor

				if (ctor && ctor.getDerivedStateFromError != null) {
					component.setState(ctor.getDerivedStateFromError(error))
					handled = component.__d
				}

				if (component.componentDidCatch != null) {
					component.componentDidCatch(error, errorInfo || {})
					handled = component.__d
				} // This is an error boundary. Mark it as having bailed out, and whether it was mid-hydration.

				if (handled) {
					return (component.__E = component)
				}
			} catch (e) {
				error = e
			}
		}
	}

	throw error
}

/**
 * The `option` object can potentially contain callback functions
 * that are called during various stages of our renderer. This is the
 * foundation on which all our addons like `preact/debug`, `preact/compat`,
 * and `preact/hooks` are based on. See the `Options` type in `internal.d.ts`
 * for a full list of available option hooks (most editors/IDEs allow you to
 * ctrl+click or cmd+click on mac the type definition below).
 * @type {import('./preact.d.ts').Options}
 */

var options = {
	__e: _catchError,
}

var vnodeId = 0
/**
 * Create an virtual node (used for JSX)
 * @param {import('./preact.d.ts').VNode["type"]} type The node name or Component
 * constructor for this virtual node
 * @param {object | null | undefined} [props] The properties of the virtual node
 * @param {Array<import('./preact.d.ts').ComponentChildren>} [children] The children of the virtual node
 * @returns {import('./preact.d.ts').VNode}
 */

function createElement(type, props, children) {
	var normalizedProps = {},
		key,
		ref,
		i

	for (i in props) {
		if (i == "key") key = props[i]
		else if (i == "ref") ref = props[i]
		else normalizedProps[i] = props[i]
	}

	if (arguments.length > 2) {
		normalizedProps.children = arguments.length > 3 ? slice.call(arguments, 2) : children
	} // If a Component VNode, check for and apply defaultProps
	// Note: type may be undefined in development, must never error here.

	if (typeof type == "function" && type.defaultProps != null) {
		for (i in type.defaultProps) {
			if (normalizedProps[i] === undefined) {
				normalizedProps[i] = type.defaultProps[i]
			}
		}
	}

	return createVNode(type, normalizedProps, key, ref, null)
}
/**
 * Create a VNode (used internally by Preact)
 * @param {import('./preact.d.ts').VNode["type"]} type The node name or Component
 * Constructor for this virtual node
 * @param {object | string | number | null} props The properties of this virtual node.
 * If this virtual node represents a text node, this is the text of the node (string or number).
 * @param {string | number | null} key The key for this virtual node, used when
 * diffing it against its children
 * @param {import('./preact.d.ts').VNode["ref"]} ref The ref property that will
 * receive a reference to its created child
 * @returns {import('./preact.d.ts').VNode}
 */

function createVNode(type, props, key, ref, original) {
	// V8 seems to be better at detecting type shapes if the object is allocated from the same call site
	// Do not inline into createElement and coerceToVNode!
	var vnode = {
		type: type,
		props: props,
		key: key,
		ref: ref,
		__k: null,
		__: null,
		__b: 0,
		__e: null,
		// _nextDom must be initialized to undefined b/c it will eventually
		// be set to dom.nextSibling which can return `null` and it is important
		// to be able to distinguish between an uninitialized _nextDom and
		// a _nextDom that has been set to `null`
		__d: undefined,
		__c: null,
		__h: null,
		constructor: undefined,
		__v: original == null ? ++vnodeId : original,
	} // Only invoke the vnode hook if this was *not* a direct copy:

	if (original == null && options.vnode != null) options.vnode(vnode)
	return vnode
}
function createRef() {
	return {
		current: null,
	}
}
function Fragment(props) {
	return props.children
}
/**
 * Check if a the argument is a valid Preact VNode.
 * @param {*} vnode
 * @returns {vnode is import('./preact.d.ts').VNode}
 */

var isValidElement = function isValidElement(vnode) {
	return vnode != null && vnode.constructor == undefined
}

/**
 * Base Component class. Provides `setState()` and `forceUpdate()`, which
 * trigger rendering
 * @param {object} props The initial component props
 * @param {object} context The initial context from parent components'
 * getChildContext
 */

function Component(props, context) {
	this.props = props
	this.context = context
}
/**
 * Update component state and schedule a re-render.
 * @this {import('./preact.d.ts').Component}
 * @param {object | ((s: object, p: object) => object)} update A hash of state
 * properties to update with new values or a function that given the current
 * state and props returns a new partial state
 * @param {() => void} [callback] A function to be called once component state is
 * updated
 */

Component.prototype.setState = function (update, callback) {
	// only clone state when copying to nextState the first time.
	var s

	if (this.__s != null && this.__s !== this.state) {
		s = this.__s
	} else {
		s = this.__s = assign({}, this.state)
	}

	if (typeof update == "function") {
		// Some libraries like `immer` mark the current state as readonly,
		// preventing us from mutating it, so we need to clone it. See #2716
		update = update(assign({}, s), this.props)
	}

	if (update) {
		assign(s, update)
	} // Skip update if updater function returned null

	if (update == null) return

	if (this.__v) {
		if (callback) {
			this._sb.push(callback)
		}

		enqueueRender(this)
	}
}
/**
 * Immediately perform a synchronous re-render of the component
 * @this {import('./preact.d.ts').Component}
 * @param {() => void} [callback] A function to be called after component is
 * re-rendered
 */

Component.prototype.forceUpdate = function (callback) {
	if (this.__v) {
		// Set render mode so that we can differentiate where the render request
		// is coming from. We need this because forceUpdate should never call
		// shouldComponentUpdate
		this.__e = true
		if (callback) this.__h.push(callback)
		enqueueRender(this)
	}
}
/**
 * Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
 * Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
 * @param {object} props Props (eg: JSX attributes) received from parent
 * element/component
 * @param {object} state The component's current state
 * @param {object} context Context object, as returned by the nearest
 * ancestor's `getChildContext()`
 * @returns {import('./preact.d.ts').ComponentChildren | void}
 */

Component.prototype.render = Fragment
/**
 * @param {import('./preact.d.ts').VNode} vnode
 * @param {number | null} [childIndex]
 */

function getDomSibling(vnode, childIndex) {
	if (childIndex == null) {
		// Use childIndex==null as a signal to resume the search from the vnode's sibling
		return vnode.__ ? getDomSibling(vnode.__, vnode.__.__k.indexOf(vnode) + 1) : null
	}

	var sibling

	for (; childIndex < vnode.__k.length; childIndex++) {
		sibling = vnode.__k[childIndex]

		if (sibling != null && sibling.__e != null) {
			// Since updateParentDomPointers keeps _dom pointer correct,
			// we can rely on _dom to tell us if this subtree contains a
			// rendered DOM node, and what the first rendered DOM node is
			return sibling.__d || sibling.__e
		}
	} // If we get here, we have not found a DOM node in this vnode's children.
	// We must resume from this vnode's sibling (in it's parent _children array)
	// Only climb up and search the parent if we aren't searching through a DOM
	// VNode (meaning we reached the DOM parent of the original vnode that began
	// the search)

	return typeof vnode.type == "function" ? getDomSibling(vnode) : null
}
/**
 * Trigger in-place re-rendering of a component.
 * @param {import('./preact.d.ts').Component} component The component to rerender
 */

function renderComponent(component) {
	var vnode = component.__v,
		oldDom = vnode.__e,
		parentDom = component.__P

	if (parentDom) {
		var commitQueue = [],
			refQueue = []
		var oldVNode = assign({}, vnode)
		oldVNode.__v = vnode.__v + 1
		diff(
			parentDom,
			vnode,
			oldVNode,
			component.__n,
			parentDom.ownerSVGElement !== undefined,
			vnode.__h != null ? [oldDom] : null,
			commitQueue,
			oldDom == null ? getDomSibling(vnode) : oldDom,
			vnode.__h,
			refQueue,
		)
		commitRoot(commitQueue, vnode, refQueue)

		if (vnode.__e != oldDom) {
			updateParentDomPointers(vnode)
		}
	}
}
/**
 * @param {import('./preact.d.ts').VNode} vnode
 */

function updateParentDomPointers(vnode) {
	if ((vnode = vnode.__) != null && vnode.__c != null) {
		vnode.__e = vnode.__c.base = null

		for (var i = 0; i < vnode.__k.length; i++) {
			var child = vnode.__k[i]

			if (child != null && child.__e != null) {
				vnode.__e = vnode.__c.base = child.__e
				break
			}
		}

		return updateParentDomPointers(vnode)
	}
}
/**
 * The render queue
 * @type {Array<import('./preact.d.ts').Component>}
 */

var rerenderQueue = []
/*
 * The value of `Component.debounce` must asynchronously invoke the passed in callback. It is
 * important that contributors to Preact can consistently reason about what calls to `setState`, etc.
 * do, and when their effects will be applied. See the links below for some further reading on designing
 * asynchronous APIs.
 * * [Designing APIs for Asynchrony](https://blog.izs.me/2013/08/designing-apis-for-asynchrony)
 * * [Callbacks synchronous and asynchronous](https://blog.ometer.com/2011/07/24/callbacks-synchronous-and-asynchronous/)
 */

var prevDebounce
var defer = typeof Promise == "function"
	? Promise.prototype.then.bind(Promise.resolve())
	: setTimeout
/**
 * Enqueue a rerender of a component
 * @param {import('./preact.d.ts').Component} c The component to rerender
 */

function enqueueRender(c) {
	if (
		(!c.__d && (c.__d = true) && rerenderQueue.push(c) && !process.__r++) ||
		prevDebounce !== options.debounceRendering
	) {
		prevDebounce = options.debounceRendering
		;(prevDebounce || defer)(process)
	}
}
/**
 * @param {import('./preact.d.ts').Component} a
 * @param {import('./preact.d.ts').Component} b
 */

var depthSort = function depthSort(a, b) {
	return a.__v.__b - b.__v.__b
}
/** Flush the render queue by rerendering all queued components */

function process() {
	var c
	rerenderQueue.sort(depthSort) // Don't update `renderCount` yet. Keep its value non-zero to prevent unnecessary
	// process() calls from getting scheduled while `queue` is still being consumed.

	while ((c = rerenderQueue.shift())) {
		if (c.__d) {
			var renderQueueLength = rerenderQueue.length
			renderComponent(c)

			if (rerenderQueue.length > renderQueueLength) {
				// When i.e. rerendering a provider additional new items can be injected, we want to
				// keep the order from top to bottom with those new items so we can handle them in a
				// single pass
				rerenderQueue.sort(depthSort)
			}
		}
	}

	process.__r = 0
}

process.__r = 0

/**
 * Diff the children of a virtual node
 * @param {import('./preact.d.ts').PreactElement} parentDom The DOM element whose
 * children are being diffed
 * @param {import('./preact.d.ts').ComponentChildren[]} renderResult
 * @param {import('./preact.d.ts').VNode} newParentVNode The new virtual
 * node whose children should be diff'ed against oldParentVNode
 * @param {import('./preact.d.ts').VNode} oldParentVNode The old virtual
 * node whose children should be diff'ed against newParentVNode
 * @param {object} globalContext The current context object - modified by getChildContext
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node
 * @param {Array<import('./preact.d.ts').PreactElement>} excessDomChildren
 * @param {Array<import('./preact.d.ts').Component>} commitQueue List of components
 * which have callbacks to invoke in commitRoot
 * @param {import('./preact.d.ts').PreactElement} oldDom The current attached DOM
 * element any new dom elements should be placed around. Likely `null` on first
 * render (except when hydrating). Can be a sibling DOM element when diffing
 * Fragments that have siblings. In most cases, it starts out as `oldChildren[0]._dom`.
 * @param {boolean} isHydrating Whether or not we are in hydration
 * @param {Array<any>} refQueue an array of elements needed to invoke refs
 */

function diffChildren(
	parentDom,
	renderResult,
	newParentVNode,
	oldParentVNode,
	globalContext,
	isSvg,
	excessDomChildren,
	commitQueue,
	oldDom,
	isHydrating,
	refQueue,
) {
	var i,
		j,
		oldVNode,
		childVNode,
		newDom,
		firstChildDom,
		skew = 0 // This is a compression of oldParentVNode!=null && oldParentVNode != EMPTY_OBJ && oldParentVNode._children || EMPTY_ARR
	// as EMPTY_OBJ._children should be `undefined`.

	var oldChildren = (oldParentVNode && oldParentVNode.__k) || EMPTY_ARR
	var oldChildrenLength = oldChildren.length,
		remainingOldChildren = oldChildrenLength,
		newChildrenLength = renderResult.length
	newParentVNode.__k = []

	for (i = 0; i < newChildrenLength; i++) {
		childVNode = renderResult[i]

		if (
			childVNode == null ||
			typeof childVNode == "boolean" ||
			typeof childVNode == "function"
		) {
			childVNode = newParentVNode.__k[i] = null
		} // If this newVNode is being reused (e.g. <div>{reuse}{reuse}</div>) in the same diff,
		// or we are rendering a component (e.g. setState) copy the oldVNodes so it can have
		// it's own DOM & etc. pointers
		else if (
			childVNode.constructor == String ||
			typeof childVNode == "number" || // eslint-disable-next-line valid-typeof
			typeof childVNode == "bigint"
		) {
			childVNode = newParentVNode.__k[i] = createVNode(
				null,
				childVNode,
				null,
				null,
				childVNode,
			)
		} else if (isArray(childVNode)) {
			childVNode = newParentVNode.__k[i] = createVNode(
				Fragment,
				{
					children: childVNode,
				},
				null,
				null,
				null,
			)
		} else if (childVNode.__b > 0) {
			// VNode is already in use, clone it. This can happen in the following
			// scenario:
			//   const reuse = <div />
			//   <div>{reuse}<span />{reuse}</div>
			childVNode = newParentVNode.__k[i] = createVNode(
				childVNode.type,
				childVNode.props,
				childVNode.key,
				childVNode.ref ? childVNode.ref : null,
				childVNode.__v,
			)
		} else {
			childVNode = newParentVNode.__k[i] = childVNode
		} // Terser removes the `continue` here and wraps the loop body
		// in a `if (childVNode) { ... } condition

		if (childVNode == null) {
			oldVNode = oldChildren[i]

			if (oldVNode && oldVNode.key == null && oldVNode.__e) {
				if (oldVNode.__e == oldDom) {
					oldVNode.__ = oldParentVNode
					oldDom = getDomSibling(oldVNode)
				}

				unmount(oldVNode, oldVNode, false)
				oldChildren[i] = null
			}

			continue
		}

		childVNode.__ = newParentVNode
		childVNode.__b = newParentVNode.__b + 1
		var skewedIndex = i + skew
		var matchingIndex = findMatchingIndex(
			childVNode,
			oldChildren,
			skewedIndex,
			remainingOldChildren,
		)

		if (matchingIndex === -1) {
			oldVNode = EMPTY_OBJ
		} else {
			oldVNode = oldChildren[matchingIndex] || EMPTY_OBJ
			oldChildren[matchingIndex] = undefined
			remainingOldChildren--
		} // Morph the old element into the new one, but don't append it to the dom yet

		diff(
			parentDom,
			childVNode,
			oldVNode,
			globalContext,
			isSvg,
			excessDomChildren,
			commitQueue,
			oldDom,
			isHydrating,
			refQueue,
		)
		newDom = childVNode.__e

		if ((j = childVNode.ref) && oldVNode.ref != j) {
			if (oldVNode.ref) {
				applyRef(oldVNode.ref, null, childVNode)
			}

			refQueue.push(j, childVNode.__c || newDom, childVNode)
		}

		if (newDom != null) {
			if (firstChildDom == null) {
				firstChildDom = newDom
			}

			var isMounting = oldVNode === EMPTY_OBJ || oldVNode.__v === null

			if (isMounting) {
				if (matchingIndex == -1) {
					skew--
				}
			} else if (matchingIndex !== skewedIndex) {
				if (matchingIndex === skewedIndex + 1) {
					skew++
				} else if (matchingIndex > skewedIndex) {
					if (remainingOldChildren > newChildrenLength - skewedIndex) {
						skew += matchingIndex - skewedIndex
					} else {
						// ### Change from keyed: I think this was missing from the algo...
						skew--
					}
				} else if (matchingIndex < skewedIndex) {
					if (matchingIndex == skewedIndex - 1) {
						skew = matchingIndex - skewedIndex
					} else {
						skew = 0
					}
				} else {
					skew = 0
				}
			}

			skewedIndex = i + skew

			if (
				typeof childVNode.type == "function" &&
				(matchingIndex !== skewedIndex || oldVNode.__k === childVNode.__k)
			) {
				oldDom = reorderChildren(childVNode, oldDom, parentDom)
			} else if (
				typeof childVNode.type != "function" &&
				(matchingIndex !== skewedIndex || isMounting)
			) {
				oldDom = placeChild(parentDom, newDom, oldDom)
			} else if (childVNode.__d !== undefined) {
				// Only Fragments or components that return Fragment like VNodes will
				// have a non-undefined _nextDom. Continue the diff from the sibling
				// of last DOM child of this child VNode
				oldDom = childVNode.__d // Eagerly cleanup _nextDom. We don't need to persist the value because
				// it is only used by `diffChildren` to determine where to resume the diff after
				// diffing Components and Fragments. Once we store it the nextDOM local var, we
				// can clean up the property

				childVNode.__d = undefined
			} else {
				oldDom = newDom.nextSibling
			}

			if (typeof newParentVNode.type == "function") {
				// Because the newParentVNode is Fragment-like, we need to set it's
				// _nextDom property to the nextSibling of its last child DOM node.
				//
				// `oldDom` contains the correct value here because if the last child
				// is a Fragment-like, then oldDom has already been set to that child's _nextDom.
				// If the last child is a DOM VNode, then oldDom will be set to that DOM
				// node's nextSibling.
				newParentVNode.__d = oldDom
			}
		}
	}

	newParentVNode.__e = firstChildDom // Remove remaining oldChildren if there are any.

	for (i = oldChildrenLength; i--;) {
		if (oldChildren[i] != null) {
			if (
				typeof newParentVNode.type == "function" &&
				oldChildren[i].__e != null &&
				oldChildren[i].__e == newParentVNode.__d
			) {
				// If the newParentVNode.__nextDom points to a dom node that is about to
				// be unmounted, then get the next sibling of that vnode and set
				// _nextDom to it
				newParentVNode.__d = oldChildren[i].__e.nextSibling
			}

			unmount(oldChildren[i], oldChildren[i])
		}
	}
}

function reorderChildren(childVNode, oldDom, parentDom) {
	// Note: VNodes in nested suspended trees may be missing _children.
	var c = childVNode.__k
	var tmp = 0

	for (; c && tmp < c.length; tmp++) {
		var vnode = c[tmp]

		if (vnode) {
			// We typically enter this code path on sCU bailout, where we copy
			// oldVNode._children to newVNode._children. If that is the case, we need
			// to update the old children's _parent pointer to point to the newVNode
			// (childVNode here).
			vnode.__ = childVNode

			if (typeof vnode.type == "function") {
				oldDom = reorderChildren(vnode, oldDom, parentDom)
			} else {
				oldDom = placeChild(parentDom, vnode.__e, oldDom)
			}
		}
	}

	return oldDom
}
/**
 * Flatten and loop through the children of a virtual node
 * @param {import('./preact.d.ts').ComponentChildren} children The unflattened
 * children of a virtual node
 * @returns {import('./preact.d.ts').VNode[]}
 */

function toChildArray(children, out) {
	out = out || []

	if (children == null || typeof children == "boolean");
	else if (isArray(children)) {
		children.some(function (child) {
			toChildArray(child, out)
		})
	} else {
		out.push(children)
	}

	return out
}

function placeChild(parentDom, newDom, oldDom) {
	if (oldDom == null) {
		console.log("place", newDom, "before", null, "in", parentDom)
		parentDom.insertBefore(newDom, null)
	} else if (oldDom.parentNode !== parentDom) {
		console.log("place", newDom, "before", oldDom, "in", parentDom)
		parentDom.insertBefore(newDom, oldDom)
	} else if (newDom != oldDom || newDom.parentNode == null) {
		console.log("place", newDom, "before", oldDom, "in", parentDom)
		parentDom.insertBefore(newDom, oldDom)
	}

	return newDom.nextSibling
}
/**
 * @param {import('./preact.d.ts').VNode | string} childVNode
 * @param {import('./preact.d.ts').VNode[]} oldChildren
 * @param {number} skewedIndex
 * @param {number} remainingOldChildren
 * @returns {number}
 */

function findMatchingIndex(
	childVNode,
	oldChildren,
	skewedIndex,
	remainingOldChildren,
) {
	var key = childVNode.key
	var type = childVNode.type
	var x = skewedIndex - 1
	var y = skewedIndex + 1
	var oldVNode = oldChildren[skewedIndex]

	if (
		oldVNode === null ||
		(oldVNode && key == oldVNode.key && type === oldVNode.type)
	) {
		return skewedIndex
	} else if (remainingOldChildren > (oldVNode != null ? 1 : 0)) {
		while (x >= 0 || y < oldChildren.length) {
			if (x >= 0) {
				oldVNode = oldChildren[x]

				if (oldVNode && key == oldVNode.key && type === oldVNode.type) {
					return x
				}

				x--
			}

			if (y < oldChildren.length) {
				oldVNode = oldChildren[y]

				if (oldVNode && key == oldVNode.key && type === oldVNode.type) {
					return y
				}

				y++
			}
		}
	}

	return -1
}

/**
 * Diff the old and new properties of a VNode and apply changes to the DOM node
 * @param {import('./preact.d.ts').PreactElement} dom The DOM node to apply
 * changes to
 * @param {object} newProps The new props
 * @param {object} oldProps The old props
 * @param {boolean} isSvg Whether or not this node is an SVG node
 * @param {boolean} hydrate Whether or not we are in hydration mode
 */

function diffProps(dom, newProps, oldProps, isSvg, hydrate) {
	var i

	for (i in oldProps) {
		if (i !== "children" && i !== "key" && !(i in newProps)) {
			setProperty(dom, i, null, oldProps[i], isSvg)
		}
	}

	for (i in newProps) {
		if (
			(!hydrate || typeof newProps[i] == "function") &&
			i !== "children" &&
			i !== "key" &&
			i !== "value" &&
			i !== "checked" &&
			oldProps[i] !== newProps[i]
		) {
			setProperty(dom, i, newProps[i], oldProps[i], isSvg)
		}
	}
}

function setStyle(style, key, value) {
	if (key[0] === "-") {
		style.setProperty(key, value == null ? "" : value)
	} else if (value == null) {
		style[key] = ""
	} else if (typeof value != "number" || IS_NON_DIMENSIONAL.test(key)) {
		style[key] = value
	} else {
		style[key] = value + "px"
	}
}
/**
 * Set a property value on a DOM node
 * @param {import('./preact.d.ts').PreactElement} dom The DOM node to modify
 * @param {string} name The name of the property to set
 * @param {*} value The value to set the property to
 * @param {*} oldValue The old value the property had
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node or not
 */

function setProperty(dom, name, value, oldValue, isSvg) {
	var useCapture

	o: if (name === "style") {
		if (typeof value == "string") {
			dom.style.cssText = value
		} else {
			if (typeof oldValue == "string") {
				dom.style.cssText = oldValue = ""
			}

			if (oldValue) {
				for (name in oldValue) {
					if (!(value && name in value)) {
						setStyle(dom.style, name, "")
					}
				}
			}

			if (value) {
				for (name in value) {
					if (!oldValue || value[name] !== oldValue[name]) {
						setStyle(dom.style, name, value[name])
					}
				}
			}
		}
	} // Benchmark for comparison: https://esbench.com/bench/574c954bdb965b9a00965ac6
	else if (name[0] === "o" && name[1] === "n") {
		useCapture = name !== (name = name.replace(/(PointerCapture)$|Capture$/, "$1")) // Infer correct casing for DOM built-in events:

		if (name.toLowerCase() in dom) name = name.toLowerCase().slice(2)
		else name = name.slice(2)
		if (!dom.l) dom.l = {}
		dom.l[name + useCapture] = value

		if (value) {
			if (!oldValue) {
				value._attached = Date.now()
				var handler = useCapture ? eventProxyCapture : eventProxy
				dom.addEventListener(name, handler, useCapture)
			} else {
				value._attached = oldValue._attached
			}
		} else {
			var _handler = useCapture ? eventProxyCapture : eventProxy

			dom.removeEventListener(name, _handler, useCapture)
		}
	} else if (name !== "dangerouslySetInnerHTML") {
		if (isSvg) {
			// Normalize incorrect prop usage for SVG:
			// - xlink:href / xlinkHref --> href (xlink:href was removed from SVG and isn't needed)
			// - className --> class
			name = name.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s")
		} else if (
			name !== "width" &&
			name !== "height" &&
			name !== "href" &&
			name !== "list" &&
			name !== "form" && // Default value in browsers is `-1` and an empty string is
			// cast to `0` instead
			name !== "tabIndex" &&
			name !== "download" &&
			name !== "rowSpan" &&
			name !== "colSpan" &&
			name !== "role" &&
			name in dom
		) {
			try {
				dom[name] = value == null ? "" : value // labelled break is 1b smaller here than a return statement (sorry)

				break o
			} catch (e) {}
		} // aria- and data- attributes have no boolean representation.
		// A `false` value is different from the attribute not being
		// present, so we can't remove it. For non-boolean aria
		// attributes we could treat false as a removal, but the
		// amount of exceptions would cost too many bytes. On top of
		// that other frameworks generally stringify `false`.

		if (typeof value == "function");
		else if (value != null && (value !== false || name[4] === "-")) {
			dom.setAttribute(name, value)
		} else {
			dom.removeAttribute(name)
		}
	}
}
/**
 * Proxy an event to hooked event handlers
 * @param {Event} e The event object from the browser
 * @private
 */

function eventProxy(e) {
	var eventHandler = this.l[e.type + false]
	/**
	 * This trick is inspired by Vue https://github.com/vuejs/core/blob/main/packages/runtime-dom/src/modules/events.ts#L90-L101
	 * when the dom performs an event it leaves micro-ticks in between bubbling up which means that an event can trigger on a newly
	 * created DOM-node while the event bubbles up, this can cause quirky behavior as seen in https://github.com/preactjs/preact/issues/3927
	 */

	if (!e._dispatched) {
		// When an event has no _dispatched we know this is the first event-target in the chain
		// so we set the initial dispatched time.
		e._dispatched = Date.now() // When the _dispatched is smaller than the time when the targetted event handler was attached
		// we know we have bubbled up to an element that was added during patching the dom.
	} else if (e._dispatched <= eventHandler._attached) {
		return
	}

	return eventHandler(options.event ? options.event(e) : e)
}

function eventProxyCapture(e) {
	return this.l[e.type + true](options.event ? options.event(e) : e)
}

/**
 * Diff two virtual nodes and apply proper changes to the DOM
 * @param {import('./preact.d.ts').PreactElement} parentDom The parent of the DOM element
 * @param {import('./preact.d.ts').VNode} newVNode The new virtual node
 * @param {import('./preact.d.ts').VNode} oldVNode The old virtual node
 * @param {object} globalContext The current context object. Modified by getChildContext
 * @param {boolean} isSvg Whether or not this element is an SVG node
 * @param {Array<import('./preact.d.ts').PreactElement>} excessDomChildren
 * @param {Array<import('./preact.d.ts').Component>} commitQueue List of components
 * which have callbacks to invoke in commitRoot
 * @param {import('./preact.d.ts').PreactElement} oldDom The current attached DOM
 * element any new dom elements should be placed around. Likely `null` on first
 * render (except when hydrating). Can be a sibling DOM element when diffing
 * Fragments that have siblings. In most cases, it starts out as `oldChildren[0]._dom`.
 * @param {boolean} isHydrating Whether or not we are in hydration
 * @param {Array<any>} refQueue an array of elements needed to invoke refs
 */

function diff(
	parentDom,
	newVNode,
	oldVNode,
	globalContext,
	isSvg,
	excessDomChildren,
	commitQueue,
	oldDom,
	isHydrating,
	refQueue,
) {
	var tmp,
		newType = newVNode.type // When passing through createElement it assigns the object
	// constructor as undefined. This to prevent JSON-injection.

	if (newVNode.constructor !== undefined) return null // If the previous diff bailed out, resume creating/hydrating.

	if (oldVNode.__h != null) {
		isHydrating = oldVNode.__h
		oldDom = newVNode.__e = oldVNode.__e // if we resume, we want the tree to be "unlocked"

		newVNode.__h = null
		excessDomChildren = [oldDom]
	}

	if ((tmp = options.__b)) tmp(newVNode)

	outer: if (typeof newType == "function") {
		try {
			var c, isNew, oldProps, oldState, snapshot, clearProcessingException
			var newProps = newVNode.props // Necessary for createContext api. Setting this property will pass
			// the context value as `this.context` just for this component.

			tmp = newType.contextType
			var provider = tmp && globalContext[tmp.__c]
			var componentContext = tmp ? provider ? provider.props.value : tmp.__ : globalContext // Get component and set it to `c`

			if (oldVNode.__c) {
				c = newVNode.__c = oldVNode.__c
				clearProcessingException = c.__ = c.__E
			} else {
				// Instantiate the new component
				if ("prototype" in newType && newType.prototype.render) {
					// @ts-ignore The check above verifies that newType is suppose to be constructed
					newVNode.__c = c = new newType(newProps, componentContext) // eslint-disable-line new-cap
				} else {
					// @ts-ignore Trust me, Component implements the interface we want
					newVNode.__c = c = new Component(newProps, componentContext)
					c.constructor = newType
					c.render = doRender
				}

				if (provider) provider.sub(c)
				c.props = newProps
				if (!c.state) c.state = {}
				c.context = componentContext
				c.__n = globalContext
				isNew = c.__d = true
				c.__h = []
				c._sb = []
			} // Invoke getDerivedStateFromProps

			if (c.__s == null) {
				c.__s = c.state
			}

			if (newType.getDerivedStateFromProps != null) {
				if (c.__s == c.state) {
					c.__s = assign({}, c.__s)
				}

				assign(c.__s, newType.getDerivedStateFromProps(newProps, c.__s))
			}

			oldProps = c.props
			oldState = c.state
			c.__v = newVNode // Invoke pre-render lifecycle methods

			if (isNew) {
				if (
					newType.getDerivedStateFromProps == null &&
					c.componentWillMount != null
				) {
					c.componentWillMount()
				}

				if (c.componentDidMount != null) {
					c.__h.push(c.componentDidMount)
				}
			} else {
				if (
					newType.getDerivedStateFromProps == null &&
					newProps !== oldProps &&
					c.componentWillReceiveProps != null
				) {
					c.componentWillReceiveProps(newProps, componentContext)
				}

				if (
					!c.__e &&
					((c.shouldComponentUpdate != null &&
						c.shouldComponentUpdate(newProps, c.__s, componentContext) ===
							false) ||
						newVNode.__v === oldVNode.__v)
				) {
					// More info about this here: https://gist.github.com/JoviDeCroock/bec5f2ce93544d2e6070ef8e0036e4e8
					if (newVNode.__v !== oldVNode.__v) {
						// When we are dealing with a bail because of sCU we have to update
						// the props, state and dirty-state.
						// when we are dealing with strict-equality we don't as the child could still
						// be dirtied see #3883
						c.props = newProps
						c.state = c.__s
						c.__d = false
					}

					newVNode.__e = oldVNode.__e
					newVNode.__k = oldVNode.__k

					newVNode.__k.forEach(function (vnode) {
						if (vnode) vnode.__ = newVNode
					})

					for (var i = 0; i < c._sb.length; i++) {
						c.__h.push(c._sb[i])
					}

					c._sb = []

					if (c.__h.length) {
						commitQueue.push(c)
					}

					break outer
				}

				if (c.componentWillUpdate != null) {
					c.componentWillUpdate(newProps, c.__s, componentContext)
				}

				if (c.componentDidUpdate != null) {
					c.__h.push(function () {
						c.componentDidUpdate(oldProps, oldState, snapshot)
					})
				}
			}

			c.context = componentContext
			c.props = newProps
			c.__P = parentDom
			c.__e = false
			var renderHook = options.__r,
				count = 0

			if ("prototype" in newType && newType.prototype.render) {
				c.state = c.__s
				c.__d = false
				if (renderHook) renderHook(newVNode)
				tmp = c.render(c.props, c.state, c.context)

				for (var _i = 0; _i < c._sb.length; _i++) {
					c.__h.push(c._sb[_i])
				}

				c._sb = []
			} else {
				do {
					c.__d = false
					if (renderHook) renderHook(newVNode)
					tmp = c.render(c.props, c.state, c.context) // Handle setState called in render, see #2553

					c.state = c.__s
				} while (c.__d && ++count < 25)
			} // Handle setState called in render, see #2553

			c.state = c.__s

			if (c.getChildContext != null) {
				globalContext = assign(assign({}, globalContext), c.getChildContext())
			}

			if (!isNew && c.getSnapshotBeforeUpdate != null) {
				snapshot = c.getSnapshotBeforeUpdate(oldProps, oldState)
			}

			var isTopLevelFragment = tmp != null && tmp.type === Fragment && tmp.key == null
			var renderResult = isTopLevelFragment ? tmp.props.children : tmp
			diffChildren(
				parentDom,
				isArray(renderResult) ? renderResult : [renderResult],
				newVNode,
				oldVNode,
				globalContext,
				isSvg,
				excessDomChildren,
				commitQueue,
				oldDom,
				isHydrating,
				refQueue,
			)
			c.base = newVNode.__e // We successfully rendered this VNode, unset any stored hydration/bailout state:

			newVNode.__h = null

			if (c.__h.length) {
				commitQueue.push(c)
			}

			if (clearProcessingException) {
				c.__E = c.__ = null
			}
		} catch (e) {
			newVNode.__v = null // if hydrating or creating initial tree, bailout preserves DOM:

			if (isHydrating || excessDomChildren != null) {
				newVNode.__e = oldDom
				newVNode.__h = !!isHydrating
				excessDomChildren[excessDomChildren.indexOf(oldDom)] = null // ^ could possibly be simplified to:
				// excessDomChildren.length = 0;
			}

			options.__e(e, newVNode, oldVNode)
		}
	} else if (excessDomChildren == null && newVNode.__v === oldVNode.__v) {
		newVNode.__k = oldVNode.__k
		newVNode.__e = oldVNode.__e
	} else {
		newVNode.__e = diffElementNodes(
			oldVNode.__e,
			newVNode,
			oldVNode,
			globalContext,
			isSvg,
			excessDomChildren,
			commitQueue,
			isHydrating,
			refQueue,
		)
	}

	if ((tmp = options.diffed)) tmp(newVNode)
}
/**
 * @param {Array<import('./preact.d.ts').Component>} commitQueue List of components
 * which have callbacks to invoke in commitRoot
 * @param {import('./preact.d.ts').VNode} root
 */

function commitRoot(commitQueue, root, refQueue) {
	for (var i = 0; i < refQueue.length; i++) {
		applyRef(refQueue[i], refQueue[++i], refQueue[++i])
	}

	if (options.__c) options.__c(root, commitQueue)
	commitQueue.some(function (c) {
		try {
			// @ts-ignore Reuse the commitQueue variable here so the type changes
			commitQueue = c.__h
			c.__h = []
			commitQueue.some(function (cb) {
				// @ts-ignore See above ts-ignore on commitQueue
				cb.call(c)
			})
		} catch (e) {
			options.__e(e, c.__v)
		}
	})
}
/**
 * Diff two virtual nodes representing DOM element
 * @param {import('./preact.d.ts').PreactElement} dom The DOM element representing
 * the virtual nodes being diffed
 * @param {import('./preact.d.ts').VNode} newVNode The new virtual node
 * @param {import('./preact.d.ts').VNode} oldVNode The old virtual node
 * @param {object} globalContext The current context object
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node
 * @param {*} excessDomChildren
 * @param {Array<import('./preact.d.ts').Component>} commitQueue List of components
 * which have callbacks to invoke in commitRoot
 * @param {boolean} isHydrating Whether or not we are in hydration
 * @param {Array<any>} refQueue an array of elements needed to invoke refs
 * @returns {import('./preact.d.ts').PreactElement}
 */

function diffElementNodes(
	dom,
	newVNode,
	oldVNode,
	globalContext,
	isSvg,
	excessDomChildren,
	commitQueue,
	isHydrating,
	refQueue,
) {
	var oldProps = oldVNode.props
	var newProps = newVNode.props
	var nodeType = newVNode.type
	var i = 0 // Tracks entering and exiting SVG namespace when descending through the tree.

	if (nodeType === "svg") isSvg = true

	if (excessDomChildren != null) {
		for (; i < excessDomChildren.length; i++) {
			var child = excessDomChildren[i] // if newVNode matches an element in excessDomChildren or the `dom`
			// argument matches an element in excessDomChildren, remove it from
			// excessDomChildren so it isn't later removed in diffChildren

			if (
				child &&
				"setAttribute" in child === !!nodeType &&
				(nodeType ? child.localName === nodeType : child.nodeType === 3)
			) {
				dom = child
				excessDomChildren[i] = null
				break
			}
		}
	}

	if (dom == null) {
		if (nodeType === null) {
			// @ts-ignore createTextNode returns Text, we expect PreactElement
			return document.createTextNode(newProps)
		}

		if (isSvg) {
			dom = document.createElementNS(
				"http://www.w3.org/2000/svg", // @ts-ignore We know `newVNode.type` is a string
				nodeType,
			)
		} else {
			dom = document.createElement(
				// @ts-ignore We know `newVNode.type` is a string
				nodeType,
				newProps.is && newProps,
			)
		} // we created a new parent, so none of the previously attached children can be reused:

		excessDomChildren = null // we are creating a new node, so we can assume this is a new subtree (in case we are hydrating), this deopts the hydrate

		isHydrating = false
	}

	if (nodeType === null) {
		// During hydration, we still have to split merged text from SSR'd HTML.
		if (oldProps !== newProps && (!isHydrating || dom.data !== newProps)) {
			dom.data = newProps
		}
	} else {
		// If excessDomChildren was not null, repopulate it with the current element's children:
		excessDomChildren = excessDomChildren && slice.call(dom.childNodes)
		oldProps = oldVNode.props || EMPTY_OBJ
		var oldHtml = oldProps.dangerouslySetInnerHTML
		var newHtml = newProps.dangerouslySetInnerHTML // During hydration, props are not diffed at all (including dangerouslySetInnerHTML)
		// @TODO we should warn in debug mode when props don't match here.

		if (!isHydrating) {
			// But, if we are in a situation where we are using existing DOM (e.g. replaceNode)
			// we should read the existing DOM attributes to diff them
			if (excessDomChildren != null) {
				oldProps = {}

				for (i = 0; i < dom.attributes.length; i++) {
					oldProps[dom.attributes[i].name] = dom.attributes[i].value
				}
			}

			if (newHtml || oldHtml) {
				// Avoid re-applying the same '__html' if it did not changed between re-render
				if (
					!newHtml ||
					((!oldHtml || newHtml.__html != oldHtml.__html) &&
						newHtml.__html !== dom.innerHTML)
				) {
					dom.innerHTML = (newHtml && newHtml.__html) || ""
				}
			}
		}

		diffProps(dom, newProps, oldProps, isSvg, isHydrating) // If the new vnode didn't have dangerouslySetInnerHTML, diff its children

		if (newHtml) {
			newVNode.__k = []
		} else {
			i = newVNode.props.children
			diffChildren(
				dom,
				isArray(i) ? i : [i],
				newVNode,
				oldVNode,
				globalContext,
				isSvg && nodeType !== "foreignObject",
				excessDomChildren,
				commitQueue,
				excessDomChildren
					? excessDomChildren[0]
					: oldVNode.__k && getDomSibling(oldVNode, 0),
				isHydrating,
				refQueue,
			) // Remove children that are not part of any vnode.

			if (excessDomChildren != null) {
				for (i = excessDomChildren.length; i--;) {
					if (excessDomChildren[i] != null) removeNode(excessDomChildren[i])
				}
			}
		} // (as above, don't diff props during hydration)

		if (!isHydrating) {
			if (
				"value" in newProps &&
				(i = newProps.value) !== undefined &&
				(i !== dom.value ||
					(nodeType === "progress" && !i) ||
					(nodeType === "option" && i !== oldProps.value))
			) {
				setProperty(dom, "value", i, oldProps.value, false)
			}

			if (
				"checked" in newProps &&
				(i = newProps.checked) !== undefined &&
				i !== dom.checked
			) {
				setProperty(dom, "checked", i, oldProps.checked, false)
			}
		}
	}

	return dom
}
/**
 * Invoke or update a ref, depending on whether it is a function or object ref.
 * @param {object|function} ref
 * @param {any} value
 * @param {import('./preact.d.ts').VNode} vnode
 */

function applyRef(ref, value, vnode) {
	try {
		if (typeof ref == "function") ref(value)
		else ref.current = value
	} catch (e) {
		options.__e(e, vnode)
	}
}
/**
 * Unmount a virtual node from the tree and apply DOM changes
 * @param {import('./preact.d.ts').VNode} vnode The virtual node to unmount
 * @param {import('./preact.d.ts').VNode} parentVNode The parent of the VNode that
 * initiated the unmount
 * @param {boolean} [skipRemove] Flag that indicates that a parent node of the
 * current element is already detached from the DOM.
 */

function unmount(vnode, parentVNode, skipRemove) {
	var r
	if (options.unmount) options.unmount(vnode)

	if ((r = vnode.ref)) {
		if (!r.current || r.current === vnode.__e) {
			applyRef(r, null, parentVNode)
		}
	}

	if ((r = vnode.__c) != null) {
		if (r.componentWillUnmount) {
			try {
				r.componentWillUnmount()
			} catch (e) {
				options.__e(e, parentVNode)
			}
		}

		r.base = r.__P = null
		vnode.__c = undefined
	}

	if ((r = vnode.__k)) {
		for (var i = 0; i < r.length; i++) {
			if (r[i]) {
				unmount(
					r[i],
					parentVNode,
					skipRemove || typeof vnode.type !== "function",
				)
			}
		}
	}

	if (!skipRemove && vnode.__e != null) {
		removeNode(vnode.__e)
	} // Must be set to `undefined` to properly clean up `_nextDom`
	// for which `null` is a valid value. See comment in `create-element.js`

	vnode.__ = vnode.__e = vnode.__d = undefined
}
/** The `.render()` method for a PFC backing instance. */

function doRender(props, state, context) {
	return this.constructor(props, context)
}

/**
 * Render a Preact virtual node into a DOM element
 * @param {import('./preact.d.ts').ComponentChild} vnode The virtual node to render
 * @param {import('./preact.d.ts').PreactElement} parentDom The DOM element to
 * render into
 * @param {import('./preact.d.ts').PreactElement | object} [replaceNode] Optional: Attempt to re-use an
 * existing DOM tree rooted at `replaceNode`
 */

function render(vnode, parentDom, replaceNode) {
	if (options.__) options.__(vnode, parentDom) // We abuse the `replaceNode` parameter in `hydrate()` to signal if we are in
	// hydration mode or not by passing the `hydrate` function instead of a DOM
	// element..

	var isHydrating = typeof replaceNode == "function" // To be able to support calling `render()` multiple times on the same
	// DOM node, we need to obtain a reference to the previous tree. We do
	// this by assigning a new `_children` property to DOM nodes which points
	// to the last rendered tree. By default this property is not present, which
	// means that we are mounting a new tree for the first time.

	var oldVNode = isHydrating ? null : (replaceNode && replaceNode.__k) || parentDom.__k
	vnode = ((!isHydrating && replaceNode) || parentDom).__k = createElement(
		Fragment,
		null,
		[vnode],
	) // List of effects that need to be called after diffing.

	var commitQueue = [],
		refQueue = []
	diff(
		parentDom, // Determine the new vnode tree and store it on the DOM element on
		// our custom `_children` property.
		vnode,
		oldVNode || EMPTY_OBJ,
		EMPTY_OBJ,
		parentDom.ownerSVGElement !== undefined,
		!isHydrating && replaceNode
			? [replaceNode]
			: oldVNode
			? null
			: parentDom.firstChild
			? slice.call(parentDom.childNodes)
			: null,
		commitQueue,
		!isHydrating && replaceNode ? replaceNode : oldVNode ? oldVNode.__e : parentDom.firstChild,
		isHydrating,
		refQueue,
	) // Flush all queued effects

	commitRoot(commitQueue, vnode, refQueue)
}
/**
 * Update an existing DOM element with data from a Preact virtual node
 * @param {import('./preact.d.ts').ComponentChild} vnode The virtual node to render
 * @param {import('./preact.d.ts').PreactElement} parentDom The DOM element to
 * update
 */

function hydrate(vnode, parentDom) {
	render(vnode, parentDom, hydrate)
}

/**
 * Clones the given VNode, optionally adding attributes/props and replacing its children.
 * @param {import('./preact.d.ts').VNode} vnode The virtual DOM element to clone
 * @param {object} props Attributes/props to add when cloning
 * @param {Array<import('./preact.d.ts').ComponentChildren>} rest Any additional arguments will be used as replacement children.
 * @returns {import('./preact.d.ts').VNode}
 */

function cloneElement(vnode, props, children) {
	var normalizedProps = assign({}, vnode.props),
		key,
		ref,
		i
	var defaultProps

	if (vnode.type && vnode.type.defaultProps) {
		defaultProps = vnode.type.defaultProps
	}

	for (i in props) {
		if (i == "key") key = props[i]
		else if (i == "ref") ref = props[i]
		else if (props[i] === undefined && defaultProps !== undefined) {
			normalizedProps[i] = defaultProps[i]
		} else {
			normalizedProps[i] = props[i]
		}
	}

	if (arguments.length > 2) {
		normalizedProps.children = arguments.length > 3 ? slice.call(arguments, 2) : children
	}

	return createVNode(
		vnode.type,
		normalizedProps,
		key || vnode.key,
		ref || vnode.ref,
		null,
	)
}

var i = 0
function createContext(defaultValue, contextId) {
	contextId = "__cC" + i++
	var context = {
		__c: contextId,
		__: defaultValue,

		/** @type {import('./preact.d.ts').FunctionComponent} */
		Consumer: function Consumer(props, contextValue) {
			// return props.children(
			// 	context[contextId] ? context[contextId].props.value : defaultValue
			// );
			return props.children(contextValue)
		},

		/** @type {import('./preact.d.ts').FunctionComponent} */
		Provider: function Provider(props) {
			if (!this.getChildContext) {
				/** @type {import('./preact.d.ts').Component[]} */
				var subs = []
				var ctx = {}
				ctx[contextId] = this

				this.getChildContext = function () {
					return ctx
				}

				this.shouldComponentUpdate = function (_props) {
					if (this.props.value !== _props.value) {
						// I think the forced value propagation here was only needed when `options.debounceRendering` was being bypassed:
						// https://github.com/preactjs/preact/commit/4d339fb803bea09e9f198abf38ca1bf8ea4b7771#diff-54682ce380935a717e41b8bfc54737f6R358
						// In those cases though, even with the value corrected, we're double-rendering all nodes.
						// It might be better to just tell folks not to use force-sync mode.
						// Currently, using `useContext()` in a class component will overwrite its `this.context` value.
						// subs.some(c => {
						// 	c.context = _props.value;
						// 	enqueueRender(c);
						// });
						// subs.some(c => {
						// 	c.context[contextId] = _props.value;
						// 	enqueueRender(c);
						// });
						subs.some(function (c) {
							c.__e = true
							enqueueRender(c)
						})
					}
				}

				this.sub = function (c) {
					subs.push(c)
					var old = c.componentWillUnmount

					c.componentWillUnmount = function () {
						subs.splice(subs.indexOf(c), 1)
						if (old) old.call(c)
					}
				}
			}

			return props.children
		},
	} // Devtools needs access to the context object when it
	// encounters a Provider. This is necessary to support
	// setting `displayName` on the context object instead
	// of on the component itself. See:
	// https://reactjs.org/docs/context.html#contextdisplayname

	return (context.Provider.__ = context.Consumer.contextType = context)
}

export {
	cloneElement,
	Component,
	createContext,
	createElement,
	createElement as h,
	createRef,
	Fragment,
	hydrate,
	isValidElement,
	options,
	render,
	toChildArray,
}
