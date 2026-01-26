import * as helmetPkg from "react-helmet-async";

// Cross-environment adapter: supports ESM (client build) and CJS (Node SSR runtime)
const anyPkg = helmetPkg as any;

export const Helmet: any = anyPkg.Helmet ?? anyPkg.default?.Helmet;
export const HelmetProvider: any =
  anyPkg.HelmetProvider ?? anyPkg.default?.HelmetProvider;
