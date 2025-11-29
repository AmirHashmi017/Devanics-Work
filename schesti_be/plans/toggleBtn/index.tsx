import { quaternaryHeading } from '@/globals/tailwindvariables';
import { FC } from 'react';

interface ToggleBtnProps {
  onChange: (planType: 'Individual' | 'Educational' | 'Enterprise') => void;
  planType: string;
}
const ToggleBtn: FC<ToggleBtnProps> = ({ planType, onChange }) => {
  console.log(planType, 'planTypeplanType');

  return (
    <div className="flex gap-4 bg-schestiLightPrimary rounded-md">
      <button
        onClick={() => onChange('Individual')}
        className={`px-4 py-2 rounded-lg ${
          planType === 'Individual' ? 'bg-schestiPrimary text-white' : ''
        } bg-schestiLightPrimary flex-1 text-center h-full grid place-items-center ${quaternaryHeading} font-medium  cursor-pointer
      `}
      >
        Individual
      </button>
      <button
        onClick={() => onChange('Enterprise')}
        className={`px-4 py-2 rounded-lg ${
          planType === 'Enterprise' ? 'bg-schestiPrimary text-white' : ''
        } bg-schestiLightPrimary flex-1 text-center h-full grid place-items-center ${quaternaryHeading} font-medium  cursor-pointer
      `}
      >
        Enterprise
      </button>
      <button
        onClick={() => onChange('Educational')}
        className={`px-4 py-2 rounded-lg ${
          planType === 'Educational' ? 'bg-schestiPrimary text-white' : ''
        } bg-schestiLightPrimary flex-1 text-center h-full grid place-items-center ${quaternaryHeading} font-medium cursor-pointer
      `}
      >
        Educational
      </button>
    </div>
  );
};

export default ToggleBtn;
