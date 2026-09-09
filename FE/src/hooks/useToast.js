import { useCallback, useState } from 'react'
export default function useToast() 
{ 
  const [toast, setToast] = useState(null);
   const showToast = useCallback((message, type = 'success') => 
   { setToast({ message, type }); 
   setTimeout(() => setToast(null), 3000) 
   }, []); 
  return { toast, showToast, clearToast: () => setToast(null) } 
}
