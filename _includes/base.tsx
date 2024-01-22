export default ({ title, children }: Lume.Data, {}: Lume.Helpers) => (
	<html lang="ko">
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />

			<title>{title}</title>
			<meta property="og:title" content={title} />
			<meta name="description" content={title} />

			<meta lang="ko" />
			<meta property="og:locale" content="ko" />

			<meta name="theme-color" content="#000000" />

			<link rel="icon" href="/assets/favicon.svg" />

			{/* @ts-ignore: inline is lume plugin property */}
			<link rel="stylesheet" inline href="/assets/style.css" />
			{/* @ts-ignore: inline is lume plugin property */}
			<link rel="stylesheet" inline href="/assets/url.css" />
		</head>
		<body>
			{children}
			<script type="module" src="/assets/flamethrower/flamethrower.js"></script>
		</body>
	</html>
)
