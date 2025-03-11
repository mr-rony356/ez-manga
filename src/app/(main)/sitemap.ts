import { Website_URL } from '@global'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${Website_URL}`,
            lastModified: new Date(),
        },
        {
            url: `${Website_URL}/comics`,
            lastModified: new Date(),
        },
        {
            url: `${Website_URL}/novels`,
            lastModified: new Date(),
        },
    ]
}