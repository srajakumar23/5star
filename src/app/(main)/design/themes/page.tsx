import Link from 'next/link'
import { Palette, TrendingUp, Award, Waves } from 'lucide-react'

export default function ThemeComparisonIndexPage() {
    const themes = [
        {
            id: 'blue-teal',
            name: 'Trusted Innovation',
            tagline: 'Blue + Teal Professional',
            description: 'Maximum parent trust with institutional credibility',
            gradient: 'from-blue-600 to-teal-500',
            icon: TrendingUp,
            strengths: ['Parent Trust', 'Multi-Institution', 'Timeless'],
            best: 'Recommended for enterprise expansion'
        },
        {
            id: 'purple-gold',
            name: 'Premium Quality',
            tagline: 'Purple + Gold Sophisticated',
            description: 'Academic prestige with premium positioning',
            gradient: 'from-purple-600 to-amber-500',
            icon: Award,
            strengths: ['Premium Feel', 'Academic', 'Distinct'],
            best: 'Best for quality-conscious parents'
        },
        {
            id: 'teal-coral',
            name: 'Modern Education',
            tagline: 'Teal + Coral Fresh',
            description: 'Innovation-focused with approachable warmth',
            gradient: 'from-teal-500 to-orange-500',
            icon: Waves,
            strengths: ['Modern', 'Approachable', 'Fresh'],
            best: 'Best for progressive institutions'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 ">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm mb-4">
                        <Palette size={16} className="text-purple-600" />
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Design Lab
                        </span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                        Theme Comparison
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Compare three professional themes designed for parent trust and multi-institution scalability
                    </p>
                </div>

                {/* Theme Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {themes.map((theme) => {
                        const Icon = theme.icon
                        return (
                            <Link
                                key={theme.id}
                                href={`/design/${theme.id}`}
                                className="group block"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:-translate-y-1">

                                    {/* Gradient Preview */}
                                    <div className={`h-24 bg-gradient-to-r ${theme.gradient} rounded-xl mb-6 flex items-center justify-center shadow-inner`}>
                                        <Icon size={40} className="text-white" strokeWidth={2} />
                                    </div>

                                    {/* Theme Info */}
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {theme.name}
                                    </h2>
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                                        {theme.tagline}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                        {theme.description}
                                    </p>

                                    {/* Strengths */}
                                    <div className="mb-6">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Key Strengths
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {theme.strengths.map((strength) => (
                                                <span key={strength} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                                                    {strength}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Best For */}
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-6">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            <span className="font-semibold">Best For:</span> {theme.best}
                                        </p>
                                    </div>

                                    {/* View Buttons */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className={`bg-gradient-to-r ${theme.gradient} text-white px-4 py-2.5 rounded-lg text-center font-bold text-sm group-hover:shadow-lg transition-shadow`}>
                                            Dashboard
                                        </div>
                                        <div className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg text-center font-bold text-sm">
                                            Analytics →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* Recommendation Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Senior Designer Recommendation</h3>
                            <p className="text-blue-100 mb-4 leading-relaxed">
                                Based on your target audience (parents) and growth strategy (multi-institution expansion),
                                <strong className="text-white"> Blue + Teal "Trusted Innovation"</strong> provides the optimal balance
                                of credibility, scalability, and modern appeal.
                            </p>
                            <Link
                                href="/design/blue-teal"
                                className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
                            >
                                View Recommended Theme
                                <TrendingUp size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Back to Current */}
                <div className="text-center mt-12">
                    <Link
                        href="/design/dashboard"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
                    >
                        ← Back to Current Design Lab
                    </Link>
                </div>

            </div>
        </div>
    )
}
