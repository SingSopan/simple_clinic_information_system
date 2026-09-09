export default function Table({ columns, rows, emptyMessage = 'Belum ada data.' }) {
  return <div className="table-wrapper"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.length ? rows : <tr><td colSpan={columns.length} className="text-center text-muted">{emptyMessage}</td></tr>}</tbody></table></div>
}
