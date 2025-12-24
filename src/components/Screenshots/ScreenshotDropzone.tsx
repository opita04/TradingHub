import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Screenshot } from '../../types';
import { UploadCloud } from 'lucide-react';

interface ScreenshotDropzoneProps {
    onScreenshotsAdded: (screenshots: Screenshot[]) => void;
}

export function ScreenshotDropzone({ onScreenshotsAdded }: ScreenshotDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    // Handle file processing (convert to base64)
    const processFiles = useCallback((files: FileList | File[]) => {
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) {
                    const newScreenshot: Screenshot = {
                        id: uuidv4(),
                        data: result,
                        order: Date.now()
                    };
                    onScreenshotsAdded([newScreenshot]);
                }
            };
            reader.readAsDataURL(file);
        });
    }, [onScreenshotsAdded]);

    // Handle Paste
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            const imageFiles: File[] = [];
            for (const item of items) {
                if (item.type.indexOf('image') !== -1) {
                    const file = item.getAsFile();
                    if (file) imageFiles.push(file);
                }
            }

            if (imageFiles.length > 0) {
                processFiles(imageFiles);
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [processFiles]);

    // Drag and Drop handlers
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`
        border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer
        ${isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-[#334155] hover:border-blue-500/50 hover:bg-[#1a1f2e]/50'
                }
      `}
        >
            <div className="bg-[#1a1f2e] p-3 rounded-full mb-3 shadow-md">
                <UploadCloud size={24} className="text-blue-400" />
            </div>
            <p className="text-gray-300 font-medium mb-1">Upload Screenshots</p>
            <p className="text-xs text-gray-500">
                Paste (Ctrl+V) directly or drag and drop images here
            </p>
        </div>
    );
}
