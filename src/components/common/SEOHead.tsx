import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeoForPath, BASE_APP_URL, PageSeoMetadata } from '../../lib/seoConfig';

interface SEOHeadProps {
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  customTitle,
  customDescription,
  customKeywords,
  canonicalUrl,
  ogImage,
  structuredData,
}) => {
  const location = useLocation();
  const config: PageSeoMetadata = getSeoForPath(location.pathname);

  const title = customTitle || config.title;
  const description = customDescription || config.description;
  const keywords = (customKeywords || config.keywords || []).join(', ');
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : BASE_APP_URL;
  const canonical = canonicalUrl || `${currentOrigin}${config.canonicalPath}`;
  const image = ogImage || `${currentOrigin}/logo.png`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to update or create meta tags
    const setMetaTag = (nameOrProperty: string, key: 'name' | 'property', content: string) => {
      let element = document.querySelector(`meta[${key}="${nameOrProperty}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(key, nameOrProperty);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Primary Meta Tags
    setMetaTag('title', 'name', title);
    setMetaTag('description', 'name', description);
    if (keywords) {
      setMetaTag('keywords', 'name', keywords);
    }

    // 3. OpenGraph Tags
    setMetaTag('og:title', 'property', title);
    setMetaTag('og:description', 'property', description);
    setMetaTag('og:url', 'property', canonical);
    setMetaTag('og:image', 'property', image);
    setMetaTag('og:type', 'property', config.ogType || 'website');

    // 4. Twitter Cards
    setMetaTag('twitter:title', 'name', title);
    setMetaTag('twitter:description', 'name', description);
    setMetaTag('twitter:url', 'name', canonical);
    setMetaTag('twitter:image', 'name', image);
    setMetaTag('twitter:card', 'name', 'summary_large_image');

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // 6. Schema.org JSON-LD
    const jsonLdData = structuredData || config.structuredData || {
      '@context': 'https://schema.org',
      '@type': config.schemaType || 'WebApplication',
      'name': title,
      'description': description,
      'url': canonical,
    };

    let scriptTag = document.querySelector('#page-schema-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('id', 'page-schema-jsonld');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLdData);

  }, [title, description, keywords, canonical, image, structuredData, config]);

  return null;
};
