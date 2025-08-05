export const backend_url = import.meta.env.VITE_BACK_END_URI 
  ? `${import.meta.env.VITE_BACK_END_URI}/backend/api` 
  : `http://localhost:4000/backend/api`;

export const backend_url_core = import.meta.env.VITE_BACK_END_URI 
? `${import.meta.env.VITE_BACK_END_URI}` 
: `http://localhost:4000`;

export const shesti_original_app_url = import.meta.env.VITE_BACK_ORIGINAL_APP_URL
