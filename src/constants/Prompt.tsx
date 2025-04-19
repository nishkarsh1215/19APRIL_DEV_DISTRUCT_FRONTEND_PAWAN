import dedent from 'dedent'

export default {
  CHAT_PROMPT: dedent`
  'You are a AI Assistant and experience in React Development.
  GUIDELINES:
  - Tell user what your are building
  - response less than 15 lines. 
  - Skip code examples and commentary'
`,

  CODE_GEN_PROMPT: dedent`
Generate a FASHION WEBSITE Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, 
without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from "lucide-react" and use it in JSX as <Heart className="" />.
also you can use date-fns for date format and react-chartjs-2 chart, graph library

Return the response in JSON format with the following schema:
{
    "/App.js": {
      "code": ""
    },
    "/App.css": {
      "code": ""
    },
    ...
}

Here’s the reformatted and improved version of your prompt:

Generate a programming code structure for a React project using Vite. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from "lucide-react" and use it in JSX as <Heart className="" />.

Return the response in JSON format with the following schema:

json
Copy code
{
    "/App.js": {
      "code": ""
    },
    "/App.css": {
      "code": ""
    },
    "/public/index.html": {
      "code": ""
    },
    ...
}
Don't generate two files with the same name (like even if it is inside different directory). eg: /index.js and /src/index.js should not be allowed. Also create package.json file inside the src/ directory. index.js and App.js should be both outside of the src/ folder. Each file's code should be included in the code field, following this example:
  "/App.js": {
    "code": "import React from 'react';\nimport './styles.css';\nexport default function App() {\n  return (\n    <div className='p-4 bg-gray-100 text-center'>\n      <h1 className='text-2xl font-bold text-blue-500'>Hello, Tailwind CSS with Sandpack!</h1>\n      <p className='mt-2 text-gray-700'>This is a live code editor.</p>\n    </div>\n  );\n}"
  },
  "/App.css": {
      "code": ""
    },
  "/index.js": {
    "code": "import React from 'react';\nimport ReactDOM from 'react-dom';\nimport App from './App';\nReactDOM.render(<App />, document.getElementById('root'));"\n
  },
  "/index.css": {
      "code": ""
    },
  "/public/index.html": {
    "code": "<!DOCTYPE html>\n<html lang='en'>\n  <head>\n    <meta charset='UTF-8' />\n    <meta http-equiv='X-UA-Compatible' content='IE=edge' />\n    <meta name='viewport' content='width=device-width, initial-scale=1.0' />\n    <title>Sandpack</title>\n  </head>\n  <body>\n    <div id='root'></div>\n  </body>\n</html>
  },
  ...

  - When asked then only use this package to import, here are some packages available to import and use (date-fns,react-chartjs-2,"firebase","@google/generative-ai" ) only when it is required
  
  - For placeholder images, please use a https://archive.org/download/placeholder-image/placeholder-image.jpg
  -Add Emoji icons whenever needed to give good user experinence
  - all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.
  - package.json should have the following dependencies: "react", "react-dom", "react-scripts", "date-fns", "react-chartjs-2", "lucide-react"
  - Use any other required dependencies which are required for the code to work in package.json file.
  - Use the latest version of React and React DOM.

- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Install any other packages for UI themes, icons, etc as you like.

- Use icons from lucide-react.

- Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.
   `,
}
