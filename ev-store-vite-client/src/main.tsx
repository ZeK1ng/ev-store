import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from '@/components/ui/provider'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Fragment>
    <Provider>
      <I18nextProvider i18n={i18n}>
        <App/>
      </I18nextProvider>
    </Provider>
  </React.Fragment>
)

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(_registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}
