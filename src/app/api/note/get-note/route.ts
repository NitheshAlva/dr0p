import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { nameValidation } from "@/schema/name.schema"


export const POST= async(request:Request)=>{
    const {name,password} = await request.json()
    try {
        const validation = nameValidation.safeParse(name)
        if(!validation.success)
            return NextResponse.json({success:false,message:"invalid route name for note"+validation.error},{status:400})
        const note = await prisma.notes.findUnique({
            where:{name}
        })
        if(!note)
            return NextResponse.json({success:false,message:"note name does not exist"},{status:400})
        if(note.password_hash){
            if(!password?.trim())
                return NextResponse.json({success:true,message:"password cannot be empty as it is protected"},{status:200})
            const isValid = await bcrypt.compare(password,note.password_hash)
            if(!isValid)
                return NextResponse.json({success:false,message:"invalid password, try again"},{status:400})
        }
        if(note.expires_at.getTime()===note.created_at.getTime()){   
            // console.log("yess")
            await prisma.notes.delete({
                where:{name}
            })
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {password_hash:_,created_at:__,...cleanNote}=note
        return NextResponse.json({success:true,note:cleanNote,message:"note fetched successfully"},{status:200})
    } catch (error) {
        console.log("Error while getting info of note: ",error)
        return  NextResponse.json({success:false,message:"Error while getting note"},{status:500})
    }
}