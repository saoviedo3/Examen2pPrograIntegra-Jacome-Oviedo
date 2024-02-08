import React from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js';
import ProductoList from './components/ProductoList';
import './index.css';

// Configurar el cliente Supabase
const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductoList supabase={supabase} />
  </React.StrictMode>,
);