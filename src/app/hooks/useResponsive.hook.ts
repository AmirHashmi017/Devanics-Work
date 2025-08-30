import { configResponsive, useResponsive } from 'ahooks/es/index';
configResponsive({
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
});

export function useResponseHook() {
  return useResponsive() as {
    xs: boolean;
    sm: boolean;
    md: boolean;
    lg: boolean;
    xl: boolean;
  };
}
