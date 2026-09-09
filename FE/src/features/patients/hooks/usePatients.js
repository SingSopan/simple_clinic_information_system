import useClinicStore from '../../../store/clinicStore.js'
export default function usePatients() 
{
    return useClinicStore((state) => 
    ({ 
    patients: state.patients, 
    addPatient: state.addPatient, 
    updatePatient: state.updatePatient, 
    removePatient: state.removePatient 
    }))
}
