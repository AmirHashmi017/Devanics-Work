interface ITakeoffPreset {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: any;
}

const initialTakeoffPresetState: ITakeoffPreset = {
  loading: false,
  error: null,
  message: null,
  data: null,
  statusCode: null,
};

export default initialTakeoffPresetState;
