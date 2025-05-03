import  {prisma} from '@/lib/prisma'
import { NextResponse } from 'next/server'


export const GET= async(request:Request)=>{
    const {searchParams} = new URL(request.url)
    const name = searchParams.get('name')
    try {
        if(!name?.trim())
            return NextResponse.json({success:false,message:"Invalid name for file route"},{status:400})
        
        const file = await prisma.files.findUnique({
            where:{name}
        })
        if(!file)
            return NextResponse.json({success:true,data:{isAvailable:true,isProtected:false},message:"route name for file is available"},{status:200})
        
        return NextResponse.json({success:true,data:{isAvailable:false,isProtected:file?.password_hash?true:false},message:"route name info for file fetched successfully"},{status:200})
    } catch (error) {
        console.log("Error while getting info of "+name+" file: ",error)
        return  NextResponse.json({success:false,message:"Error while getting file info!"},{status:500})
    }
}
