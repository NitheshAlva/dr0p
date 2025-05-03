import { NextResponse } from "next/server"
import  {generateUploadUrl} from '@/lib/aws-s3'

export const GET=async(request:Request)=>{
    const {searchParams} = new URL(request.url)
    const fileName = searchParams.get('fileName')
    const contentType = searchParams.get('contentType')
    const contentLength = searchParams.get('contentLength')
    if(!fileName?.trim()||!contentLength?.trim()||!contentType?.trim())
        return NextResponse.json({success:false,message:"invalid arguments in the request"},{status:400})

    const key=`upload/${fileName}${Date.now()}`
    const len=Number(contentLength)
    try {
        const url = await generateUploadUrl({key,contentLength:len,contentType})
        return NextResponse.json({success:true,message:"successfully generated upload object url",data:{url,key}},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false,message:"Error while generating presigned url to upload into s3 bucket"},{status:500})
    }
}