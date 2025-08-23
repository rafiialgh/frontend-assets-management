'use client';

import { cn } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { AlertCircle, ImagePlus, X } from 'lucide-react';

interface FileWithPreview extends File {
  preview: string;
}

interface DropzoneInputProps {
  // Menerima `onChange` dari React Hook Form Controller
  onChange: (files: File[]) => void;
  // Menerima `value` untuk menampilkan preview yang sudah ada
  value?: File[];
  className?: string;
  accept?: Accept;
  maxFiles?: number;
  disabled?: boolean;
}

export default function DropzoneInput({
  onChange,
  value = [],
  className,
  accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
  maxFiles = 5,
  disabled = false,
}: DropzoneInputProps) {
  // State lokal untuk menyimpan file beserta previewnya
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Gabungkan file yang sudah ada dengan yang baru, lalu batasi sesuai maxFiles
      const updatedFiles = [...value, ...acceptedFiles].slice(0, maxFiles);
      onChange(updatedFiles);
    },
    [onChange, value, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxFiles,
      disabled,
    });

  // Efek untuk membuat/menghapus URL preview saat `value` dari form berubah
  useEffect(() => {
    // Buat URL preview dari `value` (file) yang diberikan
    const newFilesWithPreview = value.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles(newFilesWithPreview);

    // Cleanup function untuk mencegah memory leak
    return () => {
      newFilesWithPreview.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [value]);

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    // Panggil onChange dengan array file yang sudah diperbarui
    onChange(updatedFiles);
  };

  const rejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.name} className='flex items-start text-sm text-red-500'>
      <AlertCircle className='w-4 h-4 mr-2 mt-0.5 flex-shrink-0' />
      {file.name} - {errors.map((e) => e.message).join(', ')}
    </li>
  ));

  return (
    <div className='flex gap-4'>
      <div className='flex-1'>
        <div
          {...getRootProps()}
          className={cn(
            'w-full h-48 flex items-center justify-center border-2 border-dashed rounded-md p-6 text-center transition-colors',
            disabled
              ? 'bg-gray-100 cursor-not-allowed opacity-50'
              : isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400',
            className
          )}
        >
          <div>
            <input {...getInputProps()} disabled={disabled} />
            <div className='flex flex-col items-center justify-center gap-2 text-gray-500'>
              <ImagePlus size={40} />
              {disabled ? (
                <p>Pilih kategori aset dulu sebelum upload</p>
              ) : isDragActive ? (
                <p>Drop files here ...</p>
              ) : (
                <p>
                  <span className='font-semibold'>
                    Drag and drop image here, or click to upload
                  </span>
                </p>
              )}
              <p className='text-xs'>PNG, JPG, JPEG, WEBP (Maks. 5MB)</p>
            </div>
          </div>
        </div>

        <div className='mt-2 flex justify-between items-center text-sm text-gray-600'>
          <p>
            Files uploaded:{' '}
            <strong>
              {files.length} / {maxFiles}
            </strong>
          </p>
        </div>

        {rejectionItems.length > 0 && (
          <ul className='mt-2 list-none p-0'>{rejectionItems}</ul>
        )}
      </div>

      {/* Area Preview */}
      {files.length > 0 && (
        <div className='w-80 h-fit flex-shrink-0 rounded-sm overflow-hidden'>
          {/* <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4> */}
          <div className='h-48 overflow-x-auto overflow-y-hidden'>
            <div className='flex gap-3 h-full pb-2'>
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className='relative flex-shrink-0 w-48 h-48 rounded-sm'
                >
                  <img
                    src={file.preview || '/placeholder.svg'}
                    alt={`Preview ${file.name}`}
                    className='w-full h-full object-cover rounded-md'
                  />
                  <button
                    type='button'
                    onClick={() => removeFile(index)}
                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm'
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
