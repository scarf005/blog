import { Footer, Nav } from "~/_components/mod.ts"

export default ({ title, children, url }: Lume.Data) => (
	<html lang="ko">
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />

			<title>{title ?? url}</title>
			<meta property="og:title" content={title} />
			<meta name="description" content={title} />

			<meta lang="ko" />
			<meta property="og:locale" content="ko" />

			<meta name="theme-color" content="#000000" />

			<link rel="icon" href="/assets/favicon.svg" />

			<link rel="stylesheet" href="/assets/style.css" />
			<link rel="stylesheet" href="/assets/url.css" />
			<link rel="stylesheet" href="/assets/highlight.css" />
		</head>
		<body>
			<Nav href={url} />
			<hr />
			{children}
			<Footer />
			<script type="module" src="/assets/flamethrower/flamethrower.js"></script>
		</body>
	</html>
)
