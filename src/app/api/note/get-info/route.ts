import  {prisma} from '@/lib/prisma'
import { NextResponse } from 'next/server'


export const GET= async(request:Request)=>{
    const {searchParams} = new URL(request.url)
    const name = searchParams.get('name')
    try {
        if(!name?.trim())
            return NextResponse.json({success:false,message:"Invalid name for note route"},{status:400})
        
        const note = await prisma.notes.findUnique({
            where:{name}
        })
        if(!note)
            return NextResponse.json({success:true,data:{isAvailable:true,isProtected:false},message:"route name for note is available"},{status:200})
        
        return NextResponse.json({success:true,data:{isAvailable:false,isProtected:note?.password_hash?true:false},message:"route name info for note fetched successfully"},{status:200})
    } catch (error) {
        console.log("Error while getting info of "+name+" note: ",error)
        return  NextResponse.json({success:false,message:"Error while getting note info!"},{status:500})
    }
}
