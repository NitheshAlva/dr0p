import { generateDownloadUrl } from "@/lib/aws-s3"
import { prisma } from "@/lib/prisma"
import { nameValidation } from "@/schema/name.schema"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export const POST = async(request:Request)=>{
     const {name,password} = await request.json()
        try {
            const validation = nameValidation.safeParse(name)
            if(!validation.success)
                return NextResponse.json({success:false,message:"invalid route name for file "+validation.error},{status:400})
            const file = await prisma.files.findUnique({
                where:{name}
            })
            if(!file)
                return NextResponse.json({success:false,message:"file name does not exist"},{status:400})
            if(file.password_hash){
                if(!password?.trim())
                    return NextResponse.json({success:true,message:"password cannot be empty as it is protected"},{status:200})
                const isValid = await bcrypt.compare(password,file.password_hash)
                if(!isValid)
                    return NextResponse.json({success:false,message:"invalid password, try again"},{status:400})
            }

            const url = await generateDownloadUrl({key:file.file_key,fileName:file.original_filename,fileType:file.file_type})
            
            if(file.expires_at.getTime()===file.created_at.getTime()){   
                await prisma.files.delete({
                    where:{name}
                })
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {password_hash:_,created_at:__,...cleanFile}=file

            return NextResponse.json({success:true,url,file:cleanFile,message:" file fetched successfully"},{status:200})
        } catch (error) {
            console.log("Error while getting info of "+name+" file: ",error)
            return  NextResponse.json({success:false,message:"Error while getting file"},{status:500})
        }
}