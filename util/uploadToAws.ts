import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import {
  GetObjectAclCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3 } from "./s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
async function downloadImage(url: string): Promise<Buffer> {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    return Buffer.from(response.data, "binary");
  } catch (error) {
    throw error;
  }
}

export const uploadToAws = async (image: string, userId: string) => {
  const key = `frames/${userId}/${uuidv4()}.png`;

  const pngImage = await convertSvgToPng(image);

  const putCommand = new PutObjectCommand({
    Bucket: process.env.AMAZON_AWS_BUCKET_NAME,
    Key: key,
    Body: pngImage.pngBuffer,
    ContentType: "image/png",
  });

  try {
    await s3.send(putCommand);
    const getObjectParams = {
      Bucket: process.env.AMAZON_AWS_BUCKET_NAME,
      Key: key,
    };
    const command = new GetObjectCommand(getObjectParams);
    const presignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });

    const uploadedImageBuffer = await downloadImage(presignedUrl);
    const metaData = await sharp(uploadedImageBuffer).metadata;
    
  } catch (error) {}
};

async function convertSvgToPng(
  svgString: string
): Promise<{ pngBuffer: Buffer }> {
  const image = sharp(Buffer.from(svgString)).png().trim({ threshold: 10 });

  const pngBuffer = await image.toBuffer();

  return { pngBuffer };
}
