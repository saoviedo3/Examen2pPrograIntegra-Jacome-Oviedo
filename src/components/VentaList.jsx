// VentaList.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable'; 

const VentaList = ({ supabase }) => {
  const [ventas, setVentas] = useState([]);

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
          .select('idproducto, nombre, precio');
  
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
            total 
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

  return (
    <div>
      <h2>Lista de Ventas</h2>
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
          {ventas.map((venta) => (
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