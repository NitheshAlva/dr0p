'use server';

import { getFile } from "@/lib/file-service";

export const getFileAction = async (name: string, password?: string) => {
  try {
    const resp = await getFile(name,password);
    if (!resp || !resp.file ) {
      return { success: false, message: 'File not found or unavailable' };
    }
    return { success: true, file: resp.file, url: resp.url, isProtected: !!resp.file.password_hash, expiresAt: resp.file.expires_at };
  } catch (error) {
    console.error('Error fetching file:', error);
    if (error instanceof Error) {
      return { success: false, message: error.message || 'Failed to fetch file info' };
    }
    return { success: false, message: 'Error fetching file' };
  }
}