import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable'; 

const TransaccionList = ({ supabase }) => {
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    async function fetchTransacciones() {
      try {
        let { data: transacciones, error: errorTransacciones } = await supabase
          .from('transaccion')
          .select('idtransaccion, accion, producto, cantidad')
          .order('idtransaccion', { ascending: true });
  
        if (errorTransacciones) {
          throw errorTransacciones;
        }
  
        let { data: productos, error: errorProductos } = await supabase
          .from('producto')
          .select('idproducto, nombre');
  
        if (errorProductos) {
          throw errorProductos;
        }

        transacciones = transacciones.map(transaccion => {
          const producto = productos.find(p => p.idproducto === transaccion.producto);
          return {
            ...transaccion,
            nombre: producto.nombre,
          };
        });
  
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

  return (
    <div>
      <h2>Lista de Transacciones</h2>
      <button onClick={generatePDF}>Generar Reporte</button> 
      <br /><br />
      <table id="transacciones-table" border={1}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Transaccion</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {transacciones.map((transaccion) => (
            <tr key={transaccion.idtransaccion}>
              <td>{transaccion.nombre}</td>
              <td>{transaccion.accion}</td>
              <td>{transaccion.cantidad}</td>
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
