
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

function parseCSV(csvText) {
    const cleanText = csvText.replace(/^\uFEFF/, '')
    const lines = cleanText.split(/\r?\n/).filter(line => line.trim() !== '')
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase())

    return lines.slice(1).map(line => {
        const values = []
        let inQuotes = false
        let currentValue = ''

        for (let i = 0; i < line.length; i++) {
            const char = line[i]
            if (char === '"') {
                inQuotes = !inQuotes
            } else if (char === ',' && !inQuotes) {
                values.push(currentValue.trim())
                currentValue = ''
            } else {
                currentValue += char
            }
        }
        values.push(currentValue.trim())

        const row = {}
        headers.forEach((h, i) => {
            let value = values[i] || ''
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1)
            }
            row[h] = value
        })
        return row
    })
}

async function verify() {
    const csvData = fs.readFileSync('test_referral_import.csv', 'utf8')
    const rows = parseCSV(csvData)

    const campuses = await prisma.campus.findMany()
    const campusMap = new Map(campuses.map(c => [c.campusName.toLowerCase(), c.id]))
    const ambassadorsToUpdate = new Set()

    console.log(`Processing ${rows.length} rows...`)

    for (const [index, row] of rows.entries()) {
        const parentName = row.parentname
        const parentMobile = row.parentmobile
        const grade = row.grade
        const campusName = row.campusname
        const ambassadorMobile = row.ambassadormobile
        const status = row.status || 'Confirmed'

        console.log(`Row ${index + 1}: ${parentName} (${parentMobile}) -> ${ambassadorMobile}`)

        if (!parentName || !parentMobile || !grade || !campusName) {
            console.error(`Row ${index + 2}: Missing required fields`)
            continue
        }

        const campusId = campusMap.get(campusName.toLowerCase())
        if (!campusId) {
            console.error(`Row ${index + 2}: Campus '${campusName}' not found`)
            continue
        }

        const amb = await prisma.user.findUnique({ where: { mobileNumber: ambassadorMobile } })
        if (!amb) {
            console.error(`Row ${index + 2}: Ambassador ${ambassadorMobile} not found`)
            continue
        }
        const ambassadorId = amb.userId

        // Check if Lead Exists
        const existingLead = await prisma.referralLead.findFirst({
            where: { userId: ambassadorId, parentMobile: parentMobile }
        })

        if (existingLead) {
            console.warn(`Row ${index + 2}: Referral already exists`)
            continue
        }

        // Map status to LeadStatus enum
        let leadStatus = 'Confirmed'
        if (status.toLowerCase() === 'pending') leadStatus = 'New'
        else if (status.toLowerCase() === 'confirmed') leadStatus = 'Confirmed'
        // Add more mappings if needed

        // Create Referral Lead
        try {
            await prisma.referralLead.create({
                data: {
                    userId: ambassadorId,
                    parentName,
                    parentMobile,
                    studentName: row.studentname || null,
                    gradeInterested: grade,
                    campusId,
                    campus: campusName,
                    leadStatus: leadStatus,
                    confirmedDate: leadStatus === 'Confirmed' ? new Date() : null,
                    admittedYear: row.academicyear || '2025-2026',
                    admissionNumber: row.admissionnumber || null
                }
            })
            console.log(`Row ${index + 1}: Created lead with status ${leadStatus}`)
        } catch (err) {
            console.error(`Row ${index + 1}: Failed to create lead`)
            console.error(err)
            continue
        }

        if (leadStatus === 'Confirmed') {
            ambassadorsToUpdate.add(ambassadorId)
        }
    }

    if (ambassadorsToUpdate.size > 0) {
        console.log(`Updating ${ambassadorsToUpdate.size} ambassadors...`)
        const defaultSlabs = { 1: 5, 2: 10, 3: 25, 4: 30, 5: 50 }

        for (const userId of ambassadorsToUpdate) {
            const count = await prisma.referralLead.count({
                where: { userId, leadStatus: 'Confirmed' }
            })

            const lookupCount = Math.min(count, 5)
            const slab = await prisma.benefitSlab.findFirst({
                where: { referralCount: lookupCount }
            })

            const yearFeeBenefit = slab ? slab.yearFeeBenefitPercent : (defaultSlabs[lookupCount] || 0)

            await prisma.user.update({
                where: { userId },
                data: {
                    confirmedReferralCount: count,
                    yearFeeBenefitPercent: yearFeeBenefit,
                    benefitStatus: count >= 1 ? 'Active' : 'Inactive'
                }
            })
            const updatedAmb = await prisma.user.findUnique({ where: { userId } })
            console.log(`Ambassador ${updatedAmb.fullName} updated: Count=${updatedAmb.confirmedReferralCount}, Benefit=${updatedAmb.yearFeeBenefitPercent}%`)
        }
    }

    console.log('Verification Complete')
}

verify()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
