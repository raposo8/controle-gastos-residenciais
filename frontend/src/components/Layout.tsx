import { Link, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <>
      <header>
        <nav className="main-nav">
          <Link to="/" className="nav-logo">
            CGR
          </Link>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/pessoas">Pessoas</Link></li>
            <li><Link to="/categorias">Categorias</Link></li>
            <li><Link to="/transacoes">Transações</Link></li>
            <li><Link to="/relatorios">Relatórios</Link></li>
          </ul>
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
