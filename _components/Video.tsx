import type { JSX } from "preact"

export default ({ ...props }: JSX.HTMLAttributes<HTMLVideoElement>) => <video controls {...props} />
