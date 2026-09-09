export default function Pagination({ page, total, pageSize = 5, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  return <div className="pagination"><span className="pagination-info">Menampilkan {total ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, total)} dari {total} data</span><div className="pagination-controls"><button className="page-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>{Array.from({ length: pages }, (_, i) => <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => onChange(i + 1)}>{i + 1}</button>)}<button className="page-btn" disabled={page === pages} onClick={() => onChange(page + 1)}>›</button></div></div>
}
