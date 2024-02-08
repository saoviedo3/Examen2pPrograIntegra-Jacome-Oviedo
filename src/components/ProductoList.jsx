// ProductoList.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProductoUpdateForm from './ProductoUpdateForm'; 

const ProductoList = ({ supabase }) => {
  const [productos, setProductos] = useState([]);
  const [editingProducto, setEditingProducto] = useState(null); 

  
    async function fetchProductos() {
      try {
        let { data: productos, error } = await supabase
          .from('producto')
          .select('*')
          .order('idproducto', { ascending: true });

        if (error) {
          throw error;
        }

        setProductos(productos);
      } catch (error) {
        console.error('Error fetching productos:', error.message);
      }
    }

    useEffect(() => {
    fetchProductos();
  }, [supabase]);

  async function deleteProducto(idproducto) {
    try {
      await supabase.from('producto').delete().eq('idproducto', idproducto);
      setProductos(productos.filter((producto) => producto.idproducto !== idproducto));
    } catch (error) {
      console.error('Error deleting producto:', error.message);
    }
  }

  return (
    <div>
      <h2>Productos</h2>
      <table border={1}>
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Categoria</th>
      <th>Stock</th>
      <th>Precio</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {productos.map((producto) => (
      <tr key={producto.idproducto}>
        <td>{producto.nombre}</td>
        <td>{producto.categoria}</td>
        <td>{producto.stock}</td>
        <td>{producto.precio}</td>
        <td>
          <button onClick={() => deleteProducto(producto.idproducto)}>Delete</button>
          <button onClick={() => setEditingProducto(producto)}>Update</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      {editingProducto && <ProductoUpdateForm producto={editingProducto} supabase={supabase} onProductoUpdated={() => { fetchProductos(); setEditingProducto(null); }} />}
    </div>
  );
};

ProductoList.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default ProductoList;
