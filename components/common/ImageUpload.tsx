import React, { useState, useRef, DragEvent } from 'react';
import { uploadFile } from '../../services/firebaseService';
import notificationService from '../../services/notificationService';

interface ImageUploadProps {
    onUploadComplete: (url: string) => void;
    uploadPath?: string;
}

const ImageUpload = ({ onUploadComplete, uploadPath = 'images' }: ImageUploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | ''>('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (selectedFile: File | null) => {
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setUploadStatus('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
            handleUpload(selectedFile);
        } else if (selectedFile) {
            notificationService.showToast('Invalid file type. Please select an image.', 'error');
        }
    };

    const handleUpload = async (fileToUpload: File) => {
        setIsUploading(true);
        setUploadProgress(0);
        try {
            const downloadURL = await uploadFile(
                fileToUpload,
                uploadPath,
                (progress) => setUploadProgress(progress)
            );
            setUploadStatus('success');
            onUploadComplete(downloadURL);
        } catch (error) {
            setUploadStatus('error');
            notificationService.showToast('Image upload failed.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setFile(null);
        setPreviewUrl(null);
        setUploadProgress(0);
        setUploadStatus('');
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFileChange(droppedFile);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="image-upload-container">
            <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                ref={fileInputRef}
                style={{ display: 'none' }}
                disabled={isUploading}
            />
            {!previewUrl && (
                <div
                    className={`drop-zone ${isDragging ? 'active' : ''}`}
                    onClick={triggerFileSelect}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <p>Drag & Drop an image here, or click to select a file.</p>
                </div>
            )}
            {previewUrl && (
                <div className="image-preview">
                    <img src={previewUrl} alt="Scrap preview" />
                    {!isUploading && (
                         <button onClick={handleRemoveImage} className="remove-image-btn" aria-label="Remove image">&times;</button>
                    )}
                </div>
            )}
            {(isUploading || uploadStatus) && (
                <div className="upload-progress-container">
                    <div className="upload-progress-bar">
                        <div style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    {uploadStatus && (
                        <p className={`upload-status ${uploadStatus}`}>
                            {uploadStatus === 'success' ? 'Upload complete!' : 'Upload failed.'}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;