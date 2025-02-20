---
sidebar_position: 1
---

# useLocalWallet

Hook para gestionar wallets locales en la red Vara.

## Estados

```js
const {
  wallet,        // Información del wallet local
  loading,       // Estado de carga
  error,         // Estado de error
  balance,       // Balance actual
  transactions,  // Historial de transacciones
  isApiReady,    // Disponibilidad de la API de Vara
  hasWallet      // Flag que indica si existe una wallet
} = useLocalWallet()
```
### Wallet
Representa la información de la wallet local actual:
```js
{
  mnemonic: string,    // Frase semilla (12 palabras)
  address: string,     // Dirección de la wallet
  publicKey: string,   // Clave pública en formato hex
  isConnected: boolean,
  type: 'local'        // Identificador de tipo local
}
```
:::note
La wallet local se genera utilizando el formato sr25519 con ss58Format: 42, lo que permite:
- Control total sobre la wallet sin dependencias externas
- Gestión programática de transacciones
- Almacenamiento local seguro (en localStorage)
- Persistencia entre sesiones de navegación
:::

:::tip
Las wallets locales son ideales para aplicaciones que necesitan mantener el estado entre sesiones sin requerir interacción constante del usuario para firmar transacciones.
:::

### loading
Indicador booleano que señala si una operación asíncrona está en curso:

- Generación o carga de wallet
- Envío de transacciones
- Carga de balance

```js
const { loading } = useLocalWallet()
```
### error
Sistema de captura y exposición de errores relacionados con operaciones de wallet:

- Errores de generación o carga de wallet
- Errores de validación de semillas
- Fallos en transacciones
- Problemas de API

### balance
Balance actual de la wallet en formato raw. Requiere formateo para visualización:
```js
const { balance, formatBalance } = useLocalWallet()
// Ejemplo: formatBalance(balance) // "1.234"
```
### transactions
Historial de transacciones realizadas durante la sesión actual:
```js
const { transactions } = useLocalWallet()

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

### loadStoredWallet

```js
const { loadStoredWallet } = useLocalWallet()
```
Carga automáticamente una wallet previamente almacenada en localStorage al inicializar el hook.

### generateNewSeed
```js
const { generateNewSeed } = useLocalWallet()

// Uso:
const seed = generateNewSeed()
// Resultado: "word1 word2 word3 ... word12"
```
Genera una nueva frase semilla (mnemónica) de 12 palabras utilizando el estándar BIP39.

### validateSeed
```js
const { validateSeed } = useLocalWallet()

// Uso:
const isValid = validateSeed(seedPhrase)
// Resultado: true | false
```
Valida que una frase semilla cumpla con el formato y checksum requeridos.

### generateWalletFromSeed
```js
const { generateWalletFromSeed } = useLocalWallet()

// Uso:
const newWallet = await generateWalletFromSeed(seedPhrase)
```

Crea una nueva wallet a partir de una semilla, la establece como activa y la guarda en localStorage.

### sendTransaction
```js
const { sendTransaction } = useLocalWallet()

// Uso:
const hash = await sendTransaction(destinationAddress, amount)
```

Envía una transacción a la dirección especificada por el monto indicado. El monto debe ser un BigInt en unidades raw (1 VARA = 1e12 unidades).

:::note
Esta funcionalidad se sigue desarrollando y testeando.
:::

### disconnect
```js
const { disconnect } = useLocalWallet()

// Uso:
disconnect()
```
Elimina la wallet del estado y del localStorage.

### isValidAddress
```js
const { isValidAddress } = useLocalWallet()

// Uso:
const valid = isValidAddress(address)
// Resultado: true | false
```
Verifica que una dirección tenga el formato correcto de Vara.

### formatBalance
```js
const { formatBalance } = useLocalWallet()

// Uso:
const readableBalance = formatBalance(rawBalance)
// Ejemplo: formatBalance("1000000000000") => "1"
```
Convierte un balance en formato raw (en unidades mínimas) a VARA.

### getTransactionHistory
```js
const { getTransactionHistory } = useLocalWallet()

// Uso:
const history = getTransactionHistory()
```
Obtiene el historial de transacciones realizadas en la sesión actual.

### Ejemplo de Uso Completo
```js
function LocalWalletManager() {
  const {
    wallet,
    loading,
    error,
    balance,
    isApiReady,
    generateNewSeed,
    generateWalletFromSeed,
    formatBalance,
    disconnect,
    sendTransaction
  } = useLocalWallet();

  const [seed, setSeed] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleCreateWallet = async () => {
    if (!seed) {
      const newSeed = generateNewSeed();
      setSeed(newSeed);
    } else {
      try {
        await generateWalletFromSeed(seed);
        setSeed("");
      } catch (error) {
        // Error ya manejado por el hook
      }
    }
  };

  const handleSendTransaction = async () => {
    if (!recipient || !amount) return;
    
    try {
      // Convertir a unidades raw 
      const rawAmount = BigInt(parseFloat(amount) * 1e12);
      const hash = await sendTransaction(recipient, rawAmount);
      console.log("Transacción enviada:", hash);
      setRecipient("");
      setAmount("");
    } catch (error) {
      // Error ya manejado por el hook aplica tu logica
    }
  };

  if (!isApiReady) return <div>Conectando a la red Vara...</div>;

  return (
    <div>
      {loading && <div>Cargando...</div>}
      {error && <div className="error">{error}</div>}

      {wallet ? (
        <div className="wallet-info">
          <h2>Wallet Local</h2>
          <p>Dirección: {wallet.address}</p>
          <p>Balance: {formatBalance(balance)} VARA</p>
          
          <div className="send-form">
            <h3>Enviar VARA</h3>
            <input
              placeholder="Dirección del destinatario"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
            />
            <input
              type="number"
              placeholder="Cantidad en VARA"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="0"
              step="0.001"
            />
            <button 
              onClick={handleSendTransaction}
              disabled={loading}
            >
              Enviar
            </button>
          </div>
          
          <button onClick={disconnect}>Desconectar Wallet</button>
        </div>
      ) : (
        <div className="create-wallet">
          <h2>Crear Wallet Local</h2>
          <textarea
            placeholder="Ingrese semilla (12 palabras) o genere una nueva"
            value={seed}
            onChange={e => setSeed(e.target.value)}
            rows={3}
          />
          <button onClick={handleCreateWallet}>
            {seed ? "Crear Wallet" : "Generar Semilla"}
          </button>
        </div>
      )}
    </div>
  );
}
```

:::warning Importante
Nunca almacenes mnemonics en texto plano o expongas claves privadas en código público. La implementación actual utiliza localStorage que no es totalmente seguro para almacenamiento de claves privadas en entornos de producción.
:::

:::tip Mejores Prácticas

- Considera cifrar la semilla antes de almacenarla
- Implementa tiempo de expiración para la sesión de wallet
- Añade confirmación por contraseña para operaciones sensibles
- Para aplicaciones en producción, considera utilizar wallets de extensión como alternativa más segura
:::