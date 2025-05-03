import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const region = process.env.AWS_S3_REGION
const accessKeyId = process.env.AWS_S3_ACCESS_KEY;
const secretAccessKey = process.env.AWS_S3_SECRET_PASS;
const s3BucketName = process.env.AWS_S3_BUCKET_NAME;

if(!region||!accessKeyId||!secretAccessKey||!s3BucketName)
    throw new Error("Error: undifined environment variables")

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  signingRegion: region,
})


export async function generateUploadUrl({
  key,
  contentType,
  contentLength,
}: {
  contentLength: number
  contentType: string
  key: string
}) {
  const url = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: s3BucketName,
      Key: key,
      ContentType: contentType,
      ContentLength: contentLength,
    }),
    { expiresIn: 3600 }
  )

  return url
}

export async function generateDownloadUrl({ key,fileName,fileType }: { key: string,fileName:string,fileType:string }) {
  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: s3BucketName,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${fileName}"`,
      ResponseContentType: fileType,
    }),
    { expiresIn: 3600 }
  )

  return url
}