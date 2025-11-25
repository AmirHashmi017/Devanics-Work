import { createContext } from 'react';
import { ScaleData } from '../scale/page';

export interface ScaleDataContextInterface {
  [pageNumber: string]: ScaleData;
}

export interface ScaleDataContextProps {
  scaleData: ScaleDataContextInterface | null;
  handleScaleData: (value: ScaleDataContextInterface) => void;
}

const ScaleContext = createContext<ScaleDataContextProps>({
  scaleData: null,
  handleScaleData: () => undefined,
});

export default ScaleContext;
