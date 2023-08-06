import Footer from '@/components/Footer';
import Loader from '@/components/Loading/Loader';
import { Container, Typography } from '@mui/material';
import { lazy, Suspense } from 'react';
import HomeIntro from './home/HomeIntro';

const Gallery = lazy(() => import('@/app/home/Gallery'));

export default function Home() {
  return (
    <div>
      <Container>
        <HomeIntro />
        <div style={{ paddingBottom: '24px' }}>
          <Typography variant="h3" sx={{ marginTop: 3, marginBottom: 3, textAlign: 'center' }}>
            Chart Library
          </Typography>
          <Suspense fallback={<Loader />}>
            <Gallery />
          </Suspense>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
