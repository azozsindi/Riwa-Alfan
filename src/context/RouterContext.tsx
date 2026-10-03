import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  isAdmin: boolean;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
  isAdmin: false
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getCurrentRoute = () => {
    if (typeof window === 'undefined') return '/';
    const p = window.location.pathname.toLowerCase();
    const h = window.location.hash.toLowerCase();
    if (p.includes('/admin') || h.includes('admin')) {
      return '/admin';
    }
    return '/';
  };

  const [path, setPath] = useState<string>(getCurrentRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(getCurrentRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (to: string) => {
    const target = to.toLowerCase().includes('admin') ? '/admin' : '/';
    try {
      window.history.pushState({}, '', target);
    } catch {
      window.location.hash = target.startsWith('/') ? `#${target}` : `#/${target}`;
    }
    setPath(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = path === '/admin';

  return (
    <RouterContext.Provider value={{ path, navigate, isAdmin }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);
