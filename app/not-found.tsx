import NotFound from "./404";

export const metadata = {
	title: "404 Page Not Found",
	description: "This page doesnt exist",
	openGraph: {
		title: "404 Page Not Found",
		description: "This page doesnt exist",
		url: "https://credit-fit.alexgalhardo.com",
		siteName: "credit-fit",
		images: [
			{
				url: "https://jn8ro29yhv.ufs.sh/f/vHeKy2kb0BOP11yB1f902oNUJAhsEHWQqlITjdxySgXvfmct",
				width: 1200,
				height: 630,
				alt: "credit-fit",
			},
		],
		locale: "pt_BR",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "404 Page Not Found",
		description: "This page doesnt exist",
		images: ["https://jn8ro29yhv.ufs.sh/f/vHeKy2kb0BOP11yB1f902oNUJAhsEHWQqlITjdxySgXvfmct"],
	},
	metadataBase: new URL("https://credit-fit.alexgalhardo.com"),
};

export default NotFound;
