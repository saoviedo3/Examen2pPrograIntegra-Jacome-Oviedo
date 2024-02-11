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
      const { error: productoError } = await supabase.from('producto').insert([{
        nombre,
        categoria,
        stock,
        precio 
      }], { returning: 'representation' }); // Cambiado a 'representation'
  
      if (productoError) {
        throw productoError;
      }
  
      const { error: transaccionError } = await supabase.from('transaccion').insert([{
        accion: 'Agregar',
        producto: nombre, 
        categoria: categoria,
        cantidad: stock
      }]);
  
      if (transaccionError) {
        throw transaccionError;
      }
  
      setNombre('');
      setCategoria('');
      setStock('');
      setPrecio(''); 
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
      Precio: 
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
