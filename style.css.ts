import { sarasa } from "./sarasa.css.ts"

export const style = /*css*/ `
    ${sarasa}

    @media (prefers-color-scheme: light) {
        :root {
            --text-color: #000000;
            --bg-color: #ffffff;
            --link-color: #6588a6;
            --link-visited-color: #605c6b;
        }
    }
    @media (prefers-color-scheme: dark) {
        :root {
            --text-color: #ffffff;
            --bg-color: #000000;
            --link-color: #a8d6ff;
            --link-visited-color: #d6c8fe;
        }
    }

    body {
        font-family: "Sarasa Mono Slab K";
        font-variant-ligatures: discretionary-ligatures;
        font-size: 1.5em;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: var(--text-color);
        background-color: var(--bg-color);
    }
    ul {
        padding: 0;
        list-style-type: none;
    }
    a {
        color: var(--link-color);
        text-decoration-thickness: 0.075em;
        text-decoration-line: underline;
    }
    a:hover {
        color: var(--bg-color);
        background-color: var(--link-color);
    }
    a:visited {
        color: var(--link-visited-color);
    }
    a:hover:visited {
        color: var(--bg-color);
        background-color: var(--link-visited-color);
    }
    article {
        min-width: 50vw;
        max-width: 100dvh;
        margin: auto;
    }
    main > ul {
        display: flex;
        flex-direction: column;
    }
    @media (max-width: 800px) {
        main > ul > li > span {
            display: none;
        }
    }
`
