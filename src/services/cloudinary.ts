/**
 * cloudinary.ts
 * Direct upload service using Cloudinary's unsigned upload API.
 *
 * WHY UNSIGNED:
 *   Signed uploads require a server-side signature endpoint.
 *   For hackathon MVP, unsigned upload with a restricted preset is sufficient.
 *   The preset is configured in Cloudinary Console to: allow images only,
 *   max 10 MB, auto-delete after 24 hours.
 *
 * HOW TO SET UP THE PRESET IN CLOUDINARY CONSOLE:
 *   1. Settings → Upload → Upload Presets → Add upload preset
 *   2. Preset name: glowtwin_uploads  (must match VITE_CLOUDINARY_UPLOAD_PRESET)
 *   3. Signing Mode: Unsigned
 *   4. Folder: glowtwin/uploads
 *   5. Allowed formats: jpg, jpeg, png, webp, heic
 *   6. Max file size: 10 MB
 *   7. Auto-tagging: disabled
 *   8. Save
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string

export interface CloudinaryUploadResult {
  secure_url: string   // HTTPS URL — stored in Firestore, passed to Gemini
  public_id: string    // e.g. "glowtwin/uploads/abc123" — stored for deletion
  width: number
  height: number
  bytes: number
  format: string
}

export class CloudinaryUploadError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly cloudinaryError?: string,
  ) {
    super(message)
    this.name = 'CloudinaryUploadError'
  }
}

/**
 * Upload a File or Blob directly to Cloudinary.
 * Returns { secure_url, public_id } on success.
 * Throws CloudinaryUploadError on failure.
 */
export async function uploadToCloudinary(
  file: File | Blob,
  options?: {
    onProgress?: (pct: number) => void
    signal?: AbortSignal
  },
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME) {
    throw new CloudinaryUploadError(
      'VITE_CLOUDINARY_CLOUD_NAME is not set. Add it to .env.local.',
    )
  }
  if (!UPLOAD_PRESET) {
    throw new CloudinaryUploadError(
      'VITE_CLOUDINARY_UPLOAD_PRESET is not set. Add it to .env.local.',
    )
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  // Tag so images are easy to find / bulk-delete in Cloudinary Console
  formData.append('tags', 'glowtwin,user-upload')

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Progress tracking — used by upload zone progress bar
    if (options?.onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          options.onProgress!(Math.round((e.loaded / e.total) * 100))
        }
      })
    }

    // Abort support
    if (options?.signal) {
      options.signal.addEventListener('abort', () => {
        xhr.abort()
        reject(new CloudinaryUploadError('Upload cancelled.'))
      })
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText) as CloudinaryUploadResult
          resolve(data)
        } catch {
          reject(new CloudinaryUploadError('Unexpected response from Cloudinary.', xhr.status))
        }
      } else {
        let cloudinaryError = ''
        try {
          const err = JSON.parse(xhr.responseText)
          cloudinaryError = err?.error?.message ?? ''
        } catch {}
        reject(
          new CloudinaryUploadError(
            `Cloudinary upload failed (${xhr.status}). ${cloudinaryError}`,
            xhr.status,
            cloudinaryError,
          ),
        )
      }
    })

    xhr.addEventListener('error', () => {
      reject(new CloudinaryUploadError('Network error during upload. Check your connection.'))
    })

    xhr.addEventListener('abort', () => {
      reject(new CloudinaryUploadError('Upload aborted.'))
    })

    xhr.open('POST', url)
    xhr.send(formData)
  })
}

/**
 * Convenience: upload a data URL string (e.g. from FileReader.readAsDataURL).
 * Converts to Blob first so the same uploadToCloudinary function handles it.
 */
export async function uploadDataUrlToCloudinary(
  dataUrl: string,
  filename = 'upload.jpg',
  options?: Parameters<typeof uploadToCloudinary>[1],
): Promise<CloudinaryUploadResult> {
  const blob = dataUrlToBlob(dataUrl)
  const file = new File([blob], filename, { type: blob.type })
  return uploadToCloudinary(file, options)
}

/** Convert base64 data URL → Blob */
function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg'
  const binary = atob(base64)
  const buffer = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i)
  return new Blob([buffer], { type: mime })
}

/**
 * Build a Cloudinary transformation URL.
 * Used to generate optimized thumbnails for display.
 *
 * Example:
 *   getCloudinaryUrl('glowtwin/uploads/abc123', { width: 200, height: 267, crop: 'fill' })
 *   → https://res.cloudinary.com/<cloud>/image/upload/w_200,h_267,c_fill/glowtwin/uploads/abc123
 */
export function getCloudinaryUrl(
  publicId: string,
  transforms?: { width?: number; height?: number; crop?: string; quality?: string },
): string {
  const t: string[] = []
  if (transforms?.width) t.push(`w_${transforms.width}`)
  if (transforms?.height) t.push(`h_${transforms.height}`)
  if (transforms?.crop) t.push(`c_${transforms.crop}`)
  if (transforms?.quality) t.push(`q_${transforms.quality}`)
  const tStr = t.length ? `${t.join(',')}/` : ''
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${tStr}${publicId}`
}
