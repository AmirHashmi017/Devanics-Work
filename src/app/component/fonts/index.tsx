import {
  Great_Vibes,
  Dancing_Script,
  Sacramento,
  Cookie,
  Satisfy,
  Pacifico,
  Tinos,
  Roboto,
} from 'next/font/google';

export const robotoFont = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const greatVibesFont = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const dancingScriptFont = Dancing_Script({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const sacramentoFont = Sacramento({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const cookieFont = Cookie({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const satisfyFont = Satisfy({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const pacificoFont = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const timesRomenFont = Tinos({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export type ChooseFontType =
  | 'greatVibesFont'
  | 'dancingScriptFont'
  | 'sacramentoFont'
  | 'cookieFont'
  | 'satisfyFont'
  | 'pacificoFont';

type Props = {
  chooseFont?: ChooseFontType;
  text: string;
};

export const SignatureFonts = {
  greatVibesFont: greatVibesFont,
  dancingScriptFont: dancingScriptFont,
  sacramentoFont: sacramentoFont,
  cookieFont: cookieFont,
  satisfyFont: satisfyFont,
  pacificoFont: pacificoFont,
};

export function ChooseFont({ text, chooseFont = 'satisfyFont' }: Props) {
  return <div style={SignatureFonts[chooseFont].style}>{text}</div>;
}
