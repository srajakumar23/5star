
'use client'

import { useState } from 'react'
import { testSmsAction } from './actions'

export default function TestSmsPage() {
    const [mobile, setMobile] = useState('')
    const [logs, setLogs] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const runTest = async () => {
        setLoading(true)
        setLogs('Running test...')
        try {
            const res = await testSmsAction(mobile)
            setLogs(res)
        } catch (e: any) {
            setLogs({ error: e.message })
        }
        setLoading(false)
    }

    return (
        <div className="p-10 bg-black min-h-screen text-white font-mono">
            <h1 className="text-2xl font-bold mb-5">MSG91 Diagnostics</h1>

            <div className="flex gap-4 mb-8">
                <input
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="Enter Mobile (e.g. 9339330096)"
                    className="bg-gray-900 border border-gray-700 p-2 rounded w-64 text-white"
                />
                <button
                    onClick={runTest}
                    disabled={loading}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send Test OTP'}
                </button>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-4 rounded overflow-auto whitespace-pre-wrap">
                {typeof logs === 'string' ? logs : JSON.stringify(logs, null, 2)}
            </div>

            <p className="mt-4 text-gray-500 text-sm">
                If 'type' is 'success' but no SMS arrives, the DLT Template Content is mismatched.
            </p>
        </div>
    )
}
