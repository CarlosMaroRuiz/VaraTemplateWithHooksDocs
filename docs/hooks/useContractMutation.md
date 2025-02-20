---
sidebar_position: 4
---

# useContractMutation (V1)

Hook para realizar mutaciones (transacciones que modifican estado) en contratos de la red Vara.

:::tip ¿Cuándo usar este hook?
Este hook es ideal cuando necesitas:
- Modificar el estado de un contrato
- Realizar transacciones que requieren firma
- Ejecutar operaciones que consumen gas
:::

## Estados Principales

```js
const {
  loading,           // Estado de carga de la transacción
  error,             // Estado de error
  success,           // Estado de éxito
  transactionResult, // Resultado de la transacción
  gasUsed,          // Gas utilizado
  response          // Respuesta del contrato
} = useContractMutation(serviceName, methodName)
```
:::warning Prerrequisitos
Para usar este hook, necesitas:

Una wallet inicializada (local o extensión)
Conexión activa con la API de Vara
Suficiente balance para cubrir el gas
El ID del servicio y método correctos
:::

:::note
Recordar que esto es sola declaraccion de la mutacion para interactuar con el 
servicio se utiliza
**sendTransaction()**
:::

### Loading State
```js
const { loading } = useContractMutation('MiServicio', 'miMetodo')
```
:::note Estados de Loading
El loading será true durante:

Cálculo de gas
- Firma de transacción
- Envío al blockchain
- Espera de confirmación
:::

### Error Handling
```js
const { error } = useContractMutation('MiServicio', 'miMetodo')
```

:::danger Errores Comunes

- Wallet no inicializada
- Gas insuficiente
- Método no encontrado
- Fallo en firma
- Timeout de red
:::

### Transaction Result
```js
const { transactionResult } = useContractMutation('Servicio', 'Metodo')
```
:::tip Estructura del Resultado
```js
{
  messageId: string,  // ID único del mensaje
  blockHash: string,  // Hash del bloque contenedor
  txHash: string,     // Hash de la transacción
  response: any       // Respuesta del contrato
}
```
:::

:::tip Tip de Error Handling
Implementa reintentos automáticos para errores transitorios:
```js
const MAX_RETRIES = 3;
const handleWithRetry = async () => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await sendTransaction(args);
      break;
    } catch (err) {
      if (i === MAX_RETRIES - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
};
```

### Gas Management
Estado que nos permite manejar el estado del gas realizado por la transaccion
```js
function GasAwareTransaction() {
  const { gasUsed, sendTransaction } = useContractMutation('Service', 'Method')

  useEffect(() => {
    if (gasUsed) {
      console.log(`Gas utilizado: ${gasUsed}`)
    }
  }, [gasUsed])
}
```
:::
:::warning Gas Considerations

Siempre verifica el balance antes de transacciones grandes
Considera un margen de seguridad para el gas
Monitorea patrones de uso de gas
:::

### Estado de transaccion
```js
function TransactionMonitor() {
  const { 
    loading, 
    success, 
    transactionResult 
  } = useContractMutation('Service', 'Method')

  useEffect(() => {
    if (success) {
      // Guardar resultado
      localStorage.setItem(
        'lastTransaction', 
        JSON.stringify(transactionResult)
      )
    }
  }, [success, transactionResult])
}
```

:::tip Transaction Tracking
Mantén un registro de transacciones
```js
const txHistory = []
useEffect(() => {
  if (success && transactionResult) {
    txHistory.push({
      ...transactionResult,
      timestamp: Date.now()
    })
  }
}, [success, transactionResult])

```
:::

### Integración con Otros Hooks
:::tip Hook Composition
```js
function IntegratedContract() {
  const mutation = useContractMutation('Service', 'Method')
  const { data } = useContractQuery('Service', 'Query')

  // Combinar funcionalidad
  const handleOperation = async () => {
    if (data && wallet) {
      await mutation.sendTransaction(data)
    }
  }
}

```
:::

### Gestion de Estado

:::warning Estado Local vs Global
Considera usar un gestor de estado global para transacciones importantes
Mantén un histórico de transacciones
Implementa persistencia cuando sea necesario
:::

### Recovery Patterns
Implementa patrones de recuperación:

```js
function RecoverableTransaction() {
  const { sendTransaction, error } = useContractMutation('Service', 'Method')
  
  const handleWithRecovery = async () => {
    try {
      await sendTransaction(args)
    } catch (err) {
      // Guardar estado para recovery
      localStorage.setItem('pendingTx', JSON.stringify({
        args,
        timestamp: Date.now()
      }))
      // Implementar lógica de recuperación
    }
  }
}
```