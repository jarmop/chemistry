import { createContext } from "react";

export const defaultState = { valence: false, element: 118 };

export const StateContext = createContext(defaultState);
