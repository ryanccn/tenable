declare const TENABLE_SCRIPT: string;
const handleScript = async (req: Request) => {
	if (!TENABLE_SCRIPT) {
		return new Response(JSON.stringify({ error: 'Script not defined in worker' }), {
			status: 500,
			headers: { 'content-type': 'text/javascript; charset=utf-8' },
		});
	}

	const r = crypto.randomUUID().replaceAll('-', '').slice(0, 8);

	const patchedScript =
		`/* ${r} */ ` +
		TENABLE_SCRIPT.replaceAll(
			'https://plausible.io/api/event',
			new URL('/api/event', req.url).toString(),
		);

	return new Response(patchedScript, {
		headers: {
			'content-type': 'text/javascript; charset=utf-8',
			'cache-control': 'max-age=3600, stale-while-revalidate=86400',
		},
	});
};

const handleApi = async (req: Request) => {
	if (req.method !== 'POST') return new Response(null, { status: 405 });

	let data: unknown;
	try {
		data = await req.json();
	} catch {
		return new Response(null, { status: 400 });
	}

	const headers = req.headers;

	const userAgentH = headers.get('user-agent');
	const xForwardedForH = headers.get('x-forwarded-for');

	const upstreamResp = await fetch('https://plausible.io/api/event', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'content-type': 'application/json',
			...(userAgentH ? { 'user-agent': userAgentH } : {}),
			...(xForwardedForH ? { 'x-forwarded-for': xForwardedForH } : {}),
		},
	});

	return new Response(null, {
		status: upstreamResp.status,
	});
};

export default {
	async fetch(req: Request) {
		const { pathname } = new URL(req.url);

		if (pathname.endsWith('/script.js')) return handleScript(req);
		else if (pathname.endsWith('/api/event')) return handleApi(req);

		return new Response(null, { status: 404 });
	},
};
