# Tenable

An alternative, smaller script and associated proxy for [Plausible Analytics](https://plausible.io/).

## Getting started

An official hosted instance is not and will not be provided, since it will most likely be swiftly blocked.

To build your own script, simply clone this repository, install the dependencies, and run the `build` script. The resulting script will be in `dist/script.js`. Host it somewhere.

Then, include the usual HTML snippet in your website:

```html
<script async defer src="https://tenable.example.com/script.js"></script>
```

To configure the script to use a different event API endpoint or a different domain, set the `data-api` and `data-domain` attributes on the script element. This behavior largely replicates the upstream script, except for the fact that `data-domain` defaults to the hostname of the current page.

### Cloudflare Worker

Other than providing a rewritten script, this project also includes a [Cloudflare Worker](https://workers.cloudflare.com/) that provides a proxy to work around domain blocks of the Plausible event API. Set up a Cloudflare account and run `wrangler deploy` in this project to deploy.

When using the script from the Cloudflare Worker, the default API endpoint is changed from `plausible.io` to the domain that the script is being hosted on automatically. You do not need to set the `data-api` attribute manually.

## Improvements

- Uses the modern [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) instead of the synchronous and outdated [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) API
- [Back/forward cache](https://web.dev/bfcache) navigation support (currently the official script underreports due to cached navigations)
- Provides a default value for `data-domain` so that for the simplest setup zero configuration is required
- Includes a better matcher for local loopback addresses to exclude
- Does not try to detect headless browsers (because it is a futile endeavor without advanced behavioral detection)
- Removed `localStorage` flag support (Plausible's [primary recommendation](https://plausible.io/docs/excluding) has changed to using an ad-blocker)

## Script extensions

Tenable supports none of the [ten official script extensions](https://plausible.io/docs/script-extensions#all-our-script-extensions) at the moment, but that may change in the future.

## License

AGPL 3.0
