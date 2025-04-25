import React, { useState } from 'react';
import './Filters.css';

function Filters({ 
  filters, 
  onFilterChange,
  filterOptions = {
    specialties: [],
    consultationTypes: [],
    sortOptions: []
  }
}) {
  // State for section collapse
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    filters: true,
    specialties: true,
    consultation: true
  });

  // State for specialty search
  const [searchQuery, setSearchQuery] = useState('');

  const handleSortChange = (sortBy) => {
    onFilterChange({ sortBy });
  };

  const handleSpecialtyChange = (specialty) => {
    const updatedSpecialties = filters.specialties.includes(specialty)
      ? filters.specialties.filter(s => s !== specialty)
      : [...filters.specialties, specialty];
    
    onFilterChange({ specialties: updatedSpecialties });
  };

  const handleConsultationTypeChange = (type) => {
    onFilterChange({ consultationType: type });
  };

  const clearAllFilters = () => {
    onFilterChange({
      specialties: [],
      consultationType: '',
      sortBy: ''
    });
    setSearchQuery('');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter specialties based on search query
  const filteredSpecialties = filterOptions.specialties.filter(specialty =>
    specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="filters-container">
      {/* Sort Section */}
      {filterOptions.sortOptions.length > 0 && (
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('sort')}>
            <h3 data-testid="filter-header-sort">Sort by</h3>
            <span className={`expand-icon ${expandedSections.sort ? 'expanded' : ''}`}>▼</span>
          </div>
          {expandedSections.sort && (
            <div className="filter-options">
              {filterOptions.sortOptions.map(option => (
                <label key={option.value} className="radio-label">
                  <input
                    type="radio"
                    name="sort"
                    checked={filters.sortBy === option.value}
                    onChange={() => handleSortChange(option.value)}
                    data-testid={`sort-${option.value}`}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filters Section */}
      <div className="filter-section">
        <div className="filter-header">
          <h3>Filters</h3>
          <button className="clear-all" onClick={clearAllFilters}>Clear All</button>
        </div>
      </div>

      {/* Specialties Section */}
      {filterOptions.specialties.length > 0 && (
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('specialties')}>
            <h3 data-testid="filter-header-speciality">Specialities</h3>
            <span className={`expand-icon ${expandedSections.specialties ? 'expanded' : ''}`}>▼</span>
          </div>
          {expandedSections.specialties && (
            <>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search specialities"
                  className="specialty-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
              <div className="filter-options">
                {filteredSpecialties.map((specialty) => (
                  <label key={specialty} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.specialties.includes(specialty)}
                      onChange={() => handleSpecialtyChange(specialty)}
                      data-testid={`filter-specialty-${specialty.replace(/\s+/g, '-')}`}
                    />
                    <span>{specialty}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Mode of Consultation */}
      {filterOptions.consultationTypes.length > 0 && (
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleSection('consultation')}>
            <h3 data-testid="filter-header-moc">Mode of consultation</h3>
            <span className={`expand-icon ${expandedSections.consultation ? 'expanded' : ''}`}>▼</span>
          </div>
          {expandedSections.consultation && (
            <div className="filter-options">
              {filterOptions.consultationTypes.map(type => (
                <label key={type.value} className="radio-label">
                  <input
                    type="radio"
                    name="consultation"
                    checked={filters.consultationType === type.value}
                    onChange={() => handleConsultationTypeChange(type.value)}
                    data-testid={`filter-${type.value}`}
                  />
                  <span>{type.label}</span>
                </label>
              ))}
              <label className="radio-label">
                <input
                  type="radio"
                  name="consultation"
                  checked={filters.consultationType === ''}
                  onChange={() => handleConsultationTypeChange('')}
                />
                <span>All</span>
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Filters; 