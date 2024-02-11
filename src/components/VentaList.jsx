import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable'; 

const VentaList = ({ supabase }) => {
  const [ventas, setVentas] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Cualquier categoría'); 
  const [ordenFiltro, setOrdenFiltro] = useState(''); 
  const [busqueda, setBusqueda] = useState(''); 

  useEffect(() => {
    async function fetchVentas() {
      try {
        let { data: ventas, error: errorVentas } = await supabase
          .from('venta')
          .select('idventa, producto, cantidad')
          .order('idventa', { ascending: true });
  
        if (errorVentas) {
          throw errorVentas;
        }
  
        let { data: productos, error: errorProductos } = await supabase
          .from('producto')
          .select('idproducto, nombre, precio, categoria');
  
        if (errorProductos) {
          throw errorProductos;
        }

        ventas = ventas.map(venta => {
          const producto = productos.find(p => p.idproducto === venta.producto);
          const total = (producto.precio * venta.cantidad).toFixed(2); 
          return {
            ...venta,
            nombre: producto.nombre,
            precio: producto.precio, 
            total,
            categoria: producto.categoria,
          };
        });
  
        setVentas(ventas);
      } catch (error) {
        console.error('Error fetching ventas:', error.message);
      }
    }
  
    fetchVentas();
  }, [supabase]);
  
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: '#ventas-table' }); 
    doc.save('ventas.pdf');
  };

  // Filtra las ventas por categoría y búsqueda
  let ventasFiltradas = ventas.filter(venta => 
    (categoriaFiltro === 'Cualquier categoría' || venta.categoria === categoriaFiltro) &&
    (venta.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  // Ordena las ventas según el filtro seleccionado
  switch (ordenFiltro) {
    case 'Precio final de mayor a menor':
      ventasFiltradas.sort((a, b) => b.total - a.total);
      break;
    case 'Precio final de menor a mayor':
      ventasFiltradas.sort((a, b) => a.total - b.total);
      break;
    case 'Precio Unitario de mayor a menor':
      ventasFiltradas.sort((a, b) => b.precio - a.precio);
      break;
    case 'Precio Unitario de menor a mayor':
      ventasFiltradas.sort((a, b) => a.precio - b.precio);
      break;
    case 'Cantidad de mayor a menor':
      ventasFiltradas.sort((a, b) => b.cantidad - a.cantidad);
      break;
    case 'Cantidad de menor a mayor':
      ventasFiltradas.sort((a, b) => a.cantidad - b.cantidad);
      break;
    case 'Orden alfabético A-Z':
      ventasFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case 'Orden alfabético Z-A':
      ventasFiltradas.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;
    default:
      break;
  }

  // Obtiene todas las categorías únicas
  const categorias = ['Cualquier categoría', ...new Set(ventas.map(venta => venta.categoria))];

  return (
    <div>
      <h2>Lista de Ventas</h2>
      <label>
        Categoría:
        <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
          {categorias.map((categoria, index) => (
            <option key={index} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </label>
      <label>
        Ordenar por:
        <select value={ordenFiltro} onChange={(e) => setOrdenFiltro(e.target.value)}>
          <option value="">Seleccionar...</option>
          <option value="Precio final de mayor a menor">Precio final de mayor a menor</option>
          <option value="Precio final de menor a mayor">Precio final de menor a mayor</option>
          <option value="Precio Unitario de mayor a menor">Precio Unitario de mayor a menor</option>
          <option value="Precio Unitario de menor a mayor">Precio Unitario de menor a mayor</option>
          <option value="Cantidad de mayor a menor">Cantidad de mayor a menor</option>
          <option value="Cantidad de menor a mayor">Cantidad de menor a mayor</option>
          <option value="Orden alfabético A-Z">Orden alfabético A-Z</option>
          <option value="Orden alfabético Z-A">Orden alfabético Z-A</option>
        </select>
      </label>
      <label>
        Buscar por nombre de producto:
        <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </label>
      <button onClick={generatePDF}>Generar Reporte</button> 
      <br /><br />
      <table id="ventas-table" border={1}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventasFiltradas.map((venta) => (
            <tr key={venta.idventa}>
              <td>{venta.nombre}</td>
              <td>{venta.cantidad}</td>
              <td>{venta.precio}</td>
              <td>{venta.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

VentaList.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default VentaList;
