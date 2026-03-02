import multer from "multer"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    // Sanitize filename: remove spaces and special characters
    const sanitizedFilename = file.originalname.replace(/\s+/g, '-').replace(/[^\w.-]/g, '');
    cb(null, `${Date.now()}-${sanitizedFilename}`)
  },
})

// file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only .jpeg, .jpg and .png formats are allowed"), false)
  }
}

const upload = multer({ storage, fileFilter })

export default upload
