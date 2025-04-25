import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Component imports
import SearchBar from './components/SearchBar/SearchBar';
import Filters from './components/Filters/Filters';
import DoctorList from './components/DoctorList/DoctorList';

// Initial filter options configuration
const initialFilterOptions = {
  specialties: [
    'General Physician',
    'Dentist',
    'Dermatologist',
    'Paediatrician',
    'Gynaecologist',
    'ENT',
    'Diabetologist',
    'Cardiologist',
    'Physiotherapist',
    'Endocrinologist',
    'Orthopaedic',
    'Ophthalmologist',
    'Gastroenterologist',
    'Pulmonologist',
    'Psychiatrist',
    'Urologist',
    'Dietitian-Nutritionist',
    'Psychologist',
    'Sexologist',
    'Nephrologist',
    'Neurologist',
    'Oncologist',
    'Ayurveda',
    'Homeopath'
  ],
  consultationTypes: [
    { value: 'video', label: 'Video Consultation' },
    { value: 'clinic', label: 'In-clinic Consultation' }
  ],
  sortOptions: [
    { value: 'fees', label: 'Price: Low-High' },
    { value: 'experience', label: 'Experience- Most Experience first' }
  ]
};

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);
  const [filters, setFilters] = useState({
    consultationType: '',
    specialties: [],
    sortBy: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch doctors data from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(API_URL);
        
        // Log the raw API response
        console.log('Raw API response:', response.data);

        let doctorsData = response.data;
        if (response.data.doctors) {
          doctorsData = response.data.doctors;
        }

        if (Array.isArray(doctorsData)) {
          // Map the API data to match our expected format
          const formattedDoctors = doctorsData.map(doctor => ({
            id: doctor.id,
            name: doctor.name,
            specialties: doctor.specialities?.map(s => s.name) || [],
            consultationType: [
              ...(doctor.video_consult ? ['video'] : []),
              ...(doctor.in_clinic ? ['clinic'] : [])
            ],
            experience: doctor.experience?.replace(' Years of experience', '') || '0',
            fees: doctor.fees || 'N/A',
            image: doctor.photo || 'https://via.placeholder.com/150',
            introduction: doctor.doctor_introduction || '',
            languages: doctor.languages || [],
            clinic: doctor.clinic || {}
          }));

          console.log('Formatted doctors data:', formattedDoctors);
          setDoctors(formattedDoctors);
          setFilteredDoctors(formattedDoctors);

          // Update filter options based on available data
          const availableSpecialties = [...new Set(
            formattedDoctors.flatMap(doctor => 
              doctor.specialties
            )
          )].filter(Boolean);

          setFilterOptions(prev => ({
            ...prev,
            specialties: availableSpecialties
          }));
        } else {
          console.error('Invalid data structure:', doctorsData);
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err.message || 'Failed to fetch doctors data');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Load filters from URL params on initial load
  useEffect(() => {
    const urlConsultationType = searchParams.get('type') || '';
    const urlSpecialties = searchParams.get('specialties')?.split(',').filter(Boolean) || [];
    const urlSortBy = searchParams.get('sort') || '';
    const urlSearch = searchParams.get('search') || '';

    setFilters({
      consultationType: urlConsultationType,
      specialties: urlSpecialties,
      sortBy: urlSortBy
    });
    setSearchQuery(urlSearch);
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.consultationType) params.set('type', filters.consultationType);
    if (filters.specialties.length) params.set('specialties', filters.specialties.join(','));
    if (filters.sortBy) params.set('sort', filters.sortBy);
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params);
  }, [filters, searchQuery, setSearchParams]);

  // Apply filters and search
  useEffect(() => {
    if (!doctors.length) return;

    console.log('Filtering doctors...');
    console.log('Current filters:', filters);
    console.log('Current search query:', searchQuery);

    let result = [...doctors];

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      result = result.filter(doctor => 
        doctor?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply consultation type filter
    if (filters.consultationType) {
      result = result.filter(doctor => 
        Array.isArray(doctor?.consultationType) && 
        doctor.consultationType.includes(filters.consultationType)
      );
    }

    // Apply specialty filters
    if (filters.specialties.length > 0) {
      result = result.filter(doctor =>
        Array.isArray(doctor?.specialties) &&
        filters.specialties.some(specialty => 
          doctor.specialties.includes(specialty)
        )
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        if (filters.sortBy === 'fees') {
          // Convert fees string to number by removing currency symbol and parsing
          const getFeeValue = (fee) => {
            if (!fee) return 0;
            const numericFee = parseInt(fee.replace(/[₹,\s]/g, ''), 10);
            return isNaN(numericFee) ? 0 : numericFee;
          };
          return getFeeValue(a.fees) - getFeeValue(b.fees);
        }
        if (filters.sortBy === 'experience') {
          // Convert experience to number for sorting
          const getExperienceValue = (exp) => {
            if (!exp) return 0;
            const numericExp = parseInt(exp.toString().replace(/[^0-9]/g, ''), 10);
            return isNaN(numericExp) ? 0 : numericExp;
          };
          return getExperienceValue(b.experience) - getExperienceValue(a.experience);
        }
        return 0;
      });
    }

    console.log('Filtered doctors count:', result.length);
    setFilteredDoctors(result);
  }, [doctors, filters, searchQuery]);

  const handleFilterChange = (newFilters) => {
    console.log('Filter changed:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (query) => {
    console.log('Search query changed:', query);
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading doctors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <SearchBar 
          onSearch={handleSearch}
          doctors={doctors}
          data-testid="autocomplete-input"
        />
      </header>
      <main>
        <aside>
          <Filters 
            filters={filters}
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
          />
        </aside>
        <section>
          <DoctorList doctors={filteredDoctors} />
        </section>
      </main>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
