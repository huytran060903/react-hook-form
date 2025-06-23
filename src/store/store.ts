import { createStore } from "redux";

export type Inputs = {
  search: string;
};

const initialState: Inputs = {
  search: "",
};

console.log("Initial state:", initialState);

export const updateFormData = (data: Inputs) => ({
  type: "UPDATE",
  payload: data,
});

const reducer = (
  state: Inputs = initialState,
  action: { type: string; payload: { search: string } }
) => {
  switch (action.type) {
    case "UPDATE":
      return { search: action.payload.search };

    default:
      return state;
  }
};

export const store = createStore(reducer);
