import Head from 'next/head';

export default function SEO() {
  return (
    <Head>
      <meta name="description" content="Instantly share notes and files with dr0p. No signups, no fuss." />
      <meta name="keywords" content="file sharing, note sharing, instant sharing, no sign-up, secure sharing, dr0p" />
      <meta property="og:title" content="dr0p.live | Instant Sharing, Zero Hassle" />
      <meta property="og:description" content="Share notes and files instantly between devices — no signups, no fuss." />
      <meta property="og:image" content="/public/logo.png" />
      <meta property="og:url" content="https://dr0p.live" />
      <link rel="canonical" href="https://dr0p.live" />
    </Head>
  );
}
