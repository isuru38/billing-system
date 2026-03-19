import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Brew — Café Billing',
  description: 'Luxury Café Billing & Management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}