# Uso del SailsProvider
Hook para proporcionar una instancia de Sails a toda la aplicación mediante Context API.
:::tip ¿Cuándo usar este componente?
Este proveedor es esencial cuando:

Necesitas interactuar con contratos en la red Vara
Utilizas hooks como useContractQuery o useContractMutation
Trabajas con múltiples servicios de contratos
Quieres centralizar la instancia de Sails
:::

### Implementación básica

```js
import React from 'react';
import { SailsProvider } from './providers/SailsProvider';
import { useApi } from '@gear-js/react-hooks';
import App from './App';

function Root() {
  const { api, isApiReady } = useApi();

  if (!isApiReady) {
    return <div>Conectando a la blockchain...</div>;
  }

  return (
    <SailsProvider api={api}>
      <App />
    </SailsProvider>
  );
}
```

:::warning Prerrequisitos
Para usar el SailsProvider, necesitas:

- Una instancia de API inicializada de Vara
- Un archivo IDL accesible en la ruta (/src/App/app.idl)
- El ID del programa definido en constantes
:::

### Estados internos

El SailsProvider maneja internamente tres estados:
```js
const [sails, setSails] = useState(null);     // Instancia de Sails
const [loading, setLoading] = useState(true); // Estado de carga
const [error, setError] = useState(null);     // Estado de error
```

### Integración con otros providers
El SailsProvider funciona bien en conjunto con otros providers:
```js
function AppWithProviders() {
  return (
    <ApiProvider endpoint="wss://vara-testnet.com">
      <AccountProvider>
        <AlertProvider>
          <SailsProvider>
            <App />
          </SailsProvider>
        </AlertProvider>
      </AccountProvider>
    </ApiProvider>
  );
}
```
:::note
Aunque la plantilla ya dispone de un router para manejar las rutas de app puedes personalizarlo si lo
deseas.
:::



### Ejemplo utilizando Router doom

```js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApiProvider, useApi } from '@gear-js/react-hooks';
import { SailsProvider } from './providers/SailsProvider';

function AppRoutes() {
  const { api, isApiReady } = useApi();
  
  if (!isApiReady) {
    return <LoadingScreen />;
  }
  
  return (
    <SailsProvider api={api}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </SailsProvider>
  );
}

function App() {
  return (
    <ApiProvider endpoint="wss://testnet.vara.network">
      <AppRoutes />
    </ApiProvider>
  );
}
```

:::danger Errores comunes

- No proporcionar una instancia API válida
- Ruta incorrecta al archivo IDL
- PROGRAM_ID incorrecto o no definido
- Intentar usar useSails() fuera del contexto del provider
:::

