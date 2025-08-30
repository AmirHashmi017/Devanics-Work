import { twMerge } from 'tailwind-merge';

type Props = React.ComponentProps<'input'>;
export function InputWithoutBorder(props: Props) {
  return (
    <input
      className={twMerge(
        'px-2 flex-1 rounded-md bg-transparent focus:outline-schestiPrimary py-2 border-0 focus:border-0 focus:ring-0',
        props.className
      )}
      {...props}
    />
  );
}
