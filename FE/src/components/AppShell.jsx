import Sidebar from './Sidebar/Sidebar.jsx'
import Navbar from './Navbar/Navbar.jsx'

export default function AppShell({ children }) {
  return <div className="app-layout"><Sidebar /><section className="app-content"><Navbar /><main className="app-main">{children}</main></section></div>
}
