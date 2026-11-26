import multer from 'multer';
import path from 'path';
import fs from 'fs';

const folder = 'uploads';
if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, folder),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024, files: 3 }, fileFilter: (_req, file, cb) => {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPG, PNG and WEBP images are allowed.'));
}});
export default upload;
