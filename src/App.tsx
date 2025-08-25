import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './auth/pages/Login';
import Dashboard from './app/dashboard/pages/Dashboard';
import { AppLayout } from './shared/layouts/AppLayout';
import { CardCollections } from './app/flashcards/pages/CardCollections';
import { Flashcards } from './app/flashcards/pages/Flashcards';
import { Recall } from './app/flashcards/pages/Recall';
import { useEffect } from 'react';
import { Api } from './auth/hooks/useApi';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    Api.setTokenProvider(() => getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }
    }));
  }, [getAccessTokenSilently]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Login />
          }
        />
        <Route path='app' element={<AppLayout />}>
          <Route
            path='dashboard'
            element={
              <Dashboard />
            }
          />
          <Route
            path='card-collections'
          >
            <Route index element={<CardCollections />}></Route>
            <Route path=":collectionId/flashcards" element={<Flashcards />}></Route>
            <Route path=":collectionId/flashcards/recall" element={<Recall />}></Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
