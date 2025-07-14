import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { noteSchema } from '@/schema/note.schema'
import * as z from 'zod'

export async function getNoteInfo(name: string) {
  try {
    const note = await prisma.notes.findUnique({
        where:{name}
    })
    if(!note||note?.password_hash)
        return {
        isAvailable: !note,
        isProtected: note?.password_hash ? true : false,
        expiresAt: note?.expires_at,
        }
    if(note.expires_at.getTime()===note.created_at.getTime()){   
            await prisma.notes.delete({
                where:{name}
            })
    }
    
    return {
        isAvailable: false,
        isProtected: false,
        note
    }

  } catch (error) {
    if (error instanceof Error) {
        return {ok:false,message:error.message || 'Failed to fetch note info'};
       }
       return {ok:false,message:'Failed to fetch note info'};
  }
}

export async function getNote(name: string,password?: string ) {
  try {
        const note = await prisma.notes.findUnique({
            where:{name}
        })
        if (!note)
            throw new Error('Note not found')
        if(note.password_hash){
            if(!password?.trim())
                throw new Error("password cannot be empty as it is protected")
            const isValid = await bcrypt.compare(password,note.password_hash)
            if(!isValid)
                throw new Error("invalid password, try again")
        }
        if(note.expires_at.getTime()===note.created_at.getTime()){
            await prisma.notes.delete({
                where:{name}
            })
        }
        if(note.password_hash)
            note.password_hash='1'
        return {ok:true,note}
    }
    catch (error) {
       if (error instanceof Error) {
        return {ok:false,message:error.message || 'Failed to fetch note'};
       }
       return {ok:false,message:'Failed to fetch note'};
    }
}


export const createNote = async (data:z.infer<typeof noteSchema>) => {
    try {
            const existingNote = await prisma.notes.findUnique({
                where:{name:data.name}
            })
            if(existingNote){
                throw new Error("The route name for note is already used")
            }
            if(data.isProtected&&(!data.password?.trim()||data.password.length<6))
                throw new Error("Invalid password for the note")
    
            if(isNaN(data.expiry)||data.expiry<0||data.expiry>86400000)
                throw new Error("Invalid expiry for the note")
    
            const password_hash = data.isProtected? await bcrypt.hash(data.password,10):null
            const expires_at=new Date(Date.now() + data.expiry)
            await prisma.notes.create({
                data:{
                    name:data.name,
                    content:data.content,
                    expires_at,
                    created_at:data.expiry?new Date(Date.now()):expires_at,
                    password_hash,
                }
            })
    
    } catch (error) {
        throw new Error(`Error while inserting note at /note/${data.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}