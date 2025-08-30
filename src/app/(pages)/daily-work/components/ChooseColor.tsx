import { dailyWorkColors } from '../utils';

type Props = {
  itemColor?: string;
  onSelectColor: (_color: string) => void;
};
export function ChooseColor({ itemColor, onSelectColor }: Props) {
  return (
    <div>
      <p className="text-sm font-medium text-schestiPrimaryBlack ">
        Choose Color
      </p>
      <div className="grid grid-cols-4 gap-3 bg-white w-full h-full py-3 px-2">
        {dailyWorkColors.map((color) => {
          const isActive = color === itemColor;
          return (
            <div
              key={color}
              style={{
                background: color,
                border: isActive ? '1px solid #475467' : '1px solid #D0D5DD',
              }}
              onClick={() => onSelectColor(color)}
              className={`w-[25px] h-[25px] rounded-md ${isActive ? 'scale-150' : ''} hover:scale-150 cursor-pointer`}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
