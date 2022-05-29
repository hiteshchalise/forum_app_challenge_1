import AppProvider from './providers/app';
import RoutesProvider from './routes/AppRoutes';

function App() {
  return (
    <AppProvider>
      <RoutesProvider />
    </AppProvider>
  );
}

export default App;
