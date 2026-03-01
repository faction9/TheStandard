import './globals.css';
import Link from 'next/link';
import StandardLogo from '@/components/StandardLogo';

// SEO metadata aligned with https://login.standard.com/ — no JSON-LD / graph data
export const metadata = {
  title: 'Login | The Standard',
  description: 'Log in to The Standard to access your insurance account, benefits, and services. The Standard is a marketing name for StanCorp Financial Group, Inc. and The Standard Life Insurance Company of New York.',
  keywords: ['The Standard', 'login', 'insurance', 'StanCorp', 'account', 'benefits', 'group insurance', 'disability', 'life insurance', 'member login'],
  authors: [{ name: 'The Standard', url: 'https://www.standard.com' }],
  creator: 'The Standard',
  publisher: 'The Standard',
  applicationName: 'The Standard',
  metadataBase: new URL('https://login.standard.com'),
  alternates: {
    canonical: 'https://login.standard.com/',
  },
  openGraph: {
    title: 'Login | The Standard',
    description: 'Log in to The Standard to access your insurance account, benefits, and services.',
    url: 'https://login.standard.com/',
    siteName: 'The Standard',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Login | The Standard',
    description: 'Log in to The Standard to access your insurance account, benefits, and services.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
  referrer: 'origin-when-cross-origin',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#005daa',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <header className="header">
            <div className="header-content">
              <Link href="/" className="header-logo-link" aria-label="Go to homepage">
                <StandardLogo />
              </Link>
              <a href="#" className="help-link">
                <span className="help-icon">?</span>
                Help
              </a>
            </div>
          </header>
          <main className="main-content">
            {children}
          </main>
          <footer className="footer">
            <div className="footer-content">
              <p className="footer-text">
                The Standard is a marketing name for StanCorp Financial Group, Inc. (Portland, Oregon) licensed in all states except New York, and The Standard Life Insurance Company of New York (White Plains, New York) licensed only in New York. Products are underwritten and issued by state and also vary. For more information, see the applicable insurance contract.
              </p>
              <p className="footer-text">
                © {new Date().getFullYear()} StanCorp Financial Group, Inc.
              </p>
              <div className="footer-links">
                <a href="#" className="footer-link">Data & Identity Protection</a>
                <a href="#" className="footer-link">Privacy & Legal</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
