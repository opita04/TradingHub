import { useState } from 'react';
import type { Screenshot } from '../../types';
import { X, Eye, EyeOff, Maximize2 } from 'lucide-react';

interface ScreenshotGalleryProps {
    screenshots: Screenshot[];
    onRemove: (id: string) => void;
    allowDelete?: boolean;
}

export function ScreenshotGallery({ screenshots, onRemove, allowDelete = true }: ScreenshotGalleryProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (screenshots.length === 0) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">
                    {screenshots.length} Screenshot{screenshots.length !== 1 ? 's' : ''} Attached
                </span>
                <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="text-xs flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                >
                    {isVisible ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Show</>}
                </button>
            </div>

            {isVisible && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                    {screenshots.map((shot) => (
                        <div key={shot.id} className="group relative aspect-video bg-black rounded-lg overflow-hidden border border-[#334155]">
                            <img
                                src={shot.data}
                                alt="Trade screenshot"
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                onClick={() => setSelectedImage(shot.data)}
                            />

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedImage(shot.data)}
                                    className="p-1.5 bg-gray-800 rounded-full text-white hover:bg-blue-600 transition-colors"
                                    title="View Fullscreen"
                                >
                                    <Maximize2 size={16} />
                                </button>

                                {allowDelete && (
                                    <button
                                        type="button"
                                        onClick={() => onRemove(shot.id)}
                                        className="p-1.5 bg-gray-800 rounded-full text-white hover:bg-red-600 transition-colors"
                                        title="Remove"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8 backdrop-blur-sm animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        alt="Full size"
                        className="max-w-full max-h-full rounded-lg shadow-2xl"
                    />
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>
                </div>
            )}
        </div>
    );
}
