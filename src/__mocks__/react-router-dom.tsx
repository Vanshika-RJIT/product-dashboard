import React from 'react';

export const BrowserRouter = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const MemoryRouter = ({ children, initialEntries }: { children: React.ReactNode; initialEntries?: string[] }) => <div>{children}</div>;
export const Routes = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const Route = ({ element, path }: { element: React.ReactNode; path?: string }) => <div>{element}</div>;
export const Link = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
  <a href={to} className={className}>{children}</a>
);

export const useParams = () => ({ id: '1' });
export const useNavigate = () => jest.fn();
export const useLocation = () => ({ pathname: '/', search: '', hash: '', state: null });
