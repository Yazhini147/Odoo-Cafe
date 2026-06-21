import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import POS from './pages/POS';
import Orders from './pages/Orders';
import KitchenDisplay from './pages/KitchenDisplay';
import TableSelection from './pages/TableSelection';
import Customers from './pages/Customer';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function App() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tables" element={<TableSelection onSelectTable={setSelectedTable} />} />
        <Route path="/pos" element={<POS tableNumber={selectedTable?.number} selectedCustomer={selectedCustomer} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/kitchen" element={<KitchenDisplay />} />
        <Route path="/customers" element={<Customers onSelectCustomer={setSelectedCustomer} />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
