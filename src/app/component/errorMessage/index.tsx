import { twMerge } from 'tailwind-merge';
import { senaryHeading } from '../../../globals/tailwindvariables';
// import {InputErrorMessage} from './GlobalStyle';
const Errormsg = ({ children }: any) => {
  return (
    <p className={twMerge(`${senaryHeading} text-red-500 mt-1 transition-all`)}>
      {children}
    </p>
  );
};
export default Errormsg;
