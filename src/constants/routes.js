const ROUTES = {
  LANDING: '/',
  HOME: '/home',
  ACCOUNT: '/account',
  GAME: '/game',
  JOIN_GAME: '/joinGame',
  ADMIN: '/admin',
};

export const ROUTE_LOCATIONS = Object.keys(ROUTES).map(route => ROUTES[route]);

export default ROUTES;
