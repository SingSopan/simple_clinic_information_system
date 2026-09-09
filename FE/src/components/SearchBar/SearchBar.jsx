export default function SearchBar({ value, onChange, placeholder = 'Cari data...' }) { 
    return <input className="search-input" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /> 
}
