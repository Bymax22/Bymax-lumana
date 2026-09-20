'use client';

import { Facebook, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';

type ShareButtonProps = {
  title: string;
  description?: string;
  details?: string[];
  intro?: string;
  url: string;
  imageUrl?: string;
};

export default function ShareButton({ title, description, details = [], intro = 'With just 30% down payment, you can buy this vehicle from Lumana.', url, imageUrl }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const text = [intro, title, description, ...details.filter(Boolean)].filter(Boolean).join('\n');

  function getShareUrl() {
    return new URL(url, window.location.origin).toString();
  }

  async function shareNative() {
    const shareUrl = getShareUrl();
    if (navigator.share) {
      const shareData: ShareData = { title, text, url: shareUrl };
      if (imageUrl && navigator.canShare) {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const extension = blob.type.split('/')[1] || 'jpg';
          const file = new File([blob], `lumana-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}.${extension}`, { type: blob.type || 'image/jpeg' });
          if (navigator.canShare({ files: [file] })) {
            shareData.files = [file];
          }
        } catch {
          // Keep URL sharing available when the image host blocks browser downloads.
        }
      }
      await navigator.share(shareData);
      return;
    }
    setOpen((current) => !current);
  }

  function shareFacebook() {
    const shareUrl = getShareUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setOpen(false);
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${getShareUrl()}`)}`, '_blank', 'noopener,noreferrer');
    setOpen(false);
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => void shareNative()} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition hover:bg-red-600 hover:text-white" aria-label={`Share ${title}`} title={`Share ${title}`}>
        <Share2 size={16} />
      </button>
      {open ? (
        <div className="absolute bottom-11 right-0 z-20 flex gap-2 rounded-xl bg-[#171717] p-2 shadow-xl" role="menu" aria-label="Share options">
          <button type="button" onClick={shareFacebook} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1877f2] text-white" aria-label="Share on Facebook" title="Share on Facebook"><Facebook size={16} /></button>
          <button type="button" onClick={shareWhatsApp} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#25d366] text-white" aria-label="Share on WhatsApp" title="Share on WhatsApp"><MessageCircle size={16} /></button>
        </div>
      ) : null}
    </div>
  );
}
