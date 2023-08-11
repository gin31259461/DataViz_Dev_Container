import { CommandModal } from '@/components/Modal/CommandModal';
import Navbar from '@/components/Navbar';
import { Provider } from '../components/Provider';
import { TrpcProvider } from '../components/Provider/TrpcProvider';
import style from '../styles/rootLayout.module.scss';
import '@/styles/global.scss';
import { Session } from 'next-auth';

export const metadata = {
  title: 'DataViz',
  description: 'Analyze data and generate beautiful infographic',
  icons: {
    icon: '/favicon.ico',
  },
  // 'og:title':
  // 'og:image':
  // 'og:description':
};

export default function RootLayout({
  children,

  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <html lang="en" className={style['custom-font']}>
      <body className="scrollbar-container">
        <TrpcProvider>
          <Provider session={session}>
            <div>
              <Navbar />
              <CommandModal />
              {children}
            </div>
          </Provider>
        </TrpcProvider>
      </body>
    </html>
  );
}
