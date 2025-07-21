import { createContext } from "react";

interface State {
  valence: boolean;
  element: number | undefined;
}

export const defaultState: State = { valence: false, element: undefined };

export const StateContext = createContext(defaultState);
