// deno-lint-ignore-file no-empty-interface
import { JSXInternal } from "./jsx.d.ts"

declare global {
	namespace JSX {
		interface IntrinsicElements extends JSXInternal.IntrinsicElements {}
	}
}
