import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Achariya Partnership Program',
        short_name: 'APP',
        description: 'Achariya Partnership Program (APP) Portal',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#DC2626', // Achariya Red
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
