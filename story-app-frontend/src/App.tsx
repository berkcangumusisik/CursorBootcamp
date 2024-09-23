import React from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import ThemeSelector from './components/ThemeSelector'
import StoryListingPage from './components/StoryListingPage'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-base-200">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">Hikaye Dünyası</a>
          </div>
          <div className="flex-none">
            <ThemeSelector />
          </div>
        </div>
        <StoryListingPage />
      </div>
    </ThemeProvider>
  )
}

export default App
