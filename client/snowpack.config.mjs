import proxy from 'http2-proxy';

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    // '@snowpack/plugin-webpack',
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    [
      '@snowpack/plugin-typescript',
      {
        // Yarn PnP workaround: see https:www.npmjs.com/package/@snowpack/plugin-typescript
        ...(process.versions.pnp ? { tsc: 'yarn pnpify tsc' } : {}),
      },
    ],
  ],
  routes: [
    {
      src: '/api/.*',
      dest: (req, res) => {
        return proxy.web(req, res, {
          hostname: 'localhost',
          port: 8000,
        });
      },
    },
    /* Enable an SPA Fallback in development: */
    { match: 'routes', src: '.*', dest: '/index.html' },
  ],
  optimize: {
    /* Example: Bundle your final build: */
    "minify": true,
    // "target": "es2017",
    "splitting": true,
    "treeshake": true,
    "manifest": true,
  },
  packageOptions: {
    // source: 'remote',
    // types: true,
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
