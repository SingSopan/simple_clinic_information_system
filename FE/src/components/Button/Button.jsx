export default function Button({ className = 'btn btn-primary', type = 'button', children, ...props }) {
  return <button type={type} className={className} {...props}>{children}</button>
}
