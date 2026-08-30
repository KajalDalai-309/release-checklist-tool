const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial release checklist data...');

  // Clean existing records if any
  await prisma.release.deleteMany({});

  // 1. A completed release ("done" - all 8 steps completed)
  await prisma.release.create({
    data: {
      name: 'Release 2026.08 - Core Analytics Engine',
      targetDate: new Date('2026-08-28T14:00:00Z'),
      additionalInfo: 'Major release containing real-time stream processing, performance index optimizations, and security patches. Migrations executed with 0 downtime.',
      completedSteps: JSON.stringify([
        'step-1',
        'step-2',
        'step-3',
        'step-4',
        'step-5',
        'step-6',
        'step-7',
        'step-8'
      ])
    }
  });

  // 2. An in-progress release ("ongoing" - 4 steps completed)
  await prisma.release.create({
    data: {
      name: 'Release 2026.09 - User Authentication v2 & SSO',
      targetDate: new Date('2026-09-05T10:30:00Z'),
      additionalInfo: 'Upgrading OAuth2 flow and SAML SSO integration. Staging verification underway with security team.',
      completedSteps: JSON.stringify([
        'step-1',
        'step-2',
        'step-3',
        'step-4'
      ])
    }
  });

  // 3. A planned release ("planned" - 0 steps completed)
  await prisma.release.create({
    data: {
      name: 'Release 2026.10 - Billing Portal & Stripe Webhooks',
      targetDate: new Date('2026-09-20T18:00:00Z'),
      additionalInfo: 'New self-service customer invoice portal and updated tax calculation engine. Feature branch code freeze scheduled next week.',
      completedSteps: JSON.stringify([])
    }
  });

  console.log('✅ Seed completed successfully with Planned, Ongoing, and Done releases!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
