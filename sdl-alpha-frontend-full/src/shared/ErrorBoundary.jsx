import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    console.error('App crashed:', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 24 }}>
          <h1 style={{ color: '#b00020' }}>Something went wrong.</h1>
          <pre style={{ background: '#f6f6f6', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
{String(this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}