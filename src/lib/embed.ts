/*
 * Link do filmu z platformy → odtwarzacz osadzony (embed).
 * Obsługiwane: YouTube (też Shorts), TikTok, Facebook (rolki i filmy), Instagram (rolki i posty), plik MP4.
 * Pliki nie trafiają na nasz serwer — film gra z platformy, na której już jest.
 */
export type Embed = { kind: 'yt' | 'tt' | 'fb' | 'ig'; id: string; src: string; url: string; vertical: boolean; label: string };

export function parseEmbed(raw = ''): Embed | null {
	const url = String(raw || '').trim();
	if (!url || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url)) return null;
	let m: RegExpMatchArray | null;
	if ((m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/))) {
		const short = /shorts\//.test(url);
		return { kind: 'yt', id: m[1], url, vertical: short, label: 'YouTube', src: `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0&playsinline=1` };
	}
	if (/tiktok\.com/.test(url) && (m = url.match(/\/video\/(\d+)/))) {
		return { kind: 'tt', id: m[1], url, vertical: true, label: 'TikTok',
			src: `https://www.tiktok.com/player/v1/${m[1]}?autoplay=1&loop=1&music_info=0&description=0&rel=0&native_context_menu=0&closed_caption=0` };
	}
	if (/instagram\.com/.test(url) && (m = url.match(/\/(?:reel|reels|p|tv)\/([\w-]+)/))) {
		return { kind: 'ig', id: m[1], url, vertical: true, label: 'Instagram', src: `https://www.instagram.com/reel/${m[1]}/embed/` };
	}
	if (/(facebook\.com|fb\.watch)/.test(url)) {
		const reel = /\/reel\/|\/reels\/|fb\.watch/.test(url);
		const id = (url.match(/\/(?:reel|videos|watch\/?\?v=)\/?(\d+)/) || url.match(/[?&]v=(\d+)/) || [])[1] || url;
		return { kind: 'fb', id, url, vertical: reel, label: 'Facebook',
			src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true&mute=false${reel ? '&width=360&height=640' : ''}` };
	}
	return null;
}

/** Wiele linków wklejonych naraz (jeden pod drugim, albo po przecinku) → lista. */
export const splitLinks = (t = '') => String(t || '').split(/[\s,]+/).map((x) => x.trim()).filter((x) => /^https?:\/\//.test(x));
