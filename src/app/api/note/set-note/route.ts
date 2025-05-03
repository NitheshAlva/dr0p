import { NextResponse } from "next/server"
import  {prisma} from '@/lib/prisma'
import bcrypt from "bcryptjs"

export const POST = async (request:Request)=>{

    const {name,content,isProtected=false,password=null,expiry=0} = await request.json()
    try {
        if(!name?.trim()||!content?.trim()){
            return NextResponse.json({success:false,message:"invalid input for route name or null content"},{status:400})
        }
        const existingNote = await prisma.notes.findUnique({
            where:{name}
        })
        if(existingNote){
            return NextResponse.json({success:false,message:"The route name for note is already used"},{status:400})
        }
        if(isProtected&&(!password?.trim()||password.length<6))
            return NextResponse.json({success:false,message:"Invalid password for the note"},{status:400})

        if(isNaN(expiry)||expiry<0||expiry>86400000)
            return NextResponse.json({success:false,message:"Invalid expiry for the note"},{status:400})

        const password_hash = isProtected? await bcrypt.hash(password,10):null
        const expires_at=new Date(Date.now() + expiry)
        const newNote = await prisma.notes.create({
            data:{
                name,
                content,
                expires_at,
                created_at:expiry?new Date(Date.now()):expires_at,
                password_hash,
            }
        })
        return NextResponse.json({success:true,message:"note succesfully created"},{status:200})

    } catch (error) {
        console.log("Error: while inserting note at "+name+":"+error)
        return NextResponse.json({success:false,message:`Error while inserting note at /note/${name}`},{status:500})
    }
}