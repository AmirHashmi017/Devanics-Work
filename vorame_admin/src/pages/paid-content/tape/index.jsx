import React, { useState } from "react";
import Tapes from "./components/Tapes";

const Tape = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return <Tapes searchTerm={searchTerm} />;
};

export default Tape;
