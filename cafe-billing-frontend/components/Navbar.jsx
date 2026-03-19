'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/',          label: 'Dashboard', icon: '◈' },
  { href: '/orders',    label: 'New Order',  icon: '✦' },
  { href: '/products',  label: 'Products',   icon: '◉' },
  { href: '/customers', label: 'Customers',  icon: '◎' },
  { href: '/invoices',  label: 'Invoices',   icon: '▣' },
  { href: '/reports',   label: 'Reports',    icon: '◌' },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">☕</span>
        <div>
          <h1 className="logo-title">BREW</h1>
          <p className="logo-sub">Billing System</p>
        </div>
      </div>
      <div className="sidebar-line" />
      <nav className="sidebar-nav">
        <span className="nav-section">Menu</span>
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${active ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {active && <span className="nav-indicator" />}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="status-dot" />
        <span>System Online</span>
      </div>
    </aside>
  );
}