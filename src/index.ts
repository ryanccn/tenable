const getOption = (name: string): string | null => {
	return document.currentScript?.getAttribute(`data-${name}`) ?? null;
};

const post = () => {
	if (document.readyState === 'complete') {
		if (
			/^localhost$|^127(?:\.\d+){1,3}$|^(?:0*:)*?:?0*1$/.test(location.hostname) ||
			'file:' === location.protocol
		) {
			return;
		}

		const endpoint = getOption('api') ?? 'https://plausible.io/api/event';
		const domain = getOption('domain') ?? location.hostname;

		const url = location.href;
		const referrer = document.referrer;

		fetch(endpoint, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ domain, name: 'pageview', url, referrer }),
		});
	} else {
		const handler = () => {
			if (document.readyState === 'complete') {
				post();
				document.removeEventListener('readystatechange', handler);
			}
		};

		document.addEventListener('readystatechange', handler);
	}
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
