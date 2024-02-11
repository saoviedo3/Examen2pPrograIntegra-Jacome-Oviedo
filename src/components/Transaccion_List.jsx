import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable'; 

const TransaccionList = ({ supabase }) => {
  const [transacciones, setTransacciones] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Cualquier categoría'); 
  const [ordenFiltro, setOrdenFiltro] = useState(''); 
  const [busqueda, setBusqueda] = useState(''); 

  useEffect(() => {
    async function fetchTransacciones() {
      try {
        let { data: transacciones, error: errorTransacciones } = await supabase
          .from('transaccion')
          .select('idtransaccion, accion, producto, cantidad, categoria')
          .order('idtransaccion', { ascending: true });
  
        if (errorTransacciones) {
          throw errorTransacciones;
        }
  
        setTransacciones(transacciones);
      } catch (error) {
        console.error('Error fetching transacciones:', error.message);
      }
    }
  
    fetchTransacciones();
  }, [supabase]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: '#transacciones-table' }); 
    doc.save('transacciones.pdf');
  };

  // Filtra las transacciones por categoría y búsqueda
  let transaccionesFiltradas = transacciones.filter(transaccion => 
    (categoriaFiltro === 'Cualquier categoría' || transaccion.categoria === categoriaFiltro) &&
    (transaccion.producto.toLowerCase().includes(busqueda.toLowerCase()))
  );

  // Ordena las transacciones según el filtro seleccionado
  if (ordenFiltro === 'Cantidad de mayor a menor') {
    transaccionesFiltradas.sort((a, b) => b.cantidad - a.cantidad);
  } else if (ordenFiltro === 'Orden alfabético A-Z') {
    transaccionesFiltradas.sort((a, b) => a.producto.localeCompare(b.producto));
  }

  // Obtiene todas las categorías únicas
  const categorias = ['Cualquier categoría', ...new Set(transacciones.map(transaccion => transaccion.categoria))];

  return (
    <div>
      <h2>Lista de Transacciones</h2>
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
      <br />
      <label>
        Ordenar por:
        <select value={ordenFiltro} onChange={(e) => setOrdenFiltro(e.target.value)}>
          <option value="">Seleccionar...</option>
          <option value="Cantidad de mayor a menor">Cantidad de mayor a menor</option>
          <option value="Orden alfabético A-Z">Orden alfabético A-Z</option>
        </select>
      </label>
      <br />
      <label>
        Buscar por nombre de producto:
        <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </label>
      <br />
      <button onClick={generatePDF}>Generar Reporte</button> 
      <br /><br />
      <table id="transacciones-table" border={1}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Transacción</th>
          </tr>
        </thead>
        <tbody>
          {transaccionesFiltradas.map((transaccion) => (
            <tr key={transaccion.idtransaccion}>
              <td>{transaccion.producto}</td>
              <td>{transaccion.categoria}</td>
              <td>{transaccion.cantidad}</td>
              <td>{transaccion.accion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TransaccionList.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default TransaccionList;
