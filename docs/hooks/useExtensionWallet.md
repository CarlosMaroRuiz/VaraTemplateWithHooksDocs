---
sidebar_position: 2
---
# useExtensionWallet
Hook para gestionar conexión con wallets de extensión (Polkadot.js, SubWallet, etc.) en la red Vara.
```js
const {
  wallet,        // Información del wallet de extensión
  loading,       // Estado de carga
  error,         // Estado de error
  balance,       // Balance actual
  transactions,  // Historial de transacciones
  isApiReady,    // Disponibilidad de la API de Vara
  hasWallet      // Flag que indica si existe una wallet conectada
} = useExtensionWallet()
```

### wallet
Representa la información de la wallet de extensión conectada:
```js
const {
  wallet,        // Información del wallet de extensión
  loading,       // Estado de carga
  error,         // Estado de error
  balance,       // Balance actual
  transactions,  // Historial de transacciones
  isApiReady,    // Disponibilidad de la API de Vara
  hasWallet      // Flag que indica si existe una wallet conectada
} = useExtensionWallet()
```
### La wallet de extensión proporciona:

- Mayor seguridad al mantener las claves privadas protegidas en la extensión
- Flujo UX familiar para usuarios de Polkadot/Kusama/Vara
- Confirmación de firmas mediante interfaz de la extensión
- Soporte para múltiples extensiones (Polkadot.js, SubWallet, etc.)

:::tip
Las wallets de extensión son la opción recomendada para entornos de producción debido a su mayor seguridad al no exponer las claves privadas a la aplicación web.
:::
loading
Indicador booleano que señala si una operación asíncrona está en curso:

### Conexión con la extensión
- Firma de transacciones
- Carga de cuentas
- Envío de transacciones
```js
const { loading } = useExtensionWallet()
```

### error

Sistema de captura y exposición de errores relacionados con operaciones de wallet:

- Errores de conexión con la extensión
- Extensión no instalada o no disponible
- Fallos en el proceso de firma
- Errores en transacciones
- Problemas de API
```js
const { error } = useExtensionWallet()
```
### balance
Balance actual de la wallet en formato raw. Requiere formateo para visualización:

```js
const { balance, formatBalance } = useExtensionWallet()
```

### transactions
Historial de transacciones realizadas durante la sesión actual:
```js
const { transactions } = useExtensionWallet()

// Estructura de cada transacción:
// {
//   hash: string,         // Hash de la transacción
//   type: string,         // Tipo de transacción (ej: 'send')
//   amount: bigint,       // Cantidad en formato raw
//   to: string,           // Dirección destino
//   timestamp: number     // Marca de tiempo
// }
```
:::note
El historial de transacciones no persiste entre recargas de página. Para mantener un historial completo, considere implementar almacenamiento persistente adicional.
:::

## Métodos
connectWallet
```js
const { connectWallet } = useExtensionWallet()

// Uso:
const wallet = await connectWallet()
```

Solicita acceso a la extensión de wallet, obtiene las cuentas disponibles y establece la primera cuenta como wallet activa.
Este método:

- Habilita la comunicación con extensiones de wallet mediante web3Enable
- Solicita las cuentas disponibles mediante web3Accounts
- Selecciona la primera cuenta disponible
- Retorna y almacena la información de la wallet

:::note
Requiere que el usuario tenga instalada una extensión compatible (Polkadot.js, SubWallet, Talisman, etc.) y que otorgue permiso a la aplicación.
:::
### sendTransaction
```js
const { sendTransaction } = useExtensionWallet()

// Uso:
const hash = await sendTransaction(destinationAddress, amount)
```
Envía una transacción a la dirección especificada por el monto indicado, utilizando la extensión para firmarla.
El proceso:

- Obtiene el firmante (signer) de la extensión mediante web3FromAddress
- Construye la transacción de transferencia
- Solicita la firma del usuario a través de la interfaz de la extensión
- Registra la transacción en el historial
- Retorna el hash de la transacción

El monto debe ser un BigInt en unidades raw (1 VARA = 1e12 unidades).

### disconnect
```js
const { disconnect } = useExtensionWallet()
// Uso:
disconnect()
```
Desconecta la wallet del estado actual (no revoca los permisos de la extensión).

### isValidAddress
```js
const { isValidAddress } = useExtensionWallet()

// Uso:
const valid = isValidAddress(address)
// Resultado: true | false
```
Verifica que una dirección tenga el formato correcto utilizando el sistema de tipos de Substrate.

### formatBalance
```js
const { formatBalance } = useExtensionWallet()

// Uso:
const readableBalance = formatBalance(rawBalance)
// Ejemplo: formatBalance("1000000000000") => "1"
```
Convierte un balance en formato raw (en unidades mínimas) a VARA (1 VARA = 1e12 unidades).

### getTransactionHistory
```js
const { getTransactionHistory } = useExtensionWallet()

// Uso:
const history = getTransactionHistory()
```
Obtiene el historial de transacciones realizadas en la sesión actual.

## Ejemplo de Uso Completo
```js
function ExtensionWalletManager() {
  const {
    wallet,
    loading,
    error,
    balance,
    isApiReady,
    connectWallet,
    formatBalance,
    disconnect,
    sendTransaction,
    hasWallet
  } = useExtensionWallet();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      // Error ya manejado por el hook
    }
  };

  const handleSendTransaction = async () => {
    if (!recipient || !amount) return;
    
    try {
      // Convertir a unidades raw (1 VARA = 1e12 unidades)
      const rawAmount = BigInt(parseFloat(amount) * 1e12);
      const hash = await sendTransaction(recipient, rawAmount);
      console.log("Transacción enviada:", hash);
      setRecipient("");
      setAmount("");
    } catch (error) {
      // Error ya manejado por el hook
    }
  };

  if (!isApiReady) return <div>Conectando a la red Vara...</div>;

  return (
    <div>
      {loading && <div className="loading-indicator">Procesando...</div>}
      {error && <div className="error-message">{error}</div>}

      {!hasWallet ? (
        <div className="connect-container">
          <h2>Conectar Wallet de Extensión</h2>
          <p>Conecte su wallet de Polkadot.js o SubWallet para continuar</p>
          <button 
            onClick={handleConnect}
            disabled={loading}
            className="connect-button"
          >
            {loading ? 'Conectando...' : 'Conectar Wallet'}
          </button>
        </div>
      ) : (
        <div className="wallet-container">
          <div className="wallet-header">
            <h2>Wallet Conectada</h2>
            <button 
              onClick={disconnect}
              className="disconnect-button"
            >
              Desconectar
            </button>
          </div>
          
          <div className="wallet-details">
            <p>Dirección: {wallet.address}</p>
            <p>Balance: {formatBalance(balance)} VARA</p>
          </div>
          
          <div className="transaction-form">
            <h3>Enviar VARA</h3>
            <div className="form-group">
              <label>Destinatario</label>
              <input
                placeholder="Dirección del destinatario"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                className="address-input"
              />
            </div>
            
            <div className="form-group">
              <label>Cantidad</label>
              <input
                type="number"
                placeholder="Cantidad en VARA"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0"
                step="0.001"
                className="amount-input"
              />
            </div>
            
            <button 
              onClick={handleSendTransaction}
              disabled={loading || !recipient || !amount}
              className="send-button"
            >
              {loading ? 'Enviando...' : 'Enviar VARA'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```
:::warning Compatibilidad
Asegúrese de que su aplicación se ejecute en un entorno seguro (HTTPS) para que las extensiones puedan comunicarse correctamente con ella. Las extensiones de wallet suelen bloquear las conexiones en entornos no seguros.
:::