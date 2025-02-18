---
sidebar_position: 1
---

# useWalletManagement

Hook para gestionar wallets en la red Vara.

## Estados

```js
const {
  wallet,        // Información del wallet actual
  account,       // Información de la cuenta
  loading,       // Estado de carga
  error,         // Estado de error
  balance,       // Balance actual
  transactions,  // Historial de transacciones
} = useWalletManagement()
```

### wallet

Representa el estado de la wallet actual. Puede ser de dos tipos:

#### Wallet Local
```javascript
{
  address: string,     // Dirección de la wallet
  mnemonic: string,    // Frase semilla (12 palabras)
  publicKey: string,   // Clave pública
  isConnected: boolean,
  type: 'local'        // Identificador de tipo local
}
```

La wallet local se genera utilizando el formato sr25519 con ss58Format: 42, lo que permite:

Control total sobre la wallet sin dependencias externas
Gestión programática de transacciones
Almacenamiento local seguro
Perfecto para automatizaciones y testing

:::tip
Las wallets locales son ideales cuando necesitas control programático completo sobre las operaciones de la wallet.
:::

### Wallet de Extensión

```javascript
{
  address: string,     // Dirección de la wallet
  name: string,        // Nombre de la cuenta en la extensión
  isConnected: boolean,
  type: 'extension'    // Identificador de tipo extensión
}
```

### account

Estado proporcionado por **@gear-js/react-hooks** que representa la conexión con wallets de extensión como Polkadot.js o similares.

```javascript
{
  decodedAddress: string,  // Dirección decodificada
  meta: {
    name: string,          // Nombre de la cuenta
    source: string         // Fuente de la extensión
  }
}

```

:::note
El estado account solo estará disponible cuando se utilice una wallet de extensión. Para wallets locales, este valor será null.
:::

### loading

Indicador de estado de carga para operaciones asíncronas:

- Generación de wallet
- Envío de transacciones
- Carga de balance
- Operaciones de firma


```javascript
const { loading } = useWalletManagement()
```

### error

Sistema de gestión de errores que captura y expone errores relacionados con:

- Generación de wallet
- Validación de direcciones
- Transacciones fallidas
- Problemas de conexión
- Errores de firma
```javascript
const { error } = useWalletManagement()
```

### transactions
```javascript
const { transactions } = useWalletManagement()
```

:::tip Consejo de Implementación
Para mantener un historial persistente, considera almacenar las transacciones en localStorage o una base de datos externa.
:::

### balance
Estado que mantiene el balance actualizado de la wallet actual:

- Se actualiza automáticamente
- Formato BigInt para precisión
- Incluye utilidades de formateo

```javascript
const { balance, formatBalance } = useWalletManagement()
// balance: string (en formato raw)
// Ejemplo de uso: formatBalance(balance) // "1.234 VARA"
```

### Ejemplo de Uso Completo

```js

function WalletManager() {
  const {
    wallet,
    account,
    loading,
    error,
    balance,
    transactions,
    generateNewSeed,
    generateWalletFromSeed
  } = useWalletManagement()

  const handleCreateWallet = async () => {
    const seed = generateNewSeed()
    if (seed) {
      await generateWalletFromSeed(seed)
    }
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {wallet ? (
        <div>
          <h3>Wallet Conectada</h3>
          <p>Tipo: {wallet.type}</p>
          <p>Dirección: {wallet.address}</p>
          <p>Balance: {formatBalance(balance)}</p>
          
          {transactions.length > 0 && (
            <div>
              <h4>Últimas Transacciones</h4>
              {transactions.map(tx => (
                <div key={tx.hash}>
                  {tx.amount} VARA → {tx.to}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button onClick={handleCreateWallet}>
          Crear Nueva Wallet
        </button>
      )}
    </div>
  )
}

```

:::warning Importante
Nunca almacenes mnemonics en texto plano o expongas claves privadas. Siempre utiliza almacenamiento seguro y encriptación cuando sea necesario.
:::