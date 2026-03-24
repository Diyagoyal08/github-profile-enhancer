import { configureStore } from '@reduxjs/toolkit';
import githubReducer from './githubSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    github: githubReducer,
    theme: themeReducer,
  },
});
