import { prisma } from "./prisma";
import bcrypt from 'bcryptjs';
import { generateDownloadUrl } from "./aws-s3";

export async function getFileInfo(name: string) {
  try {
    const file = await prisma.files.findUnique({
      where: { name }
    });

    if (!file || file?.password_hash) {
      return {
        isAvailable: !file,
        isProtected: file?.password_hash ? true : false,
        expiresAt: file?.expires_at
      };
    }

    const url = await generateDownloadUrl({key:file.file_key,fileName:file.original_filename,fileType:file.file_type})
    

    if (file.expires_at.getTime() === file.created_at.getTime()) {
      await prisma.files.delete({
        where: { name }
      });
    }

    return {
      isAvailable: false,
      isProtected: false,
      file,
      url
    };

  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message || 'Failed to fetch file info' };
    }
    return { success: false, message: 'Failed to fetch file info' };
  }
}


export const getFile = async (name: string, password?: string) => {
  try {
    const file = await prisma.files.findUnique({
      where: { name }
    });

    if (!file) throw new Error('File not found');

    if (file.password_hash) {
      if (!password?.trim()) throw new Error("Password cannot be empty as it is protected");
      const isValid = await bcrypt.compare(password, file.password_hash);
      if (!isValid) throw new Error("Invalid password, try again");
    }

    const url = await generateDownloadUrl({key:file.file_key,fileName:file.original_filename,fileType:file.file_type})

    if (file.expires_at.getTime() === file.created_at.getTime()) {
      await prisma.files.delete({
        where: { name }
      });
    }

    if (file.password_hash) file.password_hash = '1';
    
    return { ok: true, file, url };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to fetch file' );
    }
    throw new Error('Failed to fetch file');
  }
}
