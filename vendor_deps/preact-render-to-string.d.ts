// deno-lint-ignore-file
import { VNode } from "./preact.d.ts"

export default function renderToString(vnode: VNode, context?: any): string

export function render(vnode: VNode, context?: any): string
export function renderToString(vnode: VNode, context?: any): string
export function renderToStaticMarkup(vnode: VNode, context?: any): string
