import React from 'react';
import { X, ZoomIn } from 'lucide-react';
import './ImageLightboxModal.css';

export default function ImageLightboxModal({ imageUrl, title, onClose }) {
  if (!imageUrl) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close-btn" onClick={onClose} title="Kapat">
          <X size={24} />
        </button>
        
        <img src={imageUrl} alt={title || 'Görsel'} className="lightbox-img" />
      </div>
    </div>
  );
}
