import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary yakaladı:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>Bir Hata Oluştu</h2>
          <p style={{ color: '#d90429', fontWeight: 'bold' }}>
            {this.state.error ? this.state.error.toString() : 'Bilinmeyen Hata'}
          </p>
          {this.state.errorInfo && (
            <pre style={{ textAlign: 'left', background: '#f1f5f9', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.8rem', maxWidth: '800px', margin: '1rem auto' }}>
              {this.state.errorInfo.componentStack}
            </pre>
          )}
          <button 
            onClick={() => window.location.href = '/'}
            style={{ padding: '0.6rem 1.2rem', background: '#d90429', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '1rem' }}
          >
            Sayfayı Yenile
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
