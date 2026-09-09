import useClinicStore from '../../../store/clinicStore.js'
export default function useExamination() { return useClinicStore((state) => ({ examinations: state.examinations, saveExamination: state.saveExamination })) }
