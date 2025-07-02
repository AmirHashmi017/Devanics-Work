import React, { useState } from "react";
import AddPromo from "./components/AddPromo";
import Promos from "./components/Promos";

const PromoModule = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <AddPromo searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Promos searchTerm={searchTerm} />
    </div>
  );
};

export default PromoModule;
