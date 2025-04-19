export const initialFiles: Record<string, string> = {
  "/src/App.js": `import React from 'react';
  
  export function App() {
    return (
      <div className="App">
        <h1>Hello React.</h1>
        <h2>Start editing to see some magic happen!</h2>
      </div>
    );
  }`,
  "/src/index.js": `import React from 'react';
  import ReactDOM from 'react-dom/client';
  import { App } from './App';
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );`,
  "/public/index.html": `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>React App</title>
  </head>
  <body>
      <div id="root"></div>
  </body>
  </html>`,
  "/package.json": `{
    "name": "react-playground",
    "version": "1.0.0",
    "description": "A React playground",
    "main": "src/index.js",
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    }
  }`
};
