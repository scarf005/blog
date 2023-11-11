// deno-lint-ignore-file
// deno-lint-ignore-file no-var
import { Fragment, options } from "./preact.js"
export { Fragment } from "./preact.js"

var ENCODED_ENTITIES = /["&<]/
/** @param {string} str */

function encodeEntities(str) {
	// Skip all work for strings with no entities needing encoding:
	if (str.length === 0 || ENCODED_ENTITIES.test(str) === false) return str
	var last = 0,
		i = 0,
		out = "",
		ch = "" // Seek forward in str until the next entity char:

	for (; i < str.length; i++) {
		switch (str.charCodeAt(i)) {
			case 34:
				ch = "&quot;"
				break

			case 38:
				ch = "&amp;"
				break

			case 60:
				ch = "&lt;"
				break

			default:
				continue
		} // Append skipped/buffered characters and the encoded entity:

		if (i !== last) out += str.slice(last, i)
		out += ch // Start the next seek/buffer after the entity's offset:

		last = i + 1
	}

	if (i !== last) out += str.slice(last, i)
	return out
}

/** @typedef {import('./preact.js').VNode} VNode */

var vnodeId = 0
var isArray = Array.isArray
/**
 * @fileoverview
 * This file exports various methods that implement Babel's "automatic" JSX runtime API:
 * - jsx(type, props, key)
 * - jsxs(type, props, key)
 * - jsxDEV(type, props, key, __source, __self)
 *
 * The implementation of createVNode here is optimized for performance.
 * Benchmarks: https://esbench.com/bench/5f6b54a0b4632100a7dcd2b3
 */

/**
 * JSX.Element factory used by Babel's {runtime:"automatic"} JSX transform
 * @param {VNode['type']} type
 * @param {VNode['props']} props
 * @param {VNode['key']} [key]
 * @param {unknown} [isStaticChildren]
 * @param {unknown} [__source]
 * @param {unknown} [__self]
 */

function createVNode(type, props, key, isStaticChildren, __source, __self) {
	// We'll want to preserve `ref` in props to get rid of the need for
	// forwardRef components in the future, but that should happen via
	// a separate PR.
	var normalizedProps = {},
		ref,
		i

	for (i in props) {
		if (i == "ref") {
			ref = props[i]
		} else {
			normalizedProps[i] = props[i]
		}
	}

	var vnode = {
		type: type,
		props: normalizedProps,
		key: key,
		ref: ref,
		__k: null,
		__: null,
		__b: 0,
		__e: null,
		__d: undefined,
		__c: null,
		__h: null,
		constructor: undefined,
		__v: --vnodeId,
		__i: -1,
		__source: __source,
		__self: __self,
	} // If a Component VNode, check for and apply defaultProps.
	// Note: `type` is often a String, and can be `undefined` in development.

	if (typeof type === "function" && (ref = type.defaultProps)) {
		for (i in ref) {
			if (typeof normalizedProps[i] === "undefined") {
				normalizedProps[i] = ref[i]
			}
		}
	}

	if (options.vnode) options.vnode(vnode)
	return vnode
}
/**
 * Create a template vnode. This function is not expected to be
 * used directly, but rather through a precompile JSX transform
 * @param {string[]} templates
 * @param  {Array<string | null | VNode>} exprs
 * @returns {VNode}
 */

function jsxTemplate(templates) {
	var vnode = createVNode(Fragment, {
		tpl: templates,
		exprs: [].slice.call(arguments, 1),
	}) // Bypass render to string top level Fragment optimization

	vnode.key = vnode.__v
	return vnode
}
/**
 * Serialize an HTML attribute to a string. This function is not
 * expected to be used directly, but rather through a precompile
 * JSX transform
 * @param {string} name The attribute name
 * @param {*} value The attribute value
 * @returns {string}
 */

function jsxAttr(name, value) {
	if (options.attr) {
		var result = options.attr(name, value)
		if (typeof result === "string") return result
	}

	if (name === "ref" || name === "key") return ""

	if (
		value == null ||
		value === false ||
		typeof value === "function" ||
		typeof value === "object"
	) {
		return ""
	} else if (value === true) return name

	return name + '="' + encodeEntities(value) + '"'
}
/**
 * Escape a dynamic child passed to `jsxTemplate`. This function
 * is not expected to be used directly, but rather through a
 * precompile JSX transform
 * @param {*} value
 * @returns {string | null | VNode | Array<string | null | VNode>}
 */

function jsxEscape(value) {
	if (
		value == null ||
		typeof value === "boolean" ||
		typeof value === "function"
	) {
		return null
	}

	if (typeof value === "object") {
		// Check for VNode
		if (value.constructor === undefined) return value

		if (isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				value[i] = jsxEscape(value[i])
			}

			return value
		}
	}

	return encodeEntities("" + value)
}

export {
	createVNode as jsx,
	createVNode as jsxDEV,
	createVNode as jsxs,
	jsxAttr,
	jsxEscape,
	jsxTemplate,
}
