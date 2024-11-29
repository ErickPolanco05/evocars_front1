import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import './RentalCalendar.css';

const RentalCalendar = ({ autoId, onDatesSelected }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/autos/${autoId}/disponibilidad`);
        const dates = response.data.map(period => ({
          start: new Date(period.fecha_inicio),
          end: new Date(period.fecha_fin)
        }));
        setUnavailableDates(dates);
      } catch (error) {
        console.error('Error fetching unavailable dates:', error);
      }
    };

    fetchUnavailableDates();
  }, [autoId]);

  const handleDateChange = async (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      try {
        const response = await axios.post('http://localhost:8080/api/rentals/check-availability', {
          autoId,
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0]
        });

        if (response.data.available) {
          onDatesSelected(start, end);
        } else {
          alert('Las fechas seleccionadas no están disponibles');
          setStartDate(null);
          setEndDate(null);
        }
      } catch (error) {
        console.error('Error checking availability:', error);
      }
    }
  };

  const isDateUnavailable = (date) => {
    return unavailableDates.some(period => 
      date >= period.start && date <= period.end
    );
  };

  return (
    <div className="rental-calendar">
      <h3>Selecciona las fechas de tu renta</h3>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        minDate={new Date()}
        excludeDates={unavailableDates.map(period => period.start)}
        filterDate={date => !isDateUnavailable(date)}
        monthsShown={2}
      />
    </div>
  );
};
export default RentalCalendar;
