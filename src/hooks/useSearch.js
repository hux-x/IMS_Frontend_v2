import { useContext } from "react";
import SecarchContext from "@/context/section"; 

const useSection = () => {
  const context = useContext(SecarchContext);
  const { query, setQuery } = context;

  return { query, setQuery };
};

export default useSection;
