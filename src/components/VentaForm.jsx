// VentaForm.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const VentaForm = ({ supabase }) => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');

  useEffect(() => {
    fetchProductos(); // Llama a fetchProductos cuando el componente se monta
  }, [supabase]);

  async function fetchProductos() {
    try {
      let { data: productos, error } = await supabase
        .from('producto')
        .select('idproducto, nombre, stock, precio');
  
      if (error) {
        throw error;
      }
  
      setProductos(productos);
    } catch (error) {
      console.error('Error fetching productos:', error.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!producto.trim()) return;

    // Buscar el producto para obtener el stock actual
    let { data: productos, error } = await supabase
      .from('producto')
      .select('stock')
      .eq('idproducto', producto);
    if (error) {
      throw error;
    }
    const stockActual = productos[0].stock;

    // Validar que la cantidad de venta no sea mayor que el stock disponible
    if (cantidad > stockActual) {
      alert('No se puede vender más productos de los que hay en stock');
      return;
    }

    try {
      const { error } = await supabase.from('venta').insert([{
        producto,
        cantidad
      }]);
      if (error) {
        throw error;
      }

      // Actualizar el stock del producto
      await supabase
        .from('producto')
        .update({ stock: stockActual - cantidad })
        .eq('idproducto', producto);

      alert('Venta agregada correctamente');
      setProducto('');
      setCantidad('');

      fetchProductos(); // Vuelve a buscar los productos después de que se haya realizado una venta
    } catch (error) {
      console.error('Error adding venta:', error.message);
      alert('No se agregó la venta correctamente');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Agregar Venta</h2>

      Producto:
      <br />
      <select value={producto} onChange={(e) => setProducto(e.target.value)}>
        {productos.map((producto) => (
          <option key={producto.idproducto} value={producto.idproducto}>
            {producto.nombre} - Stock: {producto.stock} - Precio: {producto.precio}
          </option>
        ))}
      </select>
      <br />
      Cantidad:
      <br />
      <input
        type="number"
        placeholder="Ingrese cantidad"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
      />
      <br />
        <br />

      <button type="submit">Agregar Venta</button>
    </form>
  );
};

VentaForm.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default VentaForm;
