import { useUser } from './useUser';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js';

const { theme } = resolveConfig(tailwindConfig);

export function useUserBrandingColor() {
  const user = useUser();
  return (
    user?.brandingColor ||
    ((theme.colors as unknown as Record<string, string>)[
      'schestiLightPrimary'
    ] as string)
  );
}
