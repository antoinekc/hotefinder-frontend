import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProfileImageUploadProps {
  currentImage?: string;
  onUploadSuccess: (url: string) => void;
  className?: string;
}

const ProfileImageUpload = ({ currentImage, onUploadSuccess, className = '' }: ProfileImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Créer le FormData pour l'upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'hotefinder'); // À remplacer par votre upload_preset Cloudinary

      // Upload vers Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/drgy3izvt/image/upload`, // À remplacer par votre cloud_name
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        const transformedUrl = data.secure_url.replace(
          '/upload/',
          '/upload/c_fill/w_300/h_300,r_max'
        )
        setPreview(data.secure_url);
        onUploadSuccess(data.secure_url);
      }
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-64 h-64 mx-auto">
        {preview ? (
          <div className="relative group">
            <img 
              src={preview} 
              alt="Photo de profil" 
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer p-2">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
                <Camera className="w-6 h-6 text-white" />
              </label>
            </div>
          </div>
        ) : (
          <label className="w-full h-full rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            <Camera className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-500 mt-2">Ajouter une photo</span>
          </label>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUpload;