import { UploadStore } from './upload.store';

export function startUploadCleanupJob() {
  setInterval(() => {
    UploadStore.cleanupExpired();
  }, 5 * 60 * 1000); // every 5 minutes
}
