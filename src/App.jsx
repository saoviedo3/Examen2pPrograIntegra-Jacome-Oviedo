// App.jsx
import { createClient } from '@supabase/supabase-js';
import FirmadocumentalList from './components/FirmadocumentalList';
import FirmadocumentalForm from './components/FirmadocumentalForm';
import './index.css';

// Configurar el cliente Supabase
const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
  return (
    <div>
      <h1>Task Manager</h1>
      <FirmadocumentalForm supabase={supabase} />
      <FirmadocumentalList supabase={supabase} />
    </div>
  );
};

export default App;
