import type { StarlightPlugin } from '@astrojs/starlight/types';

export default function starlightFilesBeforeFolders(): StarlightPlugin {
  return {
    name: 'starlight-files-before-folders',
    hooks: {
      'config:setup'({ addRouteMiddleware }) {
        addRouteMiddleware({
          entrypoint: './src/plugins/filesBeforeFolders.ts',
        });
      },
    },
  };
}
