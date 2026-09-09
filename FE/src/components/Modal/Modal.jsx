export default function Modal({ title, children, onClose, size = '' }) {
  return <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title} onMouseDown={onClose}><div className={`modal ${size}`} onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><h2 className="modal-title">{title}</h2><button className="modal-close" onClick={onClose} aria-label="Tutup">×</button></div>{children}</div></div>
}
