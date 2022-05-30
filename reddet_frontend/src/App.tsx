import AppProvider from './providers/app';
import RoutesProvider from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <AppProvider>
      <RoutesProvider />
    </AppProvider>
  );
}

export default App;
