export type BadgeTier = 'Rookie' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Five-Star';

export interface BadgeInfo {
    tier: BadgeTier;
    color: string;
    bgColor: string;
    borderColor: string;
    nextTier?: BadgeTier;
    nextTierThreshold?: number;
}

export const BADGE_TIERS: Record<BadgeTier, { threshold: number, color: string, bgColor: string, borderColor: string }> = {
    'Rookie': { threshold: 0, color: 'text-gray-500', bgColor: 'bg-gray-100', borderColor: 'border-gray-200' },
    'Bronze': { threshold: 1, color: 'text-amber-700', bgColor: 'bg-amber-100', borderColor: 'border-amber-200' },
    'Silver': { threshold: 5, color: 'text-slate-500', bgColor: 'bg-slate-100', borderColor: 'border-slate-200' },
    'Gold': { threshold: 15, color: 'text-yellow-700', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200' },
    'Platinum': { threshold: 30, color: 'text-emerald-700', bgColor: 'bg-emerald-100', borderColor: 'border-emerald-200' },
    'Five-Star': { threshold: 50, color: 'text-red-700', bgColor: 'bg-red-100', borderColor: 'border-red-200' }
};

export const calculateBadge = (count: number): BadgeInfo => {
    const tiers = Object.keys(BADGE_TIERS) as BadgeTier[];
    let currentTier: BadgeTier = 'Rookie';

    for (const tier of tiers) {
        if (count >= BADGE_TIERS[tier].threshold) {
            currentTier = tier;
        }
    }

    const currentIndex = tiers.indexOf(currentTier);
    const nextTier = tiers[currentIndex + 1];
    const nextTierThreshold = nextTier ? BADGE_TIERS[nextTier].threshold : undefined;

    return {
        tier: currentTier,
        ...BADGE_TIERS[currentTier],
        nextTier,
        nextTierThreshold
    };
};
