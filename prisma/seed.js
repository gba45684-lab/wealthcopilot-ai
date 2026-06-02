const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const distributor = await prisma.user.upsert({
    where: { clerkId: 'clerk_test_distributor_1' },
    update: {},
    create: {
      clerkId: 'clerk_test_distributor_1',
      email: 'distributor@wealthcopilot.com',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      role: 'DISTRIBUTOR',
      company: 'Wealth Partners',
      phone: '+91-9876543210',
    },
  });

  console.log(`✅ Created distributor: ${distributor.email}`);

  // Create sample clients
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { email: 'client1@example.com' },
      update: {},
      create: {
        distributorId: distributor.id,
        firstName: 'Amit',
        lastName: 'Singh',
        email: 'client1@example.com',
        phone: '+91-9123456789',
        panNumber: 'ABCDE1234F',
        riskProfile: 'MODERATE',
        annualIncome: 1000000,
        investmentGoal: 'Retirement Planning',
      },
    }),
    prisma.client.upsert({
      where: { email: 'client2@example.com' },
      update: {},
      create: {
        distributorId: distributor.id,
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'client2@example.com',
        phone: '+91-9987654321',
        panNumber: 'XYZAB5678G',
        riskProfile: 'AGGRESSIVE',
        annualIncome: 1500000,
        investmentGoal: 'Child Education',
      },
    }),
  ]);

  console.log(`✅ Created ${clients.length} sample clients`);

  // Create sample SIPs
  const sips = await Promise.all([
    prisma.sIP.create({
      data: {
        clientId: clients[0].id,
        distributorId: distributor.id,
        fundName: 'Axis Blue Chip Fund',
        fundIsin: 'INF846K01141',
        fundHouse: 'Axis AMC',
        monthlyAmount: 5000,
        startDate: new Date('2023-01-01'),
        frequency: 'MONTHLY',
        status: 'ACTIVE',
      },
    }),
    prisma.sIP.create({
      data: {
        clientId: clients[1].id,
        distributorId: distributor.id,
        fundName: 'HDFC Top 100 Fund',
        fundIsin: 'INF179K01152',
        fundHouse: 'HDFC AMC',
        monthlyAmount: 10000,
        startDate: new Date('2023-06-01'),
        frequency: 'MONTHLY',
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log(`✅ Created ${sips.length} sample SIPs`);

  // Create sample SIP installments
  for (const sip of sips) {
    for (let i = 0; i < 12; i++) {
      const dueDate = new Date(sip.startDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      
      await prisma.sIPInstallment.create({
        data: {
          sipId: sip.id,
          dueDate,
          amount: sip.monthlyAmount,
          units: Math.random() * 50 + 10,
          nav: Math.random() * 50 + 50,
          status: i < 6 ? 'PAID' : 'PENDING',
        },
      });
    }
  }

  console.log('✅ Created SIP installments');

  // Create sample lapse risks
  await prisma.lapseRisk.create({
    data: {
      sipId: sips[1].id,
      riskScore: 35,
      riskLevel: 'MEDIUM',
      reason: 'Missed 2 payments in last quarter',
      missedPayments: 2,
      daysSinceLastPayment: 15,
    },
  });

  console.log('✅ Created lapse risk data');

  // Create sample portfolios
  const portfolios = await Promise.all([
    prisma.portfolio.create({
      data: {
        clientId: clients[0].id,
        totalValue: 500000,
      },
    }),
    prisma.portfolio.create({
      data: {
        clientId: clients[1].id,
        totalValue: 800000,
      },
    }),
  ]);

  console.log(`✅ Created ${portfolios.length} portfolios`);

  // Create sample portfolio holdings
  await prisma.portfolioHolding.createMany({
    data: [
      {
        portfolioId: portfolios[0].id,
        fundName: 'Axis Blue Chip Fund',
        fundIsin: 'INF846K01141',
        fundHouse: 'Axis AMC',
        fundCategory: 'Large Cap',
        quantity: 1000,
        currentValue: 250000,
        investedAmount: 200000,
        gains: 50000,
        allocation: 50,
      },
      {
        portfolioId: portfolios[0].id,
        fundName: 'ICICI Prudential Mid Cap Fund',
        fundIsin: 'INF837K01225',
        fundHouse: 'ICICI Prudential',
        fundCategory: 'Mid Cap',
        quantity: 500,
        currentValue: 250000,
        investedAmount: 200000,
        gains: 50000,
        allocation: 50,
      },
    ],
  });

  console.log('✅ Created portfolio holdings');

  // Create sample goals
  await prisma.goal.createMany({
    data: [
      {
        clientId: clients[0].id,
        distributorId: distributor.id,
        goalName: 'Retirement at 60',
        goalType: 'RETIREMENT',
        targetAmount: 5000000,
        targetDate: new Date('2035-12-31'),
        currentAmount: 500000,
        priority: 1,
        status: 'ACTIVE',
      },
      {
        clientId: clients[1].id,
        distributorId: distributor.id,
        goalName: "Child's Education",
        goalType: 'EDUCATION',
        targetAmount: 2000000,
        targetDate: new Date('2033-12-31'),
        currentAmount: 800000,
        priority: 1,
        status: 'ACTIVE',
      },
    ],
  });

  console.log('✅ Created sample goals');

  // Create sample commissions
  await prisma.commission.createMany({
    data: [
      {
        distributorId: distributor.id,
        clientId: clients[0].id,
        arn: 'ARN-2024-001',
        fundName: 'Axis Blue Chip Fund',
        amount: 2500,
        rate: 0.5,
        transactionDate: new Date('2024-01-15'),
        status: 'PAID',
      },
      {
        distributorId: distributor.id,
        clientId: clients[1].id,
        arn: 'ARN-2024-002',
        fundName: 'HDFC Top 100 Fund',
        amount: 5000,
        rate: 0.5,
        transactionDate: new Date('2024-02-20'),
        status: 'PENDING',
      },
    ],
  });

  console.log('✅ Created commission records');

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
