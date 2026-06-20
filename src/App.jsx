import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import POS from './pages/POS';
import Orders from './pages/Orders';
import KitchenDisplay from './pages/KitchenDisplay';
import TableSelection from './pages/TableSelection';
import Customers from './pages/Customer';

function App() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TableSelection onSelectTable={setSelectedTable} />} />
        <Route path="/pos" element={<POS tableNumber={selectedTable?.number} selectedCustomer={selectedCustomer} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/kitchen" element={<KitchenDisplay />} />
        <Route path="/customers" element={<Customers onSelectCustomer={setSelectedCustomer} />} />
        <Route path="*" element={<TableSelection onSelectTable={setSelectedTable} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
