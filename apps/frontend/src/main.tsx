import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {ClerkProvider} from "@clerk/react";
import './index.css'
import App from './App.tsx'

// import dotenv from 'dotenv'
//
// dotenv.config()

// Import your Publishable Key
const PUBLISHABLE_KEY = "pk_test_ZGV2b3RlZC1iYWRnZXItNzEuY2xlcmsuYWNjb3VudHMuZGV2JA"

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
    </ClerkProvider>
  </StrictMode>,
)
