import { useTheme } from '../contexts/ThemeContext'

const themes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave",
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua",
  "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk",
  "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"
]

function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn m-1">
        {theme.charAt(0).toUpperCase() + theme.slice(1)} Teması
      </label>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-96 overflow-y-auto">
        {themes.map((t) => (
          <li key={t}>
            <button
              className={`w-full text-left ${theme === t ? 'active' : ''}`}
              onClick={() => setTheme(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ThemeSelector