import { readdir, mkdir } from "node:fs/promises";
import * as path from "node:path";
import sharp from "sharp";

const baseDir =
  "/media/renderws/carltonData/cj_pics/pics2024/hiking/haslvPicnic/dslr";
const iDir = path.join(baseDir, "originals");
const oHalfDir = path.join(baseDir, "halfSize");

const getImagesFileNames = async () => {
  const files = await readdir(iDir);
  const imageFileName = files.filter((fn) =>
    /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fn)
  );
  return imageFileName;
};
const resizeImages = async (files: Array<string>) => {
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const fi = path.join(iDir, f);
    const fo = path.join(oHalfDir, f);
    const metadata = await sharp(fi).metadata();
    if (!metadata.width) {
      console.error("Skipping", f);
      continue;
    }
    const wo = metadata.width / 2;
    await sharp(fi).resize({ width: wo }).toFile(fo);
    console.log(f);
  }
};

const main = async () => {
  const files = await getImagesFileNames();
  const fd = Bun.file(oHalfDir);
  try {
    await readdir(oHalfDir);
  } catch {
    await mkdir(oHalfDir);
  }
  await resizeImages(files);
};

main()
  .then(() => console.log("Finished"))
  .catch((e) => console.error(e));
