import { useContext } from "react";
import SectionContext from "@/context/section"; 

const useSection = () => {
  const context = useContext(SectionContext);
  const { section, setSection } = context;

  const toggleSection = (path) => {
    setSection(path);
  };

  return { section, toggleSection };
};

export default useSection;
