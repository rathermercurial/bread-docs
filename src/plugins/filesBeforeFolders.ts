import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

type SidebarEntry = {
  type: 'link' | 'group';
  label: string;
  href?: string;
  isCurrent?: boolean;
  entries?: SidebarEntry[];
  collapsed?: boolean;
  badge?: unknown;
  attrs?: Record<string, unknown>;
};

function reorderSidebarEntries(entries: SidebarEntry[]): SidebarEntry[] {
  // Sort: links (files) first, then groups (folders)
  const sorted = [...entries].sort((a, b) => {
    if (a.type === 'link' && b.type === 'group') return -1;
    if (a.type === 'group' && b.type === 'link') return 1;
    return 0; // preserve relative order for same types
  });

  // Recursively process groups
  return sorted.map(entry => {
    if (entry.type === 'group' && entry.entries) {
      return {
        ...entry,
        entries: reorderSidebarEntries(entry.entries),
      };
    }
    return entry;
  });
}

export const onRequest = defineRouteMiddleware(async (context, next) => {
  // Wait for starlight-auto-sidebar and other middleware to finish first
  await next();
  // Then reorder the sidebar so files appear before folders
  const { sidebar } = context.locals.starlightRoute;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context.locals.starlightRoute.sidebar = reorderSidebarEntries(sidebar as any[]) as any;
});
