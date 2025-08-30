import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: '/',
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: '/contact-us',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/why-schesti',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/estimate',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/contract',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/services',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/takeoff',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/crm',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/financial-tools',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/meetings',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/bidding',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/time-scheduling',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/Network',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/socialmedia',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/pricing-page',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/resources',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/apis',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/faqs',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/help-center',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/terms',
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: '/cookies-policy',
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: '/privacy',
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: '/blogs',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
