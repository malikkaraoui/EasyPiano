import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

const MAX_SIZE = 500 * 1024; // 500KB

export async function uploadProPhoto(proId, file) {
  if (file.size > MAX_SIZE * 4) {
    throw new Error("Image trop volumineuse (max 2MB avant compression)");
  }

  const compressed = await compressImage(file);
  const storageRef = ref(
    storage,
    `professionals/${proId}/photo.${getExtension(file.name)}`,
  );
  const snapshot = await uploadBytes(storageRef, compressed);
  const url = await getDownloadURL(snapshot.ref);

  return { url, path: snapshot.ref.fullPath };
}

export async function deleteProPhoto(path) {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

function getExtension(filename) {
  return filename.split(".").pop().toLowerCase();
}

async function compressImage(file) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const maxDim = 800;
      let { width, height } = img;

      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8);
    };

    img.src = URL.createObjectURL(file);
  });
}
