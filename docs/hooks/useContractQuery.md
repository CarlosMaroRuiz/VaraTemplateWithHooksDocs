---
sidebar_position: 3
---

# useContractQuery
Hook personalizado para realizar consultas a contratos Sails en la red Vara, con soporte automático para múltiples tipos de wallet.

## Descripción

**useContractQuery** permite consultar el estado de contratos en la red Vara utilizando la interfaz Sails, detectando automáticamente la wallet disponible (extensión o local) y manejando los estados de carga y error de forma transparente.

### Parámetros
```js
const { data, loading, error, activeWalletType } = useContractQuery(
  serviceName,  // Nombre del servicio en el contrato
  methodName,   // Nombre del método de consulta
  ...args       // Argumentos adicionales para el método
)
```

- serviceName: string - Nombre del servicio definido en el contrato Sails
- methodName: string - Nombre del método de consulta en el servicio
- args: any[] - Argumentos adicionales requeridos por el método de consulta

### Valores retornados
```js
{
  data: any,                // Datos retornados por la consulta
  loading: boolean,         // Estado de carga
  error: string | null,     // Mensaje de error (si existe)
  activeWalletType: string  // Tipo de wallet utilizada ('extension', 'local' o null)
}
```
### data
Contiene los datos retornados por la consulta al contrato. El tipo específico dependerá del método consultado según la definición en el IDL del contrato.

```js
{
const { data } = useContractQuery('Service', 'metodo')
// data puede contener algun tipo de dato, según la respuesta del contrato
}
```

### loading
Indicador booleano que muestra si la consulta está en progreso.
```js
const { loading } = useContractQuery('Service', 'GetUserProfile', userId)
// true mientras se realiza la consulta, false cuando termina
```

### error
Contiene el mensaje de error si la consulta falla, o null si no hay error.
```js
const { error } = useContractQuery('Service', 'GetItemDetails', itemId)
// null si la consulta es exitosa, mensaje de error en caso contrario
```

### activeWalletType
Indica qué tipo de wallet se está utilizando para realizar la consulta:

- **extension**: Se está utilizando una wallet conectada a través de extensión
- **local**: Se está utilizando una wallet local
- **null**: No hay wallet disponible
```js
const { activeWalletType } = useContractQuery('Service', 'GetBalance')
// 'extension', 'local' o null
```

## Funcionamiento Interno
El hook realiza las siguientes operaciones:

- Detecta automáticamente qué wallet está disponible, priorizando la wallet de extensión si ambas están disponibles
- Verifica que exista una conexión válida a Sails y una wallet activa
- Realiza la consulta al contrato utilizando la dirección de la wallet activa
- Maneja el estado de carga durante la operación
- Captura y formatea errores que puedan surgir durante la consulta
- Actualiza el estado cuando cambia cualquier dependencia relevante (wallet, argumentos, etc.)

### Ejemplo basico
```js
function AuthorsList() {
  const { data: authors, loading, error, activeWalletType } = useContractQuery(
    'Service',
    'GetAllAutors'
  );

  if (loading) return <div>Cargando autores...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!authors) return <div>No se encontraron autores</div>;

  return (
    <div>
      <h2>Lista de Autores</h2>
      <p>Consultando con wallet tipo: {activeWalletType || 'Ninguna'}</p>
      <ul>
        {authors.map((author) => (
          <li key={author[0].toString()}>
            {author[1].nombre} - {author[1].email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```
### Ejemplo con Parámetros
```js
function AuthorDetail({ authorId }) {
  const { data: author, loading, error } = useContractQuery(
    'Service',
    'GetByActorId',
    authorId
  );

  if (loading) return <div>Cargando información del autor...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!author) return <div>Autor no encontrado</div>;

  return (
    <div className="author-profile">
      <h2>{author.nombre}</h2>
      <p>Email: {author.email}</p>
      <p>Descripción: {author.descripcion}</p>
      <div className="mangas">
        <h3>Mangas ({author.mangas.length})</h3>
        {author.mangas.map(manga => (
          <div key={manga.id} className="manga-card">
            <h4>{manga.titulo}</h4>
            <p>Estado: {manga.estado}</p>
            <p>Capítulos: {manga.cantidad_capitulos}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Manejo de Dependencias

El hook se actualiza automáticamente cuando cambia cualquiera de estas dependencias:

- La instancia de Sails
- El estado de la wallet local
- El estado de la wallet de extensión
- El nombre del servicio
- El nombre del método
- Cualquiera de los argumentos adicionales

## Consideraciones de Uso

### Priorización de Wallets
El hook prioriza la wallet de extensión sobre la wallet local si ambas están disponibles, ya que las wallets de extensión generalmente ofrecen mayor seguridad.
### Control de Tipo de Wallet
Si necesita control explícito sobre qué wallet utilizar, considere implementar su propia lógica de selección o crear un hook especializado basado en este.
### Reactividad
Tenga en cuenta que el hook realiza una nueva consulta cada vez que cambia una dependencia, lo que puede generar múltiples llamadas si las dependencias cambian frecuentemente.
### Manejo de Errores
Los errores son capturados y formateados para facilitar su presentación en la interfaz. Para un manejo más detallado, puede implementar su propia lógica en el componente consumidor.

```js
function DataWithErrorHandling() {
  const { data, error } = useContractQuery('Service', 'SomeMethod');
  
  useEffect(() => {
    if (error) {
      // Lógica personalizada de manejo de errores
      console.error('Error detallado:', error);
      // Notificar al usuario, intentar recuperación, etc.
    }
  }, [error]);
  
  // ...
}
```

## Dependencias
Este hook depende de:

- **useSails**: Proporciona acceso a la interfaz Sails para interactuar con contratos
- **useLocalWallet**: Para acceder a la wallet local si está disponible
- **useExtensionWallet**: Para acceder a la wallet de extensión si está disponible

:::note
Asegúrese de que estos hooks estén correctamente configurados en su aplicación para que useContractQuery funcione adecuadamente.
:::