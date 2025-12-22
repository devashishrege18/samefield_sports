import React from 'react';

// Base Skeleton component with shimmer effect
const Skeleton = ({ className, width, height, borderRadius = '0.75rem' }) => {
    return (
        <div
            className={`skeleton-shimmer ${className}`}
            style={{
                width: width || '100%',
                height: height || '1rem',
                borderRadius: borderRadius
            }}
        />
    );
};

// Thread loading skeleton
export const ThreadSkeleton = () => (
    <div className="p-6 border border-white/5 bg-white/5 rounded-2xl space-y-4 animate-fade-in">
        <div className="flex gap-4 items-center">
            <Skeleton width="40px" height="40px" borderRadius="12px" />
            <div className="flex-1 space-y-2">
                <Skeleton width="30%" height="0.6rem" />
                <Skeleton width="70%" height="1.2rem" />
            </div>
        </div>
        <Skeleton width="100%" height="3rem" />
        <div className="flex gap-2">
            <Skeleton width="60px" height="20px" borderRadius="20px" />
            <Skeleton width="60px" height="20px" borderRadius="20px" />
        </div>
    </div>
);

// Card loading skeleton
export const CardSkeleton = () => (
    <div className="aspect-[4/3] rounded-3xl skeleton-shimmer overflow-hidden relative p-6 flex flex-col justify-end">
        <div className="space-y-3">
            <Skeleton width="40%" height="0.8rem" />
            <Skeleton width="80%" height="1.5rem" />
            <div className="flex gap-2 mt-4">
                <Skeleton width="32px" height="32px" borderRadius="50%" />
                <Skeleton width="32px" height="32px" borderRadius="50%" />
            </div>
        </div>
    </div>
);

// Gallery Card Skeleton (for Watch page)
export const GalleryCardSkeleton = () => (
    <div className="min-w-[280px] flex-shrink-0">
        {/* Image placeholder */}
        <div className="h-40 rounded-xl skeleton-shimmer" />
        {/* Text placeholders */}
        <div className="pt-3 px-0.5 space-y-2">
            <Skeleton width="85%" height="1rem" />
            <Skeleton width="60%" height="0.7rem" />
        </div>
    </div>
);

// Row of gallery card skeletons
export const GalleryRowSkeleton = ({ count = 5 }) => (
    <div className="mb-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-3">
            <Skeleton width="120px" height="1.25rem" />
            <div className="flex gap-2">
                <Skeleton width="28px" height="28px" borderRadius="50%" />
                <Skeleton width="28px" height="28px" borderRadius="50%" />
            </div>
        </div>
        {/* Cards row */}
        <div className="flex gap-4" style={{ overflow: 'hidden' }}>
            {Array(count).fill(0).map((_, i) => (
                <GalleryCardSkeleton key={i} />
            ))}
        </div>
    </div>
);

// Chat message skeleton
export const ChatMessageSkeleton = () => (
    <div className="flex items-start gap-2 py-1.5 px-2">
        <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
                <Skeleton width="60px" height="0.75rem" />
                <Skeleton width="40%" height="0.75rem" />
            </div>
        </div>
    </div>
);

// Player skeleton
export const PlayerSkeleton = () => (
    <div className="w-full aspect-video skeleton-shimmer rounded-2xl flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <div className="w-8 h-8 skeleton-shimmer rounded-full" />
        </div>
    </div>
);

export default Skeleton;
