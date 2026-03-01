import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import CategorySelectionPage from './pages/CategorySelectionPage';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import AppLayout from './components/aura/AppLayout';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CategorySelectionPage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  component: ResultsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, searchRoute, resultsRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
