import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";

type SEOProps = {
  title: string;
  description: string;
};

export function SEO({ title, description }: SEOProps) {
  const [location] = useLocation();

  const canonical =
    location === "/"
      ? "https://brandingbeez.co.uk/"
      : `https://brandingbeez.co.uk${location}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="canonical" href={canonical} />

      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Helmet>
  );
}
