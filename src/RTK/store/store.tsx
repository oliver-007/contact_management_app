import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { cmaApiSlice } from "../slices/API/cmaApiSlice";
import responseMessageReducer from "../slices/respMessageSlice";

export const store = configureStore({
  reducer: {
    responseMessage: responseMessageReducer,
    [cmaApiSlice.reducerPath]: cmaApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cmaApiSlice.middleware),
});

setupListeners(store.dispatch);

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
