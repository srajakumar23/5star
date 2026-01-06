export type StarTier = '0-Star' | '1-Star' | '2-Star' | '3-Star' | '4-Star' | '5-Star';

export interface StarInfo {
    tier: StarTier;
    starCount: number;
    benefitPercent: number;
    color: string;
    bgColor: string;
    borderColor: string;
    nextStarThreshold?: number;
    isLongTermQualified: boolean;
}

export const STAR_CONFIG: Record<StarTier, {
    count: number,
    benefit: number,
    color: string,
    bgColor: string,
    borderColor: string
}> = {
    '0-Star': { count: 0, benefit: 0, color: 'text-gray-400', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
    '1-Star': { count: 1, benefit: 5, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
    '2-Star': { count: 2, benefit: 10, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    '3-Star': { count: 3, benefit: 25, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    '4-Star': { count: 4, benefit: 30, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
    '5-Star': { count: 5, benefit: 50, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
};

export const calculateStars = (count: number): StarInfo => {
    // Cap internal count for tier determination
    const displayCount = Math.min(count, 5);
    const tier = `${displayCount}-Star` as StarTier;
    const config = STAR_CONFIG[tier];

    return {
        tier,
        starCount: displayCount,
        benefitPercent: config.benefit,
        color: config.color,
        bgColor: config.bgColor,
        borderColor: config.borderColor,
        nextStarThreshold: displayCount < 5 ? displayCount + 1 : undefined,
        isLongTermQualified: count >= 5
    };
};

/**
 * Legacy compatibility helper
 */
export const calculateBadge = (count: number) => {
    const stars = calculateStars(count);
    return {
        tier: stars.tier,
        color: stars.color,
        bgColor: stars.bgColor,
        borderColor: stars.borderColor,
        nextTier: stars.nextStarThreshold ? `${stars.nextStarThreshold}-Star` : undefined,
        nextTierThreshold: stars.nextStarThreshold
    };
};
