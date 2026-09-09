import useClinicStore from '../../../store/clinicStore.js'
export default function useQueue() {
  return useClinicStore((state) => ({
    visits: state.visits,
    callNext: state.callNext,
    updateVisitStatus: state.updateVisitStatus
  }))
}
