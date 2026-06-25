import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', background: '#0d1117',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24, fontFamily: 'monospace',
        }}>
          <div style={{
            maxWidth: 700, width: '100%',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 16, padding: '32px',
          }}>
            <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#f87171' }}>
              RUNTIME ERROR
            </p>
            <p style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>
              {this.state.error.message}
            </p>
            <pre style={{
              margin: 0, fontSize: 11, color: '#64748b',
              whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              maxHeight: 300, overflowY: 'auto',
            }}>
              {this.state.error.stack}
            </pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
