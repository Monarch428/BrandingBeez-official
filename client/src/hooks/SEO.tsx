import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";

type SEOProps = {
  title: string;
  description: string;
};

export function SEO({ title, description }: SEOProps) {
  const [location] = useLocation();

  const cleanPath = location.split("?")[0].split("#")[0];

  const canonical =
    cleanPath === "/"
      ? "https://brandingbeez.co.uk/"
      : `https://brandingbeez.co.uk${cleanPath}`;

  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />

      <link rel="canonical" href={canonical} />

      <meta property="og:url" content={canonical} />
      <meta name="twitter:url" content={canonical} />

      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Helmet>
  );
}
