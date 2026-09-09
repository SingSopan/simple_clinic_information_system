import useClinicStore from '../../../store/clinicStore.js'
export default function useRegistrations() { return useClinicStore((state) => ({ visits: state.visits, addVisit: state.addVisit })) }
