import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// #region agent log
fetch('http://127.0.0.1:7242/ingest/9e8b917d-6254-43be-83b6-79fe8568963b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:8',message:'Entry point execution started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

const rootElement = document.getElementById('root');

// #region agent log
fetch('http://127.0.0.1:7242/ingest/9e8b917d-6254-43be-83b6-79fe8568963b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:12',message:'Root element check',data:{rootElementExists:!!rootElement,rootElementId:rootElement?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion

if (!rootElement) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9e8b917d-6254-43be-83b6-79fe8568963b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:16',message:'ERROR: Root element not found',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  throw new Error('Root element not found');
}

try {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9e8b917d-6254-43be-83b6-79fe8568963b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:22',message:'Creating React root',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  const root = createRoot(rootElement);
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9e8b917d-6254-43be-83b6-79fe8568963b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:26',message:'React root created, rendering App',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9e8b917d-6254-43be-83b6-79fe8568963b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:33',message:'App render initiated successfully',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
} catch (error) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9e8b917d-6254-43be-83b6-79fe8568963b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:36',message:'ERROR in main.tsx',data:{errorMessage:error instanceof Error?error.message:String(error),errorStack:error instanceof Error?error.stack:undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  throw error;
}
