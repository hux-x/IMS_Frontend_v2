import { createContext, useState } from "react";

const SectionContext = createContext();

export const SectionProvider = ({ children }) => {
  const [section, setSection] = useState("dashboard");

  return (
    <SectionContext.Provider value={{ section, setSection }}>
      {children}
    </SectionContext.Provider>
  );
};

export default SectionContext;
