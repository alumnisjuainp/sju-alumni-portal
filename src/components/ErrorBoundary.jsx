import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasFault: false, faultInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasFault: true };
  }

  componentDidCatch(caughtError, faultInfo) {
    console.error("🔥 UI THREAD CRASH INTERCEPTED:", caughtError, faultInfo);
    this.setState({ faultInfo });
  }

  render() {
    if (this.state.hasFault) {
      return (
        <div style={{ padding: '80px', textAlign: 'center', fontFamily: '"Lora", serif', color: '#0C2340', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px', color: '#EF4444' }}>System Exception Intercepted</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.8' }}>A critical render fault occurred. The error boundary has isolated the component tree to prevent a full application crash.</p>
          <button onClick={() => window.location.href = '/'} style={{ marginTop: '32px', padding: '16px 32px', backgroundColor: '#0C2340', color: '#D4AF37', border: 'none', borderRadius: '999px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: '0 4px 14px rgba(6, 14, 26, 0.2)' }}>Return to Home</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
