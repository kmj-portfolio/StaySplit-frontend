import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[1400px] flex-col">
      <Header />
      <main className="flex-1 pb-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
