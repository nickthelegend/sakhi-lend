import { useEffect } from 'react';
import { useAlgorandSigner } from './use-algorand-signer';

export function useUserSync() {
  const { activeAddress } = useAlgorandSigner();

  useEffect(() => {
    async function syncUser() {
      if (!activeAddress) return;

      try {
        const response = await fetch(`/api/user/${activeAddress}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             // Default metadata for new users found on-chain
             name: `Sakhi ${activeAddress.slice(0, 4)}`,
             role: 'borrower' 
          }),
        });
        
        if (response.ok) {
           console.log('✅ User synced to MongoDB');
        }
      } catch (err) {
        console.error('❌ Sync failed:', err);
      }
    }

    syncUser();
  }, [activeAddress]);
}
