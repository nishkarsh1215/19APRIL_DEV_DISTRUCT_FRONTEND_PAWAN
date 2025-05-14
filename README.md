# Project Overview

This is a React/TypeScript project integrated with a backend service. It includes:
- Authentication/Authorization with protected routes
- A code collaboration interface using Sandpack
- Chat-based AI interactions

## Folder Structure

- **src/features**  
  Houses app-specific features like Chat, Authentication, and Home pages.
- **src/components**  
  Shared UI elements (buttons, sheets, etc.).
- **src/store**  
  State management contexts and providers.
- **src/utils**  
  Helper functions such as auth checks.

## Navigation

- **Home**  
  The default landing page with an overview or login prompts.
- **Chat**  
  Enhanced code editor with AI chat capabilities. Protected route for authenticated users, but allows limited interactions for unauthenticated.
- **Authentication**  
  Login, signup, and verification flows.

## Getting Started

1. **Install dependencies**  
   Run:
   ```
   npm install
   ```
   or:
   ```
   yarn
   ```
2. **Start the project**  
   ```
   npm start
   ```
3. **Authentication**  
   - Authenticated routes are check-protected at runtime.
   - Unauthenticated users have limited chat usage.

## Contributing

- Create feature branches for changes.
- Submit pull requests for merging.

For more details, check each feature’s code under **src/features**.


<div className="w-full max-w-3xl mx-auto px-4 mb-4 border border-gray-700 rounded-lg">
        <input
          type="text"
          placeholder="Devdistruct, use this image to create something amazing!"
          className="p-3 pb-1.5 w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0"
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          value={input}
          disabled={isLoading}
        />
        <div className="h-[52px] w-full p-3 flex justify-between">
          <span />
          <Button
            disabled={!isActive || isLoading}
            className="size-7 p-0"
            onClick={handleSend}
          >
            <ArrowUp />
          </Button>
        </div>
      </div>