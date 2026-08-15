'use client';

import { cn, avatarColor } from '@/lib/utils';

interface AvatarProps {
  initials: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  src?: string;
}

const SIZE = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' };

export function Avatar({ initials, id = initials, size = 'md', title, src }: AvatarProps) {
  const isUrl = src
    ? true
    : initials.startsWith('http://') || initials.startsWith('https://');
  const imgSrc = src ?? (isUrl ? initials : undefined);

  return isUrl && imgSrc ? (
    <img
      src={imgSrc}
      alt={title ?? initials}
      title={title}
      className={cn(SIZE[size], 'rounded-full object-cover ring-2 ring-white shrink-0')}
    />
  ) : (
    <span
      title={title}
      className={cn(
        SIZE[size],
        avatarColor(id),
        'rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white select-none shrink-0'
      )}
    >
      {initials}
    </span>
  );
}

export function AvatarGroup({
  owners,
  max = 3,
}: {
  owners: { id: string; name: string; avatar: string; role: string }[];
  max?: number;
}) {
  const visible = owners.slice(0, max);
  const rest = owners.length - max;
  return (
    <div className="flex -space-x-2">
      {visible.map(o => (
        <Avatar key={o.id} initials={o.avatar} id={o.id} size="sm" title={`${o.name} - ${o.role}`} />
      ))}
      {rest > 0 && (
        <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 text-xs ring-2 ring-white flex items-center justify-center font-medium">
          +{rest}
        </span>
      )}
    </div>
  );
}