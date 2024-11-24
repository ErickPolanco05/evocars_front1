import React, { useState, useEffect } from 'react';
import './DashboardA.css';
import { 
  BarChart, Bar, 
  LineChart, Line, 
  PieChart, Pie, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  Legend,
  Cell
} from 'recharts';
import axios from 'axios';

const DashboardA = () => {
  // Estados para manejar los datos y la UI
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuraciones constantes
  const COLORS = ['#8B0000', '#B22222', '#DC143C', '#FF0000', '#FF4444'];
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  // Dimensiones estándar para todas las gráficas
  const chartDimensions = {
    width: 500,
    height: 350,
    margin: { 
      top: 20, 
      right: 30, 
      left: 120, 
      bottom: 20 
    }
  };

  // Función para procesar y normalizar los datos recibidos
  const processData = (rawData) => {
    if (!rawData) return null;

    return {
      ...rawData,
      // Procesar autos con ofertas para asegurar la estructura correcta
      autosConOfertas: rawData.autosConOfertas?.map(auto => ({
        modelo: `${auto.marca} ${auto.modelo}`,
        descuento: auto.valor_descuento,
        tipo_descuento: auto.tipo_descuento
      })) || [],

      // Asegurar que tenemos datos para todos los meses en ingresos
      ingresosPorMes: Array.from({ length: 12 }, (_, index) => {
        const existingData = rawData.ingresosPorMes?.find(item => item.mes === index + 1);
        return {
          mes: index + 1,
          total_ingresos: existingData?.total_ingresos || 0
        };
      }),

      // Normalizar datos de comisiones por año
      comisionesPorAnio: rawData.comisionesPorAnio || [
        { anio: 2024, total_comisiones: 0 },
        { anio: 2025, total_comisiones: 0 }
      ],

      // Procesar y combinar datos de usuarios por mes y rol
      usuariosPorMesYRol: Array.from({ length: 12 }, (_, index) => {
        const monthData = rawData.usuariosPorMesYRol?.filter(item => item.mes === index + 1) || [];
        return {
          mes: index + 1,
          usuarios_admin: monthData.find(item => item.id_rol === 1)?.total_usuarios || 0,
          usuarios_rentador: monthData.find(item => item.id_rol === 2)?.total_usuarios || 0
        };
      }),

      // Procesar datos de cupones
      cuponesMasUsados: rawData.cuponesMasUsados?.map(cupon => ({
        ...cupon,
        nombre: cupon.codigo,
        usos: cupon.total_uses,
        descuento: cupon.valor_descuento,
        tipo: cupon.tipo_descuento === 'porcentaje' ? '%' : '$'
      })) || []
    };
  };

  // Función para obtener los datos del dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/dashboard/stats?año=${selectedYear}`);
      const processedData = processData(response.data);
      setDashboardData(processedData);
      setError(null);
    } catch (err) {
      console.error('Error detallado:', err);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los datos cuando cambie el año
  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear]);

  // Renderizado condicional para estados de carga y error
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-error">
        <div className="error-message">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <h1>Dashboard Administrativo</h1>
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

      {/* Tarjeta de estadísticas totales */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Autos</h3>
          <p className="stat-number">
            {dashboardData?.totalAutos?.total?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      <div className="charts-grid">
        {/* Gráfica de Autos por Categoría */}
        <div className="chart-card">
          <h3>Autos por Categoría</h3>
          <div className="chart-content">
            <PieChart width={chartDimensions.width} height={chartDimensions.height}>
              <Pie
                data={dashboardData.autosPorCategoria}
                cx={chartDimensions.width / 2}
                cy={chartDimensions.height / 2}
                labelLine={false}
                outerRadius={120}
                fill="#8B0000"
                dataKey="total"
                nameKey="nombre_categoria"
                label={({name, value}) => `${name}: ${value.toLocaleString()}`}
              >
                {dashboardData.autosPorCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => value.toLocaleString()}
                labelFormatter={(name) => name}
              />
            </PieChart>
          </div>
        </div>

        {/* Gráfica de Autos con Ofertas */}
        <div className="chart-card">
          <h3>Autos con Ofertas Activas</h3>
          <div className="chart-content">
            <BarChart
              width={chartDimensions.width}
              height={chartDimensions.height}
              data={dashboardData.autosConOfertas}
              margin={{ ...chartDimensions.margin, left: 150 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                domain={[0, dataMax => Math.max(dataMax, 100)]}
              />
              <YAxis 
                dataKey="modelo" 
                type="category" 
                width={1}
              />
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value}${props.payload.tipo_descuento === 'porcentaje' ? '%' : '$'}`,
                  'Descuento'
                ]}
              />
              <Bar 
                dataKey="descuento" 
                fill="#8B0000" 
                name="Descuento"
              />
            </BarChart>
          </div>
        </div>

        {/* Gráfica de Ingresos por Mes */}
        <div className="chart-card">
          <h3>Ingresos por Mes</h3>
          <div className="chart-content">
            <LineChart 
              width={chartDimensions.width}
              height={chartDimensions.height}
              data={dashboardData.ingresosPorMes}
              margin={{ ...chartDimensions.margin, left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                tickFormatter={(mes) => meses[mes - 1]}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                domain={[0, dataMax => Math.ceil(dataMax * 1.1)]}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']}
                labelFormatter={(mes) => meses[mes - 1]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total_ingresos" 
                stroke="#8B0000" 
                name="Ingresos"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </div>
        </div>

        {/* Gráfica de Comisiones por Mes */}
        <div className="chart-card">
          <h3>Comisiones por Mes</h3>
          <div className="chart-content">
            <BarChart 
              width={chartDimensions.width}
              height={chartDimensions.height}
              data={dashboardData.comisionesPorMes}
              margin={{ ...chartDimensions.margin, left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes"
                tickFormatter={(mes) => meses[mes - 1]}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                domain={[0, dataMax => Math.ceil(dataMax * 1.1)]}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Comisiones']}
                labelFormatter={(mes) => meses[mes - 1]}
              />
              <Legend />
              <Bar 
                dataKey="total_comisiones" 
                fill="#B22222" 
                name="Comisiones"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </div>
        </div>

        {/* Gráfica de Ingresos por Sucursal */}
        <div className="chart-card">
          <h3>Ingresos por Sucursal</h3>
          <div className="chart-content">
            <BarChart
              width={chartDimensions.width}
              height={chartDimensions.height}
              data={dashboardData.ingresosPorSucursal}
              margin={{ ...chartDimensions.margin, left: 100 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                domain={[0, dataMax => Math.ceil(dataMax * 1.1)]}
              />
              <YAxis 
                dataKey="nombre_sucursal" 
                type="category" 
                width={1}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']}
              />
              <Bar 
                dataKey="total_ingresos" 
                fill="#DC143C" 
                name="Ingresos"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </div>
        </div>

        {/* Gráfica de Comisiones por Sucursal */}
        <div className="chart-card">
          <h3>Comisiones por Sucursal</h3>
          <div className="chart-content">
            <BarChart
              width={chartDimensions.width}
              height={chartDimensions.height}
              data={dashboardData.comisionesPorSucursal}
              margin={{ ...chartDimensions.margin, left: 100 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                domain={[0, dataMax => Math.ceil(dataMax * 1.1)]}
              />
              <YAxis 
                dataKey="nombre_sucursal" 
                type="category" 
                width={1}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Comisiones']}
              />
              <Bar 
                dataKey="total_comisiones" 
                fill="#FF0000" 
                name="Comisiones"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </div>
        </div>

        {/* Gráfica de Usuarios por Mes y Rol */}
        <div className="chart-card">
          <h3>Registros por mes</h3>
          <div className="chart-content">
            <BarChart
              width={chartDimensions.width}
              height={chartDimensions.height}
              data={dashboardData.usuariosPorMesYRol}
              margin={{ ...chartDimensions.margin, left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                tickFormatter={(mes) => meses[mes - 1]}
              />
              <YAxis 
                allowDecimals={false}
                domain={[0, 'auto']}
              />
              <Tooltip 
                labelFormatter={(mes) => meses[mes - 1]}
                formatter={(value, name) => [
                  value,
                  name === "usuarios_admin" ? "Usuarios" : "Rentadores"
                ]}
              />
              <Legend />
              <Bar 
                dataKey="usuarios_admin" 
                stackId="a" 
                fill="#8B0000" 
                name="Usuarios"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="usuarios_rentador" 
                stackId="a" 
                fill="#FF4444" 
                name="Rentadores"
                radius={[4, 4, 0, 0]}
                />
            </BarChart>
          </div>
        </div>

        {/* Gráfica de Cupones más Usados */}
        <div className="chart-card">
          <h3>Cupones más Utilizados</h3>
          <div className="chart-content">
            <BarChart
              width={chartDimensions.width}
              height={chartDimensions.height}
              data={dashboardData.cuponesMasUsados}
              margin={{ ...chartDimensions.margin, left: 150 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                domain={[0, 'auto']}
              />
              <YAxis 
                dataKey="codigo" 
                type="category" 
                width={100}
              />
              <Tooltip 
                formatter={(value, name, props) => [
                  value,
                  name === "usos" ? "Usos Totales" : 
                  `Descuento: ${props.payload.descuento}${props.payload.tipo}`
                ]}
                labelFormatter={(label) => `Cupon: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="usos" 
                fill="#8B0000" 
                name="Usos"
                radius={[0, 4, 4, 0]}
              >
                {dashboardData.cuponesMasUsados.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardA;