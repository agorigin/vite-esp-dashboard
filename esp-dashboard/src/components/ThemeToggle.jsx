export default function ThemeToggle({ dark, setDark }) {
    return (
      <div className="absolute top-4 right-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={dark}
            onChange={() => setDark(!dark)}
          />
          <span>🌙 Dark Mode</span>
        </label>
      </div>
    );
  }