export const style = /*css*/ `
    :root {
        --light: #ffffff;
        --dark: #1c1b1bf4;
    }

    @media (prefers-color-scheme: light) {
        :root {
            --text-color: var(--dark);
            --bg-color: var(--light);
            --link-color: #0a85ba;
            --link-visited-color: #39383c;
        }
    }
    @media (prefers-color-scheme: dark) {
        :root {
            --text-color: var(--light);
            --bg-color: var(--dark);
            --link-color: #7bffa9;
            --link-visited-color: #f8e1c2;
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
    /* selection before */
    h1:hover > a {
        color: var(--bg-color);
        background-color: var(--link-color);
    }
    /* selection after */
    a:hover ~ a  {
        color: var(--link-color);
        background-color: var(--bg-color);
    }
    a:visited {
        color: var(--link-visited-color);
    }
    h1:hover > a:visited {
        color: var(--bg-color);
        background-color: var(--link-visited-color);
    }
    a:hover ~ a:visited  {
        color: var(--link-visited-color);
        background-color: var(--bg-color);
    }

    article {
        min-width: 75vw;
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
