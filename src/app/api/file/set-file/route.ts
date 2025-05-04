import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export const POST=async(request:Request)=>{
    const {name,key,isProtected=false,password="",expiry=0,fileName,contentType} = await request.json()
    try {
            if(!name?.trim()||!key?.trim()||!fileName?.trim()||!contentType?.trim()){
                return NextResponse.json({success:false,message:"invalid input for route name or null file key"},{status:400})
            }
            const existingFile = await prisma.files.findUnique({
                where:{name}
            })
            if(existingFile){
                return NextResponse.json({success:false,message:"The route name for file is already used"},{status:400})
            }
            if(isProtected&&(!password?.trim()||password.length<6))
                return NextResponse.json({success:false,message:"Invalid password for the file"},{status:400})
    
            if(isNaN(expiry)||expiry<0||expiry>86400000)
                return NextResponse.json({success:false,message:"Invalid expiry for the file"},{status:400})
    
            const password_hash = isProtected? await bcrypt.hash(password,10):null
            const expires_at=new Date(Date.now() + expiry)
            await prisma.files.create({
                data:{
                    name,
                    file_key:key,
                    original_filename:fileName,
                    expires_at,
                    created_at:expiry?new Date(Date.now()):expires_at,
                    password_hash,
                    file_type:contentType
                }
            })
            return NextResponse.json({success:true,message:"file succesfully created"},{status:200})
    
        } catch (error) {
            console.log("Error: while uploading file at "+name+":"+error)
            return NextResponse.json({success:false,message:`Error while uploading file at /file/${name}`},{status:500})
        }
}