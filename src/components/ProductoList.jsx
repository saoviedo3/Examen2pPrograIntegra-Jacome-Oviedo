import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProductoUpdateForm from './ProductoUpdateForm'; 
import jsPDF from 'jspdf'; 
import 'jspdf-autotable'; 

const ProductoList = ({ supabase }) => {
  const [productos, setProductos] = useState([]);
  const [editingProducto, setEditingProducto] = useState(null); 
  const [categoriaFiltro, setCategoriaFiltro] = useState('Cualquier categoría'); 
  const [ordenFiltro, setOrdenFiltro] = useState(''); 
  const [busqueda, setBusqueda] = useState(''); 

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

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: '#productos-table' }); 
    doc.save('productos.pdf');
  };

  // Filtra los productos por categoría y búsqueda
  let productosFiltrados = productos.filter(producto => 
    (categoriaFiltro === 'Cualquier categoría' || producto.categoria === categoriaFiltro) &&
    (producto.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  // Ordena los productos según el filtro seleccionado
  switch (ordenFiltro) {
    case 'Stock de mayor a menor':
      productosFiltrados.sort((a, b) => b.stock - a.stock);
      break;
    case 'Stock de menor a mayor':
      productosFiltrados.sort((a, b) => a.stock - b.stock);
      break;
    case 'Precio de mayor a menor':
      productosFiltrados.sort((a, b) => b.precio - a.precio);
      break;
    case 'Precio de menor a mayor':
      productosFiltrados.sort((a, b) => a.precio - b.precio);
      break;
    case 'Orden alfabético A-Z':
      productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case 'Orden alfabético Z-A':
      productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;
    default:
      break;
  }

  // Obtiene todas las categorías únicas
  const categorias = ['Cualquier categoría', ...new Set(productos.map(producto => producto.categoria))];

  return (
    <div>
      <h2>Productos</h2>
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
          <option value="Stock de mayor a menor">Stock de mayor a menor</option>
          <option value="Stock de menor a mayor">Stock de menor a mayor</option>
          <option value="Precio de mayor a menor">Precio de mayor a menor</option>
          <option value="Precio de menor a mayor">Precio de menor a mayor</option>
          <option value="Orden alfabético A-Z">Orden alfabético A-Z</option>
          <option value="Orden alfabético Z-A">Orden alfabético Z-A</option>
        </select>
      </label>
      <br />
      <label>
        Buscar por nombre de producto:
        <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </label>
      <br />
      <button onClick={generatePDF}>Generar Reporte</button> 
      <br />

      <table id="productos-table" border={1}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
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
