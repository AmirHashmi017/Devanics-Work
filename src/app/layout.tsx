import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import { ReduxProvider } from '@/redux/provider';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Providers } from './(pages)/providers';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Script from 'next/script';
// import 'react-quill/dist/quill.snow.css';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'Schesti Technologies',
  description: 'Schesti App',
};

console.log('=========');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Schesti',
    url: 'https://schesti.com',
    logo: 'https://schesti.com/logo/logo.svg',
    description:
      'Schesti is the first web app offering all construction services, including Bid Management, Estimates, Quantity Takeoff, Schedule, Financials, Meetings, CRM, Contracts, Networking, Social Media, and Daily Work Management.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1 (888-958-5771)',
      email: 'info@schesti.com',
      contactType: 'Customer Service',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ste 102 Raleigh',
      addressLocality: '5109 Hollyridge Dr',
      addressRegion: 'NC',
      postalCode: '27612',
      addressCountry: 'US',
    },
    sameAs: [
      'https://x.com/schestitech?s=21',
      'https://www.facebook.com/people/Schesti-Technologies/61563918897388/?mibextid=kFxxJD&rdid=DE1M3ERYzkc3fefQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F65Z2ZQLrnZSKh4Eb%2F%3Fmibextid%3DkFxxJD',
      'https://www.instagram.com/schesti.technologies/?igsh=MW5zOGRqZW0xMWFhMg%3D%3D',
      'https://www.linkedin.com/posts/schesti_schesti-constructionmanagement-projectmanagement-activity-7240798897957150720-G07_/',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '254',
    },
    review: [
      {
        '@type': 'Review',
        author: 'Jane Doe',
        datePublished: '2024-12-10',
        reviewBody:
          'Schesti has completely transformed how we manage our construction projects. The tools are intuitive and comprehensive!',
        name: 'Excellent construction management tool',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
        },
      },
      {
        '@type': 'Review',
        author: 'John Smith',
        datePublished: '2024-12-12',
        reviewBody:
          'The networking and CRM features are a game-changer. Highly recommend!',
        name: 'Great app for construction professionals',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '4.5',
        },
      },
    ],
  };
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta
          name="facebook-domain-verification"
          content="3anl33uf9b811uhegjpylavtfmqn1w"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta
          name="description"
          content="Schesti Technologies offers all-in-one construction management software, from Bid Management to Financials, helping maximize ROI and complete projects on time and within budget."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100&family=Open+Sans:wght@300;400;500;600;700;800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="icon" href="/images/Favicon.ico?v=4" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className={`${inter.className} bg-white`}>
        <GoogleOAuthProvider
          clientId={String(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)}
        >
          <ReduxProvider>
            <ToastContainer />
            <Providers>{children}</Providers>
          </ReduxProvider>
        </GoogleOAuthProvider>
      </body>
      <Script id="fb-pixel-subscribe" strategy="afterInteractive">
        {`
    fbq('track', 'Subscribe');
  `}

        {`
    <script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1829798617757398');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1829798617757398&ev=PageView&noscript=1"
/></noscript>
  
  `}
      </Script>
    </html>
  );
}
