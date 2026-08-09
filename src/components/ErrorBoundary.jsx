// src/components/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback" style={{
          padding: '2rem',
          margin: '1.5rem 0',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '12px',
          color: '#fff',
          textAlign: 'center',
        }}>
          <AlertTriangle size={32} style={{ color: '#f43f5e', marginBottom: '0.5rem' }} />
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: '#f43f5e' }}>
            Component Render Notice
          </h4>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '1rem' }}>
            An isolated UI error occurred while rendering this section.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: '#f43f5e',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <RotateCcw size={16} /> Reload Section
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
