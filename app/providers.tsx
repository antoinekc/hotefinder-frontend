// app/providers.tsx
// Permet de rendre le store redux accessible à tous les composants de l'application Next.js.
// Sans provider on ne pourrait pas utiliser useSelector et useDispatch


'use client'
import { Provider } from 'react-redux'
import { store, persistor } from './store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}