import { useState, useCallback, useRef } from 'react';
import api from '../services/api';

interface ImageDropzoneProps {
    onImageUpload: (url: string) => void;
    currentImage?: string;
    category?: string;
}

export default function ImageDropzone({ onImageUpload, currentImage, category }: ImageDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const uploadFile = async (file: File) => {
        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Sadece PNG, JPG veya WEBP dosyaları yüklenebilir.');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
            return;
        }

        setError(null);
        setIsUploading(true);

        // Show preview immediately
        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);

        try {
            const formData = new FormData();
            formData.append('file', file);
            if (category) {
                formData.append('category', category);
            }

            const response = await api.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                const imageUrl = response.data.data.url;
                setPreviewUrl(imageUrl);
                onImageUpload(imageUrl);
            } else {
                throw new Error('Upload failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Yükleme başarısız oldu.');
            setPreviewUrl(currentImage || null);
        } finally {
            setIsUploading(false);
            // Cleanup local preview URL
            URL.revokeObjectURL(localPreview);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            uploadFile(files[0]);
        }
    }, [category, onImageUpload, currentImage]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            uploadFile(files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewUrl(null);
        onImageUpload('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
            />

            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative w-full h-40 rounded-xl border-2 border-dashed cursor-pointer
          transition-all duration-300 overflow-hidden
          ${isDragging
                        ? 'border-[#cfd4dc] bg-[#cfd4dc]/10 scale-[1.02]'
                        : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
                    }
          ${isUploading ? 'pointer-events-none opacity-70' : ''}
        `}
            >
                {previewUrl ? (
                    <>
                        {/* Preview Image */}
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <span className="text-white text-sm bg-black/50 px-3 py-1.5 rounded-lg">
                                Değiştirmek için tıklayın
                            </span>
                            <button
                                onClick={handleRemove}
                                className="text-red-400 bg-black/50 px-3 py-1.5 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                            >
                                Kaldır
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
                        {isUploading ? (
                            <>
                                <div className="w-8 h-8 border-2 border-white/20 border-t-[#cfd4dc] rounded-full animate-spin mb-2"></div>
                                <span className="text-sm">Yükleniyor...</span>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center mb-3 text-2xl">
                                    📷
                                </div>
                                <p className="text-sm mb-1">
                                    Resmi buraya sürükleyin
                                </p>
                                <p className="text-xs text-white/40">
                                    veya seçmek için tıklayın
                                </p>
                                <div className="mt-3 space-y-1 text-[10px] text-white/30">
                                    <p>📁 Kabul edilen: <span className="text-white/50">PNG, JPG, JPEG, WEBP</span></p>
                                    <p>📐 Önerilen boyut: <span className="text-white/50">800x600px - 1200x900px</span></p>
                                    <p>💾 Maksimum: <span className="text-white/50">5MB</span></p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-2 text-red-400 text-xs flex items-center gap-1">
                    <span>⚠️</span> {error}
                </div>
            )}
        </div>
    );
}
