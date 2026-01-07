import { createNotification } from '@/app/notification-actions'

/**
 * Centralized notification helper for the 5-Star Ambassador program
 * All notification templates and logic in one place
 */

interface ReferralDetails {
    parentName: string
    leadId: number
    status?: string
}

interface AmbassadorDetails {
    fullName: string
    userId: number
}

/**
 * Notify ambassador when they submit a new referral
 */
export async function notifyReferralSubmitted(userId: number, referralDetails: ReferralDetails) {
    return createNotification({
        userId,
        title: '🎉 Referral Submitted Successfully',
        message: `Your referral for ${referralDetails.parentName} has been submitted. We'll review the application soon.`,
        type: 'success',
        link: '/referrals'
    })
}

/**
 * Notify admin when a new referral is submitted
 */
export async function notifyAdminNewReferral(adminId: number, referralDetails: ReferralDetails, ambassadorDetails: AmbassadorDetails) {
    return createNotification({
        adminId,
        title: '🔔 New Referral Submitted',
        message: `${ambassadorDetails.fullName} submitted a referral for ${referralDetails.parentName}`,
        type: 'info',
        link: `/admin/referrals/${referralDetails.leadId}`
    })
}

/**
 * Notify ambassador when referral status changes
 */
export async function notifyReferralStatusChanged(
    userId: number,
    referralDetails: ReferralDetails,
    oldStatus: string,
    newStatus: string
) {
    const statusEmojis: Record<string, string> = {
        'Contacted': '📞',
        'Follow-up': '📋',
        'Interested': '👍',
        'Confirmed': '✅',
        'Rejected': '❌',
        'Admitted': '🎓'
    }

    return createNotification({
        userId,
        title: `${statusEmojis[newStatus] || '📋'} Referral Status Updated`,
        message: `${referralDetails.parentName}'s referral changed from ${oldStatus} to ${newStatus}`,
        type: newStatus === 'Confirmed' || newStatus === 'Admitted' ? 'success' : 'info',
        link: '/referrals'
    })
}

/**
 * Notify ambassador when referral is confirmed (special celebration!)
 */
export async function notifyReferralConfirmed(userId: number, referralDetails: ReferralDetails, currentCount: number) {
    const message = currentCount >= 5
        ? `🌟 Congratulations! ${referralDetails.parentName} has been confirmed. You've achieved 5-Star status!`
        : `Great news! ${referralDetails.parentName} has been confirmed. You now have ${currentCount} confirmed referral${currentCount > 1 ? 's' : ''}!`

    return createNotification({
        userId,
        title: '✅ Referral Confirmed!',
        message,
        type: 'success',
        link: '/dashboard'
    })
}

/**
 * Notify ambassador when referral is rejected
 */
export async function notifyReferralRejected(userId: number, referralDetails: ReferralDetails, reason?: string) {
    return createNotification({
        userId,
        title: 'Referral Status Update',
        message: `${referralDetails.parentName}'s referral was not confirmed${reason ? `: ${reason}` : ''}. Keep referring - you're doing great!`,
        type: 'warning',
        link: '/referrals'
    })
}

/**
 * Special notification when ambassador achieves 5-Star status! 🌟
 */
export async function notifyFiveStarAchievement(userId: number, userName: string) {
    return createNotification({
        userId,
        title: '🌟⭐ 5-STAR AMBASSADOR ACHIEVED!',
        message: `Congratulations ${userName}! You've unlocked 5-Star Ambassador status! Your exclusive badge is now displayed on your dashboard. Thank you for your amazing contribution!`,
        type: 'success',
        link: '/dashboard'
    })
}

/**
 * Notify ambassador when settlement is approved
 */
export async function notifySettlementApproved(userId: number, amount: number, settlementId: number) {
    return createNotification({
        userId,
        title: '💰 Settlement Approved',
        message: `Your settlement of ₹${amount.toLocaleString('en-IN')} has been approved and will be processed shortly.`,
        type: 'success',
        link: '/analytics#settlements'
    })
}

/**
 * Notify ambassador when settlement is processed
 */
export async function notifySettlementProcessed(userId: number, amount: number, paymentMethod: string) {
    return createNotification({
        userId,
        title: '✅ Settlement Processed',
        message: `Your settlement of ₹${amount.toLocaleString('en-IN')} has been successfully processed via ${paymentMethod}.`,
        type: 'success',
        link: '/analytics#settlements'
    })
}

/**
 * Notify admin about account deletion request
 */
export async function notifyAdminDeletionRequest(adminId: number, userDetails: { fullName: string, userId: number, role: string }) {
    return createNotification({
        adminId,
        title: '⚠️ Account Deletion Requested',
        message: `${userDetails.fullName} (${userDetails.role}) has requested account deletion`,
        type: 'warning',
        link: `/admin/users/${userDetails.userId}`
    })
}

/**
 * Notify admin about new support ticket
 */
export async function notifyAdminNewTicket(adminId: number, ticketDetails: { subject: string, userId: number, userName: string, ticketId: number }) {
    return createNotification({
        adminId,
        title: '🎫 New Support Ticket',
        message: `${ticketDetails.userName} opened: "${ticketDetails.subject}"`,
        type: 'info',
        link: `/admin/support/${ticketDetails.ticketId}`
    })
}

/**
 * Notify user when their support ticket receives a response
 */
export async function notifyTicketResponse(userId: number, ticketDetails: { subject: string, ticketId: number }) {
    return createNotification({
        userId,
        title: '💬 Support Ticket Update',
        message: `New response on your ticket: "${ticketDetails.subject}"`,
        type: 'info',
        link: `/support/${ticketDetails.ticketId}`
    })
}
