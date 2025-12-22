'use client'

import { Database, Download, Upload, FileText, Share2 } from 'lucide-react'

export default function MarketingPage() {
    const resources = [
        { cat: 'Branding', items: ['Official Logo Pack', 'Brand Guidelines', 'Email Signatures'] },
        { cat: 'WhatsApp Templates', items: ['Welcome Message', 'Follow-up Template', 'Benefit Explanation'] },
        { cat: 'Social Media', items: ['Instagram Stories', 'Facebook Posts', 'LinkedIn Banners'] },
        { cat: 'Instruction PDFs', items: ['How to Refer', 'Benefit Calculation', 'Program Rules'] }
    ]

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary-red">Marketing Kit</h1>
                    <p className="text-text-secondary">Resources to help you share Achariya with your network</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((res) => (
                    <div key={res.cat} className="card hover:shadow-lg transition-all border-l-4 border-l-primary-red">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary-red/10 rounded-lg text-primary-red">
                                <Database size={20} />
                            </div>
                            <h2 className="font-bold text-lg">{res.cat}</h2>
                        </div>

                        <div className="space-y-3">
                            {res.items.map(item => (
                                <div key={item} className="flex items-center justify-between p-2 hover:bg-deep rounded border border-transparent hover:border-border-color transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <FileText size={16} className="text-gray-400" />
                                        <span className="text-sm">{item}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-1 hover:text-primary-red transition-colors opacity-0 group-hover:opacity-100">
                                            <Share2 size={16} />
                                        </button>
                                        <button className="p-1 hover:text-primary-red transition-colors opacity-0 group-hover:opacity-100">
                                            <Download size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {res.items.length === 0 && (
                            <p className="text-xs text-center py-4 text-gray-400 italic">No resources available in this category yet.</p>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 card bg-primary-red/5 border-dashed border-primary-red/30 text-center py-8">
                <Upload size={32} className="mx-auto mb-3 text-primary-red/50" />
                <h3 className="font-bold mb-1">Have custom resource requests?</h3>
                <p className="text-sm text-text-secondary">If you need specific posters or templates, let our support team know!</p>
            </div>
        </div>
    )
}
