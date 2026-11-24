import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
import { Home, ReportForm, MyReports, ReportDetail, Notifications } from './pages/CitizenPages';
import { AdminHome, AdminIssues, AdminReportDetail } from './pages/AdminPages';
import { useAuth } from './context/AuthContext';

export default function app(){
 const { user, loading } = useAuth();
 if(loading)return <div className="loading">Loading Civic Sync...</div>;
 return <Routes>
  <Route path="/" element={<Navigate to={user?(user.role==='admin'?'/admin':'/home'):'/login'} replace/>}/>
  <Route path="/login" element={<Auth/>}/><Route path="/register" element={<Auth register/>}/><Route path="/department-login" element={<Auth admin/>}/>
  <Route path="/home" element={<ProtectedRoute role="citizen"><Home/></ProtectedRoute>}/>
  <Route path="/report" element={<ProtectedRoute role="citizen"><ReportForm/></ProtectedRoute>}/>
  <Route path="/reports" element={<ProtectedRoute role="citizen"><MyReports/></ProtectedRoute>}/>
  <Route path="/reports/:id" element={<ProtectedRoute><ReportDetail/></ProtectedRoute>}/>
  <Route path="/notifications" element={<ProtectedRoute role="citizen"><Notifications/></ProtectedRoute>}/>
  <Route path="/admin" element={<ProtectedRoute role="admin"><AdminHome/></ProtectedRoute>}/>
  <Route path="/admin/issues" element={<ProtectedRoute role="admin"><AdminIssues/></ProtectedRoute>}/>
  <Route path="/admin/issues/:id" element={<ProtectedRoute role="admin"><AdminReportDetail/></ProtectedRoute>}/>
  <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes>;
}
