module.exports = {
	mode: "jit",
	purge: [
		".src/pages/**/*.{js,ts,jsx,tsx}",
		".src/components/**/*.{js,ts,jsx,tsx}",
		".src/stories/**/*.stories.{js,ts,jsx,tsx}",
	],
	darkMode: "class", // or 'false' or 'class'
	theme: {
		colors: {
			tansparent: "transparent",
			current: "currentColor",
			blue: "#23539E",
			"blue-hover": "#306AC7",
			"blue-active": "#214E96",
			red: "#9E2323",
			green: "#239E2F",
			pink: "#9E2348",
			white: "#FFFFFF",

			ring: "#32BDC6",

			background: "#D8D8D8",
			foreground: "#E5E5E5",
			inset: "#E9E9E9",
			border: "#C9C9C9",
			"header-icon": "#B5B5B5",
			text: "#000000",
			placeholder: "#777777",

			"background-d": "#111111",
			"foreground-d": "#222222",
			"inset-d": "#333333",
			"border-d": "#444444",
			"header-icon-d": "#555555",
			"text-d": "#FFFFFF",
			"placeholder-d": "#777777",

			grey: "#D5D5D5",
			"grey-hover": "#A5A5A5",
			"grey-active": "#D5D5D5",
			"grey-d": "#333333",
			"grey-hover-d": "#3B3B3B",
			"grey-active-d": "#313131",

			icon: "#888888",
			"icon-hover": "#C0C0C0",
			"icon-active": "#777777",
			"icon-chonk": "#E5E5E5",
			"icon-chonk-d": "#222222",
			"icon-chonk-hover": "#B5B5B5",
			"icon-chonk-hover-d": "#333333",
			"icon-chonk-active": "#E9E9E9",
			"icon-chonk-active-d": "#1E1E1E",
		},
		ringColor: (theme) => {
			return { DEFAULT: theme("colors").ring };
		},
		borderRadius: {
			none: "0px",
			"a-little-bit": "4px",
			DEFAULT: "8px",
			full: "100px",
		},
		strokeWidth: {
			["1"]: "1",
			["2"]: "2",
			["2.5"]: "2.5",
			["3"]: "3",
			["4"]: "4",
			["8"]: "8",
			["16"]: "16",
			["32"]: "32",
		},
		fontSize: {
			massive: "30px",
			huge: "20px",
			large: "18px",
			normal: "14px",
			button: "13px",
		},

		spacing: {
			["0"]: "0px",
			["2"]: "2px",
			["4"]: "4px",
			["6"]: "6px",
			["7.5"]: "7.5px",
			["8.5"]: "8.5px",
			["9"]: "9px",
			["11"]: "11px",
			["12"]: "12px",
			["12.5"]: "12.5px",
			["13"]: "13px",
			["15"]: "15px",
			["15.5"]: "15.5px",
			["16"]: "16px",
			["17.5"]: "17.5px",
			["24"]: "24px",
			["48"]: "48px",
			["60"]: "60px",
			["84"]: "84px",
			["120"]: "120px",
		},
	},
	variants: {
		extend: { backgroundColor: ["active"], textColor: ["active"] },
	},
	plugins: [],
};
