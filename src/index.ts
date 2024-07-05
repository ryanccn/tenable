const getOption = (name: string): string | null | undefined => {
	return document.currentScript?.getAttribute(`data-${name}`);
};

const endpoint = getOption('api') ?? 'https://plausible.io/api/event';
const domain = getOption('domain') ?? location.hostname;

const post = () => {
	void fetch(endpoint, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			domain,
			name: 'pageview',
			url: location.href,
			referrer: document.referrer,
		}),
		keepalive: true,
	});
};

post();

window.addEventListener('popstate', () => {
	setTimeout(() => {
		post();
	}, 0);
});

window.addEventListener('pageshow', (ev) => {
	if (ev.persisted) post();
});
