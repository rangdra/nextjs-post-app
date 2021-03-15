import { createContext, useReducer, useEffect } from "react";
import reducers from "./Reducers";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initState = {
    posts: null,
    userLogin: null,
    currentEdit: 0
  };

  const [state, dispatch] = useReducer(reducers, initState);

  useEffect(() => {
    const userLogin = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    dispatch({ type: "GET_USER_LOGIN", payload: userLogin });
  }, []);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
