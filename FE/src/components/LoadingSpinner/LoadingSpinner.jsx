export default function LoadingSpinner({ text = 'Memuat data...' }) {
  return <div className="spinner-page"><span className="spinner spinner-lg" />{text}</div>
}
