import { createContext } from 'react';
import { DrawInterface } from '../types';

export interface DrawHistoryContextInterface {
  [pageNumber: string]: DrawInterface;
}

export interface DrawHistoryContextProps {
  drawHistory: DrawHistoryContextInterface | null;
  deleteDrawHistory: (key: string, value: DrawInterface) => void;
  updateDrawHistory: (pageNumber: string, shape: string, value: any) => void;
  setInitialEditDrawHistory: (value: any) => void;
}

const DrawHistoryContext = createContext<DrawHistoryContextProps>({
  drawHistory: null,
  deleteDrawHistory: () => undefined,
  updateDrawHistory: () => undefined,
  setInitialEditDrawHistory: () => undefined,
});

export default DrawHistoryContext;
