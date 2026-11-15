import React from 'react';
import { PhotoCaptureSource } from '../types';

interface ProofCaptureSourceLabelProps {
  captureSource?: PhotoCaptureSource;
  className?: string;
}

export const ProofCaptureSourceLabel: React.FC<ProofCaptureSourceLabelProps> = ({
  captureSource,
  className = ''
}) => {
  const label = captureSource === 'camera'
    ? '📷 Camera'
    : captureSource === 'gallery'
      ? '🖼️ Gallery'
      : 'Source unavailable';

  return (
    <span className={`inline-flex items-center whitespace-nowrap ${className}`}>
      {label}
    </span>
  );
};
