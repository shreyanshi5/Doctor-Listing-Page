import React from 'react';
import DoctorCard from './DoctorCard';
import './DoctorList.css';

function DoctorList({ doctors }) {
  console.log('DoctorList render - Received doctors:', {
    count: doctors?.length,
    isArray: Array.isArray(doctors),
    type: typeof doctors,
    sampleDoctor: doctors?.[0]
  });

  // Validate doctors data
  if (!Array.isArray(doctors)) {
    console.error('Doctors data is not an array:', doctors);
    return <div className="error" data-testid="error-message">Invalid data format</div>;
  }

  if (!doctors.length) {
    console.log('No doctors to display');
    return (
      <div className="no-results" data-testid="no-results">
        No doctors found matching your criteria
      </div>
    );
  }

  // Filter out invalid doctor objects with detailed logging
  const validDoctors = doctors.filter(doctor => {
    if (!doctor || typeof doctor !== 'object') {
      console.warn('Invalid doctor entry:', doctor);
      return false;
    }

    const isValid = doctor.name && 
      (Array.isArray(doctor.specialties) || !doctor.specialties) &&
      (Array.isArray(doctor.consultationType) || !doctor.consultationType);

    if (!isValid) {
      console.warn('Invalid doctor object:', {
        hasName: !!doctor.name,
        specialtiesValid: Array.isArray(doctor.specialties) || !doctor.specialties,
        consultationTypeValid: Array.isArray(doctor.consultationType) || !doctor.consultationType,
        doctor: doctor
      });
    }
    return isValid;
  });

  console.log('Filtering results:', {
    totalDoctors: doctors.length,
    validDoctors: validDoctors.length,
    invalidDoctors: doctors.length - validDoctors.length
  });

  if (!validDoctors.length) {
    return (
      <div className="no-results" data-testid="no-valid-doctors">
        No valid doctors found in the data
      </div>
    );
  }

  return (
    <div className="doctor-list" data-testid="doctor-list">
      {validDoctors.map((doctor, index) => {
        console.log(`Rendering doctor ${index + 1}/${validDoctors.length}:`, {
          name: doctor.name,
          id: doctor.id,
          specialties: doctor.specialties?.length,
          consultationTypes: doctor.consultationType?.length
        });
        return (
          <DoctorCard 
            key={doctor.id || index} 
            doctor={doctor}
            data-testid={`doctor-card-${index}`}
          />
        );
      })}
    </div>
  );
}

export default DoctorList; 