//Dashboard Renter
import React, { useState, useEffect } from 'react';
//import NotificationPermission from '../components/NotificationPermission';
import {
  LineChart, Line, PieChart, Pie, BarChart, Bar,
  ComposedChart, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';
import './DashboardR.css';


const ChartContainer = ({ children }) => {
  return (
    <div style={{ width: '100%', height: '350px', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <ResponsiveContainer>
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DashboardR = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Paleta de colores en tonos rojos
  const COLORS = ['#FF0000', '#FF4D4D', '#FF9999', '#FFB2B2', '#FFE5E5', '#FF1A1A'];

  useEffect(() => {
    // Suprime los errores de ResizeObserver
    const resizeObserverError = window.error;
    window.error = (...args) => {
      if (args[0]?.includes?.('ResizeObserver')) return;
      resizeObserverError?.apply?.(window, args);
    };

    return () => {
      window.error = resizeObserverError;
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await fetch(
          `https://evocars-cristian-ps-projects.vercel.app/api/dashboard-rentador/stats/${userInfo.id_usuario}?año=${selectedYear}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Error al obtener datos');
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
  };

  if (loading) return <div className="dashboard-loading">Cargando datos...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;
  if (!dashboardData) return <div className="dashboard-error">No hay datos disponibles</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard del Rentador</h1>
        <div className="user-info">
          <span>Bienvenido, {JSON.parse(localStorage.getItem('userInfo')).nombre}</span>
          {/* <NotificationPermission id_rol={2} />  */}
        </div>
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="year-selector"
        >
          {[2023, 2024, 2025].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Rentas</h3>
          <p className="stat-number">{dashboardData.rentasTotales?.total || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Ingresos Totales</h3>
          <p className="stat-number">
            {formatMoney(dashboardData.ingresosTotales?.total || 0)}
          </p>
        </div>
        <div className="stat-card">
          <h3>Promedio por Renta</h3>
          <p className="stat-number">
            {formatMoney(dashboardData.promedios?.ingreso_por_auto || 0)}
          </p>
        </div>
      </div>

      <div className="charts-grid">
        {/* Rentas por Mes */}
        <div className="chart-card">
          <h3>Rentas por Mes</h3>
          <ChartContainer>
            <LineChart
              data={dashboardData.rentasPorMes || []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total_rentas" 
                stroke="#FF0000" 
                name="Rentas"
              />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Rentas por Categoría */}
        <div className="chart-card">
          <h3>Rentas por Categoría</h3>
          <ChartContainer>
            <PieChart>
              <Pie
                data={dashboardData.rentasPorCategoria || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="total_rentas"
                nameKey="nombre_categoria"
                label
              >
                {(dashboardData.rentasPorCategoria || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        </div>

        {/* Rendimiento por Sucursal */}
        <div className="chart-card">
          <h3>Rendimiento por Sucursal</h3>
          <ChartContainer>
            <ComposedChart
              data={dashboardData.rendimientoPorSucursal || []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre_sucursal" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="total_rentas" 
                fill="#FF4D4D" 
                name="Total Rentas"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="ingresos_totales" 
                stroke="#FF0000" 
                name="Ingresos"
              />
            </ComposedChart>
          </ChartContainer>
        </div>

        {/* Top Autos Rentados */}
        <div className="chart-card">
          <h3>Top Autos Más Rentados</h3>
          <ChartContainer>
            <BarChart
              data={dashboardData.topAutosRentados || []}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="auto" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="total_rentas" 
                fill="#FF4D4D" 
                name="Total Rentas"
              />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Cupones Más Usados */}
        <div className="chart-card">
          <h3>Cupones Más Usados</h3>
          <ChartContainer>
            <BarChart
              data={dashboardData.topCupones || []}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="codigo" 
                type="category" 
                width={90} 
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'Porcentaje de Uso') return formatPercentage(value);
                  return value;
                }}
              />
              <Legend />
              <Bar 
                dataKey="total_usos" 
                fill="#FF4D4D" 
                name="Total Usos"
              >
                {(dashboardData.topCupones || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Bar 
                dataKey="porcentaje_uso" 
                fill="#FF9999" 
                name="Porcentaje de Uso"
              />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Estadísticas de Cupones */}
        <div className="chart-card">
          <h3>Estadísticas de Cupones</h3>
          <div className="coupon-stats-container">
            <div className="coupon-stats-grid">
              <div className="coupon-stat-item">
                <span className="stat-label">Cupones Totales</span>
                <span className="stat-value">
                  {dashboardData.cuponesStats?.total_cupones || 0}
                </span>
              </div>
              <div className="coupon-stat-item">
                <span className="stat-label">Cupones Activos</span>
                <span className="stat-value">
                  {dashboardData.cuponesStats?.cupones_activos || 0}
                </span>
              </div>
              <div className="coupon-stat-item">
                <span className="stat-label">Cupones Agotados</span>
                <span className="stat-value">
                  {dashboardData.cuponesStats?.cupones_agotados || 0}
                </span>
              </div>
              <div className="coupon-stat-item">
                <span className="stat-label">Cupones Expirados</span>
                <span className="stat-value">
                  {dashboardData.cuponesStats?.cupones_expirados || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Uso de Cupones por Mes */}
        {/* <div className="chart-card">
          <h3>Uso de Cupones por Mes</h3>
          <ChartContainer>
            <ComposedChart
              data={dashboardData.cuponesPorMes || []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="cupones_utilizados" 
                fill="#FF4D4D" 
                name="Cupones Únicos"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="total_usos" 
                stroke="#FF0000" 
                name="Total Usos"
              />
            </ComposedChart>
          </ChartContainer>
        </div> */}

        {/* Distribución de Duración */}
        <div className="chart-card">
          <h3>Distribución de Duración de Rentas</h3>
          <ChartContainer>
            <PieChart>
              <Pie
                data={dashboardData.duracionRentas || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#FF0000"
                paddingAngle={5}
                dataKey="total_rentas"
                nameKey="duracion"
                label
              >
                {(dashboardData.duracionRentas || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        </div>

        {/* Desglose de Ganancias */}
<div className="chart-card">
  <h3>Desglose de Ganancias</h3>
  <div className="earnings-breakdown">
    <div className="earnings-item">
      <span>Ganancias Brutas</span>
      <span className="amount">
        {formatMoney(dashboardData.gananciasComisiones?.ingresos_brutos || 0)}
      </span>
    </div>
    <div className="earnings-item negative">
      <div className="commission-details">
        <span>Comisiones</span>
        <span className="commission-percentage">
          ({((dashboardData.gananciasComisiones?.comisiones || 0) / 
             (dashboardData.gananciasComisiones?.ingresos_brutos || 1) * 100).toFixed(1)}%)
        </span>
      </div>
      <span className="amount">
        -{formatMoney(dashboardData.gananciasComisiones?.comisiones || 0)}
      </span>
    </div>
    <div className="earnings-item total">
      <span>Ganancias Netas</span>
      <span className="amount">
        {formatMoney(dashboardData.gananciasComisiones?.ganancias_netas || 0)}
      </span>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default DashboardR;
