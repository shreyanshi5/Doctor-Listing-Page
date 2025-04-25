import React from 'react';
import './DoctorCard.css';

function DoctorCard({ doctor }) {
  // Early validation
  if (!doctor || typeof doctor !== 'object') {
    console.error('Invalid doctor prop:', doctor);
    return null;
  }

  const {
    name,
    specialties = [],
    experience,
    fees,
    image
  } = doctor;

  // Format fees to ensure only one ₹ symbol
  const formatFees = (feeString) => {
    if (!feeString) return '';
    // Remove existing ₹ symbol and trim whitespace
    const cleanFee = feeString.replace('₹', '').trim();
    return `₹ ${cleanFee}`;
  };

  const handleBookAppointment = () => {
    // TODO: Implement appointment booking logic
    console.log(`Booking appointment with Dr. ${name}`);
  };

  return (
    <div className="doctor-card" data-testid="doctor-card">
      <div className="doctor-image">
        <img 
          src={image} 
          alt={`Dr. ${name}`}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150';
          }}
        />
      </div>
      
      <div className="doctor-info">
        <h3 data-testid="doctor-name">{name}</h3>
        
        <div className="doctor-details">
          <div data-testid="doctor-specialty" className="specialties">
            {specialties.join(', ')}
          </div>

          <div data-testid="doctor-experience" className="experience">
            {experience} Years Experience
          </div>

          <div data-testid="doctor-fee" className="fees">
            Consultation Fee: {formatFees(fees)}
          </div>

          <button 
            className="book-appointment-btn"
            onClick={handleBookAppointment}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorCard; 