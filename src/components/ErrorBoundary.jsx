import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FEF2F2', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h1 style={{ color: '#EF4444', fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong.</h1>
                    <p style={{ color: '#374151', marginBottom: '2rem' }}>The application encountered an unexpected error.</p>
                    <div style={{ textAlign: 'left', backgroundColor: '#F3F4F6', padding: '1rem', borderRadius: '8px', overflow: 'auto', maxWidth: '80%', maxHeight: '300px', marginBottom: '2rem', border: '1px solid #E5E7EB' }}>
                        <p style={{ color: '#DC2626', fontWeight: 'bold' }}>{this.state.error && this.state.error.toString()}</p>
                        <pre style={{ fontSize: '0.75rem', color: '#4B5563' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            sessionStorage.clear();
                            window.location.href = '/';
                        }}
                        style={{ padding: '0.75rem 1.5rem', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Clear Cache & Restart
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
