import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './shared/ErrorBoundary.jsx'

const rootEl = document.getElementById('root')
if (!rootEl) {
  const msg = 'Root element #root not found — cannot mount React.'
  console.error(msg)
  document.body.innerHTML = '<pre style="color:red">' + msg + '</pre>'
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  )
}