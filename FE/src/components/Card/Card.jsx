export default function Card({ title, action, children, className = '' }) {
  return <section className={`card ${className}`}>{title && <div className="card-header"><h2>{title}</h2>{action}</div>}{children}</section>
}
