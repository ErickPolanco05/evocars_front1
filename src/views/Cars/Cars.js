import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cars.css';

function Cars() {
  const [cars, setCars] = useState([]);
  const [colors, setColors] = useState([]); // Estado para los colores
  const [searchTerm, setSearchTerm] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [cilindrosFilter, setCilindrosFilter] = useState('');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('https://evocars-cristian-ps-projects.vercel.app/api/autos');
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError('Error al cargar los autos, por favor intenta de nuevo más tarde.');
      }
    };

    const fetchColors = async () => {
      try {
        const response = await axios.get('https://evocars-cristian-ps-projects.vercel.app/api/colors/');
        setColors(response.data); // Suponiendo que la respuesta es un array de colores
      } catch (error) {
        console.error('Error fetching colors:', error);
        setError('Error al cargar los colores, por favor intenta de nuevo más tarde.');
      }
    };

    fetchCars();
    fetchColors(); // Llamar a la función para obtener los colores
  }, []);

  const handleBuy = async (carId) => {
    // Lógica de compra...
  };

  const handleCarClick = (carId) => {
    navigate(`/carros/${carId}`);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const filteredCars = useMemo(() => {
    const filtered = cars.filter(car =>
      car.modelo.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (colorFilter === '' || car.color.toLowerCase() === colorFilter.toLowerCase()) &&
      (cilindrosFilter === '' || car.cilindros === cilindrosFilter)
    );

    // Ordena los autos para que los que tienen descuento aparezcan primero
    return filtered.sort((a, b) => {
      const precioDiarioA = parseFloat(a.precio_diario);
      const precioDiarioB = parseFloat(b.precio_diario);
      const precioConOfertaA = parseFloat(a.precio_con_oferta) || precioDiarioA;
      const precioConOfertaB = parseFloat(b.precio_con_oferta) || precioDiarioB;

      const tieneDescuentoA = precioConOfertaA < precioDiarioA;
      const tieneDescuentoB = precioConOfertaB < precioDiarioB;

      // Si ambos o ninguno tienen descuento, no cambia el orden
      if (tieneDescuentoA === tieneDescuentoB) {
        return 0;
      }

      // Coloca los autos con descuento primero
      return tieneDescuentoA ? -1 : 1;
    });
  }, [cars, searchTerm, colorFilter, cilindrosFilter]);

  return (
    <section className="cars-app">
      {/* Mensaje de error */}
      {error && <p className="error-message">{error}</p>}

      {/* Buscador */}
      <section className="search-container">
        <input
          type="text"
          placeholder="Buscar por modelo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Buscar por modelo de carro"
        />
        
        {/* Botón para abrir el menú de filtros */}
        <button onClick={toggleFilterMenu} className="filter-button" aria-haspopup="true">
          Filtros
        </button>
        
        {/* Menú desplegable para filtros */}
        {isFilterMenuOpen && (
          <div className="filter-menu">
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="filter-select"
              aria-label="Filtrar por color"
            >
              <option value="">Todos los colores</option>
              {colors.map(color => (
                <option key={color.id_color} value={color.descripcion.toLowerCase()}>
                  {color.descripcion.charAt(0).toUpperCase() + color.descripcion.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={cilindrosFilter}
              onChange={(e) => setCilindrosFilter(e.target.value)}
              className="filter-select"
              aria-label="Filtrar por cilindros"
            >
              <option value="">Todos los cilindros</option>
              <option value="4">4 cilindros</option>
              <option value="6">6 cilindros</option>
              <option value="8">8 cilindros</option>
            </select>
          </div>
        )}
      </section>

      <section className="cars-content">
        <div className="cars-container">
          {filteredCars.map(car => {
            const precioDiario = parseFloat(car.precio_diario);
            const valorDescuento = parseFloat(car.valor_descuento) || 0; // Asegura que sea un número
            const precioConOferta = parseFloat(car.precio_con_oferta) || precioDiario; // Si no hay precio con oferta, usa el precio diario

            const precioConDescuento = precioDiario - (precioDiario * (valorDescuento / 100));
            const tieneDescuento = precioConOferta < precioDiario; // Verifica si hay un descuento

            return (
              <div className="car" key={car.id_auto}>
                <div className="car-image-container" onClick={() => handleCarClick(car.id_auto)}>
                  <img src={car.foto_principal} alt={car.modelo} className="car-image1" />
                </div>
                <div className="car-info">
                  <h2 className="car-title">{car.modelo}</h2>
                  <p className="car-price">
                    {tieneDescuento ? (
                      <>
                        <span className="discount-price">${precioConOferta.toLocaleString()} MXN</span>
                        <span className="original-price">${precioDiario.toLocaleString()} MXN</span>
                      </>
                    ) : (
                      `$${precioDiario.toLocaleString()} MXN / día`
                    )}
                  </p>
                  <p className="car-category">Categoría: {car.nombre_categoria}</p>
                  <p className="car-owner">Propietario: {car.nombre_usuario}</p>
                  {tieneDescuento && (
                    <p className="car-discount">¡Descuento de {valorDescuento}% aplicado!</p>
                  )}
                  <div className="car-details">
                    <p className="car-detail"><i className="fas fa-paint-brush"></i> Color: {car.color}</p>
                  </div>
                  <button onClick={() => handleBuy(car.id_auto)} className="car-buy-button">Rentar</button>
                  <button onClick={() => handleCarClick(car.id_auto)} className="car-details-button">Más información</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}

export default Cars;
