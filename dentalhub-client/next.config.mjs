/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,

	eslint: {
		ignoreDuringBuilds: true,
	},

	compress: true,

	async headers() {
		const securityHeaders = [
			{
				key: "X-DNS-Prefetch-Control",
				value: "on",
			},
			{
				key: "Strict-Transport-Security",
				value: "max-age=63072000; includeSubDomains; preload",
			},
			{
				key: "X-XSS-Protection",
				value: "1; mode=block",
			},
			{
				key: "X-Frame-Options",
				value: "SAMEORIGIN",
			},
			{
				key: "Permissions-Policy",
				value: "camera=(), microphone=(), geolocation=()",
			},
			{
				key: "X-Content-Type-Options",
				value: "nosniff",
			},
			{
				key: "Referrer-Policy",
				value: "strict-origin-when-cross-origin",
			},
			{
				key: "Cross-Origin-Embedder-Policy",
				value: "*",
			},
			{
				key: "Cross-Origin-Resource-Policy",
				value: "*",
			},
			{
				key: "Cross-Origin-Opener-Policy",
				value: "*",
			},
		];
		return [
			{
				source: "/:path*",
				headers: securityHeaders,
			},
		];
	},
};

export default nextConfig;
