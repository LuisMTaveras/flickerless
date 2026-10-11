// Los paquetes construidos cargan en Node (SSR de Nuxt / Next, Vitest): imports con .js y "type": "module".
const core = await import('@flickerless/core'); console.log('core', Object.keys(core).join(','));
const { createSSRApp, h } = await import('vue'); const { renderToString } = await import('vue/server-renderer');
const V = await import('@flickerless/vue');
console.log('vue ssr', await renderToString(createSSRApp({ render: () => h(V.FlickerlessSurface, { loading: false }, { default: () => h(V.FlickerlessValue, { value: null }) }) })));
const React = await import('react'); const { renderToString: r } = await import('react-dom/server'); const R = await import('@flickerless/react');
console.log('react ssr', r(React.createElement(R.FlickerlessSurface, { loading: false }, React.createElement(R.FlickerlessValue, { value: 5 }))));
