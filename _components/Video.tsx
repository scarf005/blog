import type { JSX } from "preact"

export const inheritData = false // Prevent to inherit all page data
export default (props: JSX.DOMAttributes<HTMLVideoElement>) => <video controls {...props} />
