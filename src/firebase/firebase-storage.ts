// Create: /lib/firebase-storage.ts
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export async function getFirebasePdfUrl(storagePath: string): Promise<string> {
  const storage = getStorage();
  const fileRef = ref(storage, storagePath);
  return await getDownloadURL(fileRef);
}