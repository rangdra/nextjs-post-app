import { createContext, useReducer } from "react";
import reducers from "./Reducers";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initState = {
    posts: null,
    userLogin: null,
    currentEdit: 0,
    textComment: "",
  };

  const [state, dispatch] = useReducer(reducers, initState);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
