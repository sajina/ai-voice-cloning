import React, { useState } from 'react';
import axios from 'axios';

const CorsTest = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkCors = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Using the VITE_API_URL if available, otherwise defaulting to localhost/railway
            const baseUrl = import.meta.env.VITE_API_URL || 'https://voicegen.up.railway.app';
            const url = `${baseUrl}/api/auth/debug-cors/`;
            
            console.log(`Testing CORS against: ${url}`);
            
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
                // Important: This tells browser to send credentials (cookies)
                withCredentials: true 
            });

            setResult(response.data);
        } catch (err) {
            console.error("CORS Test Error:", err);
            setError({
                message: err.message,
                code: err.code,
                response: err.response ? {
                    status: err.response.status,
                    data: err.response.data,
                    headers: err.response.headers
                } : 'No response received'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
            <h2>CORS & CSRF Diagnostic Tool</h2>
            
            <button 
                onClick={checkCors}
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'wait' : 'pointer'
                }}
            >
                {loading ? 'Testing...' : 'Test Connectivity'}
            </button>

            {error && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '4px' }}>
                    <h3 style={{ color: '#d32f2f', marginTop: 0 }}>Connection Failed</h3>
                    <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                        {JSON.stringify(error, null, 2)}
                    </pre>
                </div>
            )}

            {result && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '4px' }}>
                    <h3 style={{ color: '#388e3c', marginTop: 0 }}>Connection Successful!</h3>
                    <p><strong>Backend Configuration:</strong></p>
                    <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto', backgroundColor: '#f1f8e9', padding: '10px' }}>
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default CorsTest;
