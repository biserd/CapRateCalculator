
import { Helmet } from 'react-helmet-async';

interface MetadataProps {
  title: string;
  description: string;
  keywords?: string;
}

export function Metadata({ title, description, keywords }: MetadataProps) {
  return (
    <Helmet>
      <title>{title} | Real Estate Cap Rate Calculator</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
    </Helmet>
  );
}
