import { NavLink, useNavigate } from 'react-router-dom';
import { MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function Layout({ children, admin = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const leave = () => { logout(); navigate('/login'); };
  return <div className={admin ? 'admin-shell' : 'shell'}>
    <header className="topbar"><NavLink to={admin ? '/admin' : '/home'} className="brand"><MapPin size={21}/> Civic Sync</NavLink>
      <nav>{admin ? <><NavLink to="/admin">Overview</NavLink><NavLink to="/admin/issues">All issues</NavLink></> : <><NavLink to="/home">Home</NavLink><NavLink to="/report">Report issue</NavLink><NavLink to="/reports">My reports</NavLink><NavLink to="/notifications">Notifications</NavLink></>}</nav>
      <div className="user-area"><span>{user?.name}</span><button className="link-button" onClick={leave}><LogOut size={15}/> Log out</button></div>
    </header><main className="page-content">{children}</main>
  </div>;
}
