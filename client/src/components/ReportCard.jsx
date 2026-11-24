import { Link } from 'react-router-dom';
import { imageUrl } from '../api';
export default function ReportCard({ report }) {
  return <Link className="report-row" to={`/reports/${report._id}`}>
    {report.photos?.[0] ? <img className="thumb" src={imageUrl(report.photos[0])} alt="Issue"/> : <div className="thumb placeholder">No photo</div>}
    <div className="report-main"><strong>{report.title}</strong><small>{report.category} · {report.ward || report.address}</small></div>
    <span className="report-date">{new Date(report.createdAt).toLocaleDateString()}</span><span className={`status ${report.status.toLowerCase().replace(' ', '-')}`}>{report.status}</span>
  </Link>;
}
