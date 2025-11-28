import AppRoutes from './routes/AppRoutes';
import { ReduxProvider } from 'src/redux/provider';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ConfigProvider } from 'antd';
import './App.css';

const queryClient = new QueryClient();

const PRIMARY_COLOR = '#007AB6';
const SECONDARY_COLOR = '#E6F2F8';
function App() {

  
  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                inkBarColor: PRIMARY_COLOR,
                colorBorderSecondary: '#EAECF0',
                lineWidth: 2,
              },
              Switch: {
                colorPrimary: PRIMARY_COLOR,
                colorPrimaryHover: SECONDARY_COLOR,
              },
              Radio: {
                colorPrimary: PRIMARY_COLOR,
              },
              Checkbox: {
                colorPrimary: PRIMARY_COLOR,
                colorPrimaryHover: PRIMARY_COLOR,
              },
              Collapse: {
                headerBg: '#F9F9F9',
                colorBorder: '#EAECF0',
              },
              Table: {
                headerColor: '#475467',
              },
            },
            token: {
              colorPrimary: PRIMARY_COLOR,
            },
          }}
        >
          <AppRoutes />
          <ToastContainer />
        </ConfigProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default App;
