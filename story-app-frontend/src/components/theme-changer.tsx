import { useEffect, useState } from 'react'

interface Theme {
  name: string
  icon: string
}

const themes: Theme[] = [
  { name: 'light', icon: '🌞' },
  { name: 'dark', icon: '🌚' },
  { name: 'night', icon: '🌙' }
]

export function ThemeChanger() {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('theme') || 'night'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function handleThemeChange(newTheme: string) {
    setTheme(newTheme)
  }

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn m-1">
        {themes.find(t => t.name === theme)?.icon} Tema
      </label>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        {themes.map((t) => (
          <li key={t.name}>
            <a onClick={() => handleThemeChange(t.name)}>
              {t.icon} {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}