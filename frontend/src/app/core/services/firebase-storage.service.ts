import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  private storage;

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.storage = getStorage(app);
  }

  async subirImagenBase64(empresaId: number, codigoBarra: string, base64Image: string): Promise<string> {
    try {
      // Remover el prefijo data:image/jpeg;base64, si existe
      let base64Data = base64Image;
      if (base64Image.includes(',')) {
        base64Data = base64Image.split(',')[1];
      }

      // Crear referencia en la ruta: empresa_X/productos/123456789.jpg
      const ruta = `empresa_${empresaId}/productos/${codigoBarra}.jpg`;
      const storageRef = ref(this.storage, ruta);

      // Subir la imagen
      await uploadString(storageRef, base64Data, 'base64', {
        contentType: 'image/jpeg',
      });

      // Obtener URL pública
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error subiendo imagen a Firebase:", error);
      throw error;
    }
  }
}
