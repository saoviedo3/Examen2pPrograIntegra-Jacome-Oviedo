// ProductoUpdateForm.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProductoUpdateForm = ({ producto, supabase, onProductoUpdated }) => {
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [stock, setStock] = useState('');
    const [precio, setPrecio] = useState(''); // Nuevo estado para el precio
  
    useEffect(() => {
      setNombre(producto.nombre);
      setCategoria(producto.categoria);
      setStock(producto.stock);
      setPrecio(producto.precio); // Inicializa el estado del precio
    }, [producto]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!nombre.trim()) return;
      try {
        const { error } = await supabase.from('producto').update({
          nombre,
          categoria,
          stock,
          precio // Agrega el precio al objeto de actualización
        }).eq('idproducto', producto.idproducto);
        if (error) {
          throw error;
        }
        alert('Producto actualizado correctamente');
        onProductoUpdated(); 
      } catch (error) {
        console.error('Error updating producto:', error.message);
        alert('No se actualizó el producto correctamente');
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <h2>Actualizar Producto</h2>
        <h3>Ingrese los nuevos datos del producto</h3>
      Nombre:
      <br />
      <input
        type="text"
        placeholder="Ingrese nuevo nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <br />
      Categoria:
      <br />
      <input
        type="text"
        placeholder="Ingrese nueva categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />
      <br />
      Stock:
      <br />
      <input
        type="number"
        placeholder="Ingrese nuevo stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
      <br />
      Precio: {/* Nuevo campo de entrada para el precio */}
      <br />
      <input
        type="number"
        placeholder="Ingrese nuevo precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
      />
      <br />
      <button type="submit">Actualizar Producto</button>
    </form>
  );
};

ProductoUpdateForm.propTypes = {
  producto: PropTypes.object.isRequired,
  supabase: PropTypes.object.isRequired,
  onProductoUpdated: PropTypes.func.isRequired, 
};

export default ProductoUpdateForm;
