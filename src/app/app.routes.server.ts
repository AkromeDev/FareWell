import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Private staff task pages: parameterized, noindex, localStorage-driven —
  // render client-side only, never prerender.
  {
    path: 'tasks/:user',
    renderMode: RenderMode.Client,
  },
  {
    path: 'massage-tasks/:user',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
