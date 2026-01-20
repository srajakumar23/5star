import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Achariya Partnership Program',
        short_name: 'APP',
        description: 'Join the Achariya Partnership Program (APP). Refer students, earn rewards, and be part of our 25th Year Celebration journey.',
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
