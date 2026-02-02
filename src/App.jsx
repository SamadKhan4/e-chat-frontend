import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth/Auth';
import Chat from './components/Chat/Chat';

const AppContent = () => {
  const { user } = useAuth();
  
  return user ? <Chat /> : <Auth />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;