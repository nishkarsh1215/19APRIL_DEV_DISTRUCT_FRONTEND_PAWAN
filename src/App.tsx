import { useState, useEffect } from 'react'
import { SidebarProvider } from './components/ui/sidebar'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AppSidebar } from './features/Home/components'
import { useThemeStore } from './store'
import { HomePage, BlogDetailsPage } from './features/Home'
import { ChatPage } from './features/Chat'
import { AuthPage } from './features/Authentication'
import {
  ProtectedRoute,
  AuthRoute,
} from '@/features/Authentication/routes/protected-routes'
import {
  VerificationEmailSentPage,
  VerificationMessagePage,
} from '@/features/Authentication/pages'
import { Message, MessageContext } from './store/message.store'
import { FilesContext } from './store/file.store'
import Header from './features/Home/components/header.component'
import { useUser } from './hooks'

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  if (isMobile) {
    return (
      <div className="relative min-h-screen w-full">
        <Toaster />
        <main>{children}</main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 relative -ml-0.5 z-[100] border-l-[1.5px] border-l-slate-300 dark:border-l-gray-800/70">
        {children}
      </main>
      <Toaster />
    </div>
  )
}

function App() {
  const { darkMode } = useThemeStore()
  const { isAuthenticated } = useUser()
  console.log('isAuthenticated', isAuthenticated)
  const [messages, setMessages] = useState<Message | null>(null)
  const [files, setFiles] = useState(null)
  const [isFilesLoading, setIsFilesLoading] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <FilesContext.Provider
      value={{
        files: files,
        setFiles: setFiles,
        isFilesLoading: isFilesLoading,
        setIsFilesLoading: setIsFilesLoading,
      }}
    >
      <MessageContext.Provider
        value={{ message: messages, setMessage: setMessages }}
      >
        <SidebarProvider>
          {/* <CustomCursor
            dotSize={8}
            circleSize={40}
            dotColor="#ff0000"
            borderColor="#000000"
          /> */}
          <ResponsiveLayout>
            <div className="bg-white dark:bg-dim-black text-black dark:text-white min-h-screen">
              {!isAuthenticated ? <Header /> : null}
              <Routes>
                <Route path="/" element={<Outlet />}>
                  <Route index element={<HomePage />} />
                  <Route
                    path="chat/:chat_id"
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="blog/:blog_id" element={<BlogDetailsPage />} />
                  <Route
                    path="auth"
                    element={
                      <AuthRoute>
                        <Outlet />
                      </AuthRoute>
                    }
                  >
                    <Route index element={<AuthPage />} />
                    <Route
                      path="verification-sent"
                      element={<VerificationEmailSentPage />}
                    />
                    <Route
                      path="verify/:token"
                      element={<VerificationMessagePage />}
                    />
                  </Route>
                </Route>
              </Routes>
            </div>
          </ResponsiveLayout>
        </SidebarProvider>
      </MessageContext.Provider>
    </FilesContext.Provider>
  )
}

export default App
