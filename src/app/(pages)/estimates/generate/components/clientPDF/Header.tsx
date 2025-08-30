/* eslint-disable jsx-a11y/alt-text */
import { View, Image } from '@react-pdf/renderer';

export const PDF_NAVBAR_BG = 'bg-[#007AB6]';
export const BG_COLOR = '#007AB6';

type Props = {
  logo?: string;
  brandingColor: string;
};
export function PdfHeader({ brandingColor, logo }: Props) {
  const defaultLogo =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAWCAYAAACBtcG5AAAABmJLR0QA/wD/AP+gvaeTAAAEfUlEQVRYhd2ZW4hVZRTHf+t4tyQzuygmXkiTikIrL5mUD2WUkZEVRokviW9ikkLYBdIesoIoLEwnLdGs7KGXIiEhC0Q0A4ckUFEwRGO0MlEc/fWw9+T2m33OGWcm0/6wOd9e67/Wt7511nfZewcXEGo34IlEvCYivJBxdBYiFahXA3cBg4ATwH7g+4j4q6OdqX2BI4m4e0Sc6qjv/wJdWxrqVcCbwIyiPMdRdRnw0qU60M5AU8ONUwMWAE1dKswPAHUgsBkYWsd+E/BgRBxvT+eXcuUdXjFyYJdK7A7omYu2VvLGGs5N3DbgZqAbMBrYmMvvAZZcgFgvOlQihhQSBzCyok4gS0oRsyOiMSKaI+JH4CFgC3AGuOir5N9Av2PN24CfzkqiAfVFW2NIaqzert7bkQDUviV9deuIzwuJQ+/edHnThyOfalo14gElUJeVDGi12qU9Hajdqtle6slL0RU4ViJ/Ghiuzo2IrfWcqAOAhcDDwBCgWd0PrAXeiIh0k6jm52OydbYFcyKiKdf1AGaTrcG9S8y/iYjlBV+jgPvzeAZw9lj2VUSsVGcBU9oSF7CIbMlaXJAdRJ1aUg0tOKOuVavuwurdalNit1c9mrcb1etybs3KU08mukEF3es14tTsKNXCfU09XYX3ds55p46/Iiao4xLZbtSKurmO8Qmz4K9MEjdcPVLgnVKn5rqe6rpc3tAJydue6N5Tx6tj8mtwznsk4X2mTirwrs95U9RF+fV+YtNU0C1SB1mWvNxRf3VbycBS7FOHFwa0LtF/kiS3n3pAndMJyduX6MZWmQkfJbznqs2agk2amD1t4OyuAETEb8BYYC5wtEY/g4H1ahe1D/Boot9QvMnXq2ERsYzqeFKdoc4AKjV4KZqryK9I7peqm/I+epyH//OHeo26XG0uqZIWTDabCilKq6Hgu6zyaqFW5S1Qpxeuy3Le4hr+DquzS+JqV+XVGuhos8W+DPPUaSXyG9qRvC/UDfmVLvK1kpdiaM7rr+6ow53ZGclLXwD8g4jYrk4CGoFrE3VXoOz5tuwIUQ+PtzzbqieB7m20WwUcLNz/DtkSpI4DngGeBcaU2M7M7TsO9b78n291uFVXlfxzj6lDS+STS+x7F9qduWGUJaVsbCPUhsR2V8Jp34Zhdoz4GpgGzE8MAhiV+DkObIyIvcDORDexxP5b9QO1apW3E63eRZaSIn6JiFnAjoL4YDX++aAC/FC4f019S71VvQ1YCdyR2CyJiJYd+ZVEN9PstRNqBXgVuBPoExHVdse24s/kfrxteLRTe6kTgeEF8ecdjOWcDhabPU3Uw4o8KUXbpQnnV3W9+nPLFDF7fOvotF1dJ7YtOW9EHd6XJkm3IxtGRLygfgc8T/Z6Kp0SO4HFEbEudRoR89VG4GWyc+AAYDrZOWwNMC8iDuX008DeNK5Cew9QPIsVq3Vh/jsa6JXGARzIf0/lfoo4AewGPiX7ZnKmRF+Ma3+J/1acsm8YA4FhZEk4BjRGRJmz1C6AW8gS+Aewq5C0/yX+BmxVbJ1gXFKvAAAAAElFTkSuQmCC';

  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: brandingColor ? brandingColor : BG_COLOR,
        height: '30px',
        paddingLeft: 30,
      }}
      fixed
    >
      <Image
        src={logo ? logo : defaultLogo}
        style={{
          width: 50,
          height: 36,
          paddingVertical: 5,
        }}
      />
    </View>
  );
}
