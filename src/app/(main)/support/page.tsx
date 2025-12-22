'use client'

import { useState } from 'react'
import { MessageSquare, Plus, Clock, CheckCircle2, AlertCircle, Send } from 'lucide-react'

export default function SupportPage() {
    const [showNewTicket, setShowNewTicket] = useState(false)
    const [tickets] = useState([]) // Placeholder for real tickets

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary-red">Support Desk</h1>
                    <p className="text-text-secondary">We're here to help you with any questions or issues</p>
                </div>
                <button
                    onClick={() => setShowNewTicket(true)}
                    className="btn btn-primary !w-auto !py-2 !px-4 flex gap-2"
                >
                    <Plus size={18} /> New Ticket
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card text-center py-6">
                    <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3 text-blue-600">
                        <Clock size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Open</p>
                    <p className="text-3xl font-extrabold text-gray-900 mt-1">0</p>
                </div>
                <div className="card text-center py-6">
                    <div className="p-3 bg-amber-100 rounded-full w-fit mx-auto mb-3 text-amber-600">
                        <AlertCircle size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">In-Progress</p>
                    <p className="text-3xl font-extrabold text-gray-900 mt-1">0</p>
                </div>
                <div className="card text-center py-6">
                    <div className="p-3 bg-emerald-100 rounded-full w-fit mx-auto mb-3 text-emerald-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Resolved</p>
                    <p className="text-3xl font-extrabold text-gray-900 mt-1">0</p>
                </div>
            </div>

            <div className="card">
                <div className="flex items-center justify-between mb-6 border-b border-border-color pb-4">
                    <h2 className="font-bold text-lg">Your Tickets</h2>
                    <div className="text-xs text-text-secondary">Showing last 30 days</div>
                </div>

                {tickets.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-border-color text-gray-300">
                            <MessageSquare size={32} />
                        </div>
                        <h3 className="font-bold text-gray-900">No active tickets</h3>
                        <p className="text-sm text-text-secondary mt-1">If you have a question, click 'New Ticket' above.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Tickets would be mapped here */}
                    </div>
                )}
            </div>

            {showNewTicket && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in overflow-hidden">
                        <div className="bg-primary-red p-6 text-white">
                            <h2 className="text-xl font-bold">Raise Support Ticket</h2>
                            <p className="text-white/80 text-sm">Tell us what's on your mind</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="label">Category</label>
                                <select className="input">
                                    <option>Technical Issue</option>
                                    <option>Benefit Discrepancy</option>
                                    <option>Referral Not Showing</option>
                                    <option>Profile Update Request</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Subject</label>
                                <input type="text" className="input" placeholder="Quick summary of your issue" />
                            </div>
                            <div>
                                <label className="label">Message</label>
                                <textarea className="input min-h-[120px]" placeholder="Provide details here..."></textarea>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowNewTicket(false)}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button className="btn btn-primary flex gap-2">
                                    <Send size={18} /> Submit Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
