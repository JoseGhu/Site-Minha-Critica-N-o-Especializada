import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Minha Crítica Não Especializada - Críticas Sinceras de Cinema e Séries",
  description = "Opiniões sinceras sobre cinema e séries, sem frescura. Análises detalhadas, críticas honestas e recomendações de filmes e séries.",
  canonical = "",
  ogImage = "/images/logo-minha-critica.png",
  ogType = "website",
  keywords = "críticas, cinema, séries, filmes, análise, review, entretenimento"
}) => {
  const siteTitle = "Minha Crítica Não Especializada";
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  
  return (
    <Helmet>
      {/* Meta Tags Básicas */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Robots */}
      <meta name="robots" content="index, follow" />

      {/* Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": siteTitle,
          "description": description,
          "url": canonical || window.location.origin,
          "publisher": {
            "@type": "Organization",
            "name": siteTitle,
            "logo": {
              "@type": "ImageObject",
              "url": ogImage
            }
          },
          "inLanguage": "pt-BR"
        })}
      </script>
    </Helmet>
  );
};

export default SEO;