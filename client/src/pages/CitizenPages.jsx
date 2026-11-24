import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, ArrowRight, MapPin } from 'lucide-react';
import api, { imageUrl } from '../api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import ReportCard from '../components/ReportCard';

export function Home() {
  const { user } = useAuth(); const [reports, setReports] = useState([]);
  useEffect(() => { api.get('/reports/mine').then(r => setReports(r.data.reports)).catch(console.error); }, []);
  const count = status => reports.filter(r => r.status === status).length;
  return <Layout><div className="eyebrow">CITIZEN WORKSPACE</div><h1>Good to see you, {user?.name?.split(' ')[0]}.</h1><p className="muted">A small report can make a big difference to your neighbourhood.</p>
    <div className="stats-grid"><Stat label="Total reports" value={reports.length} note="Reports submitted by you"/><Stat label="Pending" value={count('Received')} note="Awaiting or undergoing review"/><Stat label="Resolved" value={count('Resolved')} note="Thank you for speaking up"/></div>
    <section className="cta"><div><h2>See something that needs fixing?</h2><p>Report a pothole, waste, broken light or another local issue.</p></div><Link className="button white-button" to="/report"><Plus size={16}/> Report an issue</Link></section>
    <div className="section-heading"><h3>Recent reports</h3><Link to="/reports">View all reports <ArrowRight size={14}/></Link></div>
    <div className="panel report-list">{reports.slice(0,4).length ? reports.slice(0,4).map(r => <ReportCard key={r._id} report={r}/>) : <Empty text="You have not submitted any reports yet."/>}</div>
  </Layout>;
}
function Stat({ label, value, note }) { return <div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>; }
function Empty({ text }) { return <div className="empty">{text}</div>; }

export function ReportForm() {
  const [form, setForm] = useState({ title:'', description:'', category:'', address:'', ward:'' });
  const [photos, setPhotos] = useState([]); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) { e.preventDefault(); setError(''); setBusy(true); const data = new FormData(); Object.entries(form).forEach(([k,v]) => data.append(k,v)); [...photos].forEach(file => data.append('photos',file));
    try { const res = await api.post('/reports', data); window.location.href = `/reports/${res.data.report._id}`; } catch(err) { setError(err.response?.data?.message || 'Could not submit report.'); } finally { setBusy(false); }
  }
  return <Layout><div className="eyebrow">CITIZEN WORKSPACE / NEW REPORT</div><h1>Report an issue</h1><p className="muted">Tell us what’s wrong. We’ll help get it to the right department.</p>
    <form onSubmit={submit} className="form-grid"><section className="panel form-panel"><h3>01 &nbsp; Issue details</h3><label>Title<input name="title" value={form.title} onChange={update} required placeholder="Briefly describe the issue"/></label><label>Description<textarea name="description" value={form.description} onChange={update} required rows="5" placeholder="Explain what happened and why it needs attention"/></label><label>Category<select name="category" value={form.category} onChange={update} required><option value="">Select a category</option>{['Pothole','Garbage','Streetlight','Water','Drainage','Footpath','Other'].map(x=><option key={x}>{x}</option>)}</select></label><label className="upload-box">＋<strong>Click to upload or drag photos</strong><small>Up to 3 images · JPG, PNG or WEBP · 5 MB each</small><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>setPhotos(Array.from(e.target.files).slice(0,3))}/></label>{photos.length>0 && <small>{photos.map(p=>p.name).join(', ')}</small>}</section>
      <section className="panel form-panel"><h3>02 &nbsp; Location</h3><label>Landmark / address<input name="address" value={form.address} onChange={update} required placeholder="Enter street, area or landmark"/></label><label>Ward (optional)<input name="ward" value={form.ward} onChange={update} placeholder="Ward number or name"/></label><div className="map-placeholder"><MapPin size={32}/><span>LOCATION</span><small>Enter the address or landmark above</small></div><p className="hint">Please provide an accurate location so the department can find the issue.</p></section>
      <div className="form-footer">{error && <p className="error">{error}</p>}<button className="primary" disabled={busy}>{busy?'Submitting...':'Submit report →'}</button><small>Civic Sync is a student prototype. Reports are not sent to a real authority.</small></div>
    </form></Layout>;
}

export function MyReports() {
  const [reports,setReports] = useState([]); const [error,setError] = useState('');
  useEffect(()=>{api.get('/reports/mine').then(r=>setReports(r.data.reports)).catch(e=>setError(e.response?.data?.message||'Could not load reports.'));},[]);
  return <Layout><div className="eyebrow">YOUR NEIGHBOURHOOD, YOUR VOICE</div><h1>My reports</h1><p className="muted">Only reports submitted by you appear here.</p><div className="section-heading"><span className="muted">{reports.length} reports · Newest first</span><Link className="primary small-button" to="/report"><Plus size={15}/> Report an issue</Link></div><div className="panel report-list">{error?<p className="error">{error}</p>:reports.length?reports.map(r=><ReportCard key={r._id} report={r}/>):<Empty text="No reports yet. Submit your first report to get started."/>}</div></Layout>;
}

export function ReportDetail() {
  const { id } = useParams(); const [report,setReport] = useState(null); const [error,setError] = useState('');
  useEffect(()=>{api.get(`/reports/${id}`).then(r=>setReport(r.data.report)).catch(e=>setError(e.response?.data?.message||'Could not load report.'));},[id]);
  if(error)return <Layout><p className="error">{error}</p></Layout>; if(!report)return <div className="loading">Loading report...</div>;
  return <Layout><Link to="/reports" className="back-link">← My reports</Link><div className="detail-title"><div><div className="eyebrow">REPORT / {report._id.slice(-7).toUpperCase()}</div><h1>{report.title}</h1><p className="muted">{report.category} · {report.address}</p></div><span className={`status ${report.status.toLowerCase().replace(' ','-')}`}>{report.status}</span></div>
    <div className="detail-grid"><div><section className="panel detail-panel"><h3>Reported photo</h3>{report.photos?.length? <div className="photo-grid">{report.photos.map(p=><img key={p} src={imageUrl(p)} alt="Reported issue"/>)}</div>:<div className="empty">No photos attached.</div>}<h3>Description</h3><p>{report.description}</p><small className="muted">Submitted {new Date(report.createdAt).toLocaleString()}</small></section><section className="panel detail-panel"><h3>Location</h3><div className="map-placeholder"><MapPin size={32}/><strong>{report.address}</strong><small>{report.ward || 'Ward not provided'}</small></div></section></div>
    <aside><section className="panel detail-panel"><h3>Status timeline</h3>{report.timeline?.map((item,i)=><div className="timeline-item" key={i}><span className="timeline-dot">✓</span><div><strong>{item.status}</strong><small>{new Date(item.changedAt).toLocaleString()}</small>{item.note&&<p>{item.note}</p>}</div></div>)}</section>{report.completionPhoto&&<section className="panel detail-panel"><h3>After photo</h3><img className="wide-photo" src={imageUrl(report.completionPhoto)} alt="Completed work"/></section>}<section className="panel detail-panel"><h3>What happens next?</h3><p className="muted">Department updates will appear here and in your notifications.</p></section></aside></div>
  </Layout>;
}

export function Notifications() {
  const [items,setItems] = useState([]); const [error,setError] = useState('');
  useEffect(()=>{api.get('/notifications').then(r=>setItems(r.data.notifications)).catch(e=>setError(e.response?.data?.message||'Could not load notifications.'));},[]);
  async function markRead(id){try{await api.patch(`/notifications/${id}/read`);setItems(items.map(n=>n._id===id?{...n,read:true}:n));}catch{}}
  return <Layout><div className="eyebrow">STAY IN THE LOOP</div><h1>Notifications</h1><p className="muted">Every update brings your city a little closer to better.</p><div className="section-heading"><span className="muted">{items.filter(x=>!x.read).length} unread messages</span><span className="muted">Newest first</span></div><div className="panel notification-list">{error?<p className="error">{error}</p>:items.length?items.map(n=><div className={`notification ${n.read?'read':''}`} key={n._id}><span className="notification-dot"/><div><strong>{n.message}</strong><small>{new Date(n.createdAt).toLocaleString()}</small>{n.report&&<Link to={`/reports/${n.report._id}`}>Open report →</Link>}</div>{!n.read&&<button className="link-button" onClick={()=>markRead(n._id)}>Mark read</button>}</div>):<Empty text="No notifications yet. Updates will appear here."/>}</div></Layout>;
}
