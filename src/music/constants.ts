export const validHosts = [
	'www.youtube.com',
	'youtube.com',
	'youtu.be',
	'open.spotify.com',
] as const;

export const ytdlFlags = (url: string) => ({
	retries: 3,
	dumpSingleJson: true,
	noWarnings: true,
	noCheckCertificate: true,
	preferFreeFormats: true,
	youtubeSkipDashManifest: true,
	format: 'bestaudio/best',
	referer: url,
});
