
import { Helmet } from 'react-helmet-async';

interface MetadataProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
}

export function Metadata({ title, description, keywords, canonical }: MetadataProps) {
  const siteTitle = `${title} | Real Estate Investment Analysis`;
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
