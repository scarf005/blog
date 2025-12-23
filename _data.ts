export const strings = {
	ko: {
		nav: {
			home: "홈",
			about: "소개",
		},
		index: {
			title: "목차",
		},
	},
	en: {
		nav: {
			home: "Home",
			about: "About",
		},
		index: {
			title: "Table of Contents",
		},
	},
	ja: {
		nav: {
			home: "ホーム",
			about: "紹介",
		},
		index: {
			title: "目次",
		},
	},
} as const

export type Lang = keyof typeof strings

export const getStrings = (lang: string = "ko") => strings[lang as Lang] ?? strings.ko
