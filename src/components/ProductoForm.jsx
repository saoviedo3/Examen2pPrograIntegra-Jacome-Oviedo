// ProductoForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

const ProductoForm = ({ supabase }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [stock, setStock] = useState('');
  const [precio, setPrecio] = useState(''); // Nuevo estado para el precio

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    try {
      const { error } = await supabase.from('producto').insert([{
        nombre,
        categoria,
        stock,
        precio // Agrega el precio al objeto insertado
      }]);
      if (error) {
        throw error;
      }
      setNombre('');
      setCategoria('');
      setStock('');
      setPrecio(''); // Limpia el estado del precio
      alert('Producto agregado correctamente');
    } catch (error) {
      console.error('Error adding producto:', error.message);
      alert('No se agregó el producto correctamente');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Agregar Producto</h2>

      Nombre:
      <br />
      <input
        type="text"
        placeholder="Ingrese nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <br />
      Categoria:
      <br />
      <input
        type="text"
        placeholder="Ingrese categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />
      <br />
      Stock:
      <br />
      <input
        type="number"
        placeholder="Ingrese stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
      <br />
      Precio: {/* Nuevo campo de entrada para el precio */}
      <br />
      <input
        type="number"
        placeholder="Ingrese precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
      />
      <br />
        <br />
      <button type="submit">Agregar Producto</button>
    </form>
  );
};

ProductoForm.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default ProductoForm;
