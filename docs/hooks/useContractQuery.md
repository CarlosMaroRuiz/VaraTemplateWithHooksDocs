---
sidebar_position: 3
---

# useContractQuery

Hook para realizar consultas (operaciones de solo lectura) en contratos de la red Vara.

:::tip ¿Cuándo usar este hook?
Este hook es ideal cuando necesitas:
- Leer el estado actual de un contrato
- Obtener información sin modificar el estado
- Consultar datos actualizados reactivamente
- Mostrar información del contrato en la UI
:::

## Estados Principales

```js
const {
  data,             // Datos obtenidos de la consulta
  loading,          // Estado de carga de la consulta
  error             // Estado de error
} = useContractQuery(serviceName, methodName, ...args)

```

:::warning Prerrequisitos
Para usar este hook, necesitas:

Una wallet inicializada (local o extensión)
Conexión activa con la API de Vara
El nombre correcto del servicio y método
Los argumentos adecuados para la consulta
:::

:::note
Este hook realiza consultas de solo lectura que no consumen gas ni requieren firma.
La consulta se ejecuta automáticamente cuando cambian sus dependencias.
:::

### Data State

```js
const { data } = useContractQuery('Servicio', 'Consulta')
```

:::tip Trabajando con datos

Los datos se actualizan automáticamente cuando cambian las dependencias
El formato depende del contrato y método consultado
Inicialmente es null hasta que se complete la primera consulta exitosa
Si la consulta falla, permanece con su último valor válido
:::

### Error Handling
```js
const { error } = useContractQuery('Servicio', 'Consulta')
```

:::danger Errores Comunes
- Wallet no inicializada o no conectada
- Servicio o método inexistente
- Argumentos incorrectos en la consulta
- Contrato no desplegado
- Problemas de conexión con la red
:::

### Ejemplo de uso
```js
function BalanceDisplay() {
  const { data, loading, error } = useContractQuery(
    'TokenService',
    'getBalance'
  );

  if (loading) return <div>Cargando balance...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Tu Balance</h3>
      <p>{data ? data.toString() : '0'} VARA</p>
    </div>
  );
}

```

:::tip Integración con otros hooks
Este hook se integra perfectamente con:

- useWalletManagement para acceder a la wallet
- useSails para la conexión con los contratos
- Hooks de UI como useState para manipular los datos obtenidos
:::


:::tip
### **Casos de uso recomendados**

- Mostrar balances y saldos
- Verificar el estado de transacciones
- Obtener metadatos de NFTs
- Consultar configuraciones de contratos
- Leer información del usuario
- Validar condiciones antes de ejecutar transacciones
:::