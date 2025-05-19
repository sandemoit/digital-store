import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { toast } from 'sonner';

export default function FileUploader({ onUploadComplete }: { onUploadComplete?: (url: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Silakan pilih file terlebih dahulu');
      return;
    }

    // Validasi ukuran file (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File terlalu besar. Maksimal 10MB');
      return;
    }

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/zip', 'application/x-zip-compressed'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format file tidak didukung');
      return;
    }

    setUploading(true);
    setProgress(0);

    // Buat referensi untuk file di Firebase Storage
    const storageRef = ref(storage, `products/${file.name}`);

    // Mulai proses upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Monitor progres upload
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        setError('Terjadi kesalahan saat upload: ' + error.message);
        setUploading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setDownloadURL(url);
          setUploading(false);

          if (onUploadComplete) {
            onUploadComplete(url);
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError('Terjadi kesalahan saat mendapatkan URL: ' + error.message);
          } else {
            setError('Terjadi kesalahan saat mendapatkan URL: ' + String(error));
          }
          setUploading(false);
        }
      }
    );
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h3 className="text-lg font-medium mb-2">Upload Produk Digital</h3>
      <p className="text-sm text-gray-500">Unggah File disini (format: zip, jpeg, png, pdf, max 10MB)</p>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="flex-1">
            <input
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-orange-50 file:text-orange-700
          hover:file:bg-orange-100
          disabled:opacity-50"
            />
          </label>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white
          ${!file || uploading
                ? 'bg-gray-400 cursor-not-allowed border-gray-400'
                : 'bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700'}`}
          >
            {uploading ? 'Mengupload...' : 'Upload'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-orange-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            >
              <span className="text-sm text-gray-600 mt-2 block">{progress}%</span>
            </div>
          </div>
        )}

        {downloadURL && (
          <div className="mt-6 p-4 bg-green-50 border rounded-md">
            <p className="text-green-700 font-medium mb-2">File berhasil diupload!</p>
            <div className="break-all">
              <strong className="text-gray-700">URL File:</strong>
              <a
                href={downloadURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-800 block mt-1"
              >
                {downloadURL}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
