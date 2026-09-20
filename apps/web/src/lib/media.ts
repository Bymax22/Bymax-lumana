export function getMediaUrl(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value;
  if (value && typeof value === 'object') {
    const media = value as Record<string, unknown>;
    const url = media.url ?? media.secure_url ?? media.src ?? media.imageUrl;
    if (typeof url === 'string' && url.trim()) return url;
  }
  return null;
}

export function getFirstMediaUrl(item: any): string | null {
  const direct = getMediaUrl(item?.imageUrl ?? item?.coverImage ?? item?.thumbnail ?? item?.image);
  if (direct) return direct;

  const images = Array.isArray(item?.images) ? item.images : [];
  return getMediaUrl(images[0]);
}
