// prisma/seed.js — Data awal minimal untuk HL Manager Pro
// Hanya seed: admin user + kategori produk default (LM dan BR)
// Semua data produk, pelanggan, dan transaksi dimulai dari nol oleh pengguna.

require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const bcrypt = require('bcryptjs');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Memulai proses seed data awal HL Manager Pro...');

  // ─── USER ───────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password_hash: passwordHash,
    },
  });
  console.log(`✅ User dibuat: ${user.username}`);

  // ─── TUTORIAL PROGRESS ──────────────────────────────────────────────
  await prisma.tutorialProgress.upsert({
    where: { user_id: user.id },
    update: {},
    create: {
      user_id: user.id,
      onboarding_completed: false,
      onboarding_last_step: 0,
      tutorials_completed: [],
      tutorials_in_progress: [],
    },
  });
  console.log('✅ Tutorial progress awal dibuat');

  // ─── KATEGORI PRODUK DEFAULT ─────────────────────────────────────────
  // Seed dua kategori default: LM (Langsung Minum) dan BR (Berbagai Rasa)
  // Pengguna bisa menambah kategori baru sesuai kebutuhan bisnis mereka.
  const categories = [
    { code: 'LM', name: 'Langsung Minum' },
    { code: 'BR', name: 'Berbagai Rasa' },
  ];

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { code: cat.code },
      update: { name: cat.name },
      create: { code: cat.code, name: cat.name },
    });
  }
  console.log(`✅ ${categories.length} kategori produk default dibuat: ${categories.map(c => c.code).join(', ')}`);

  console.log('\n🎉 Seed selesai! Silakan login dengan: admin / admin123');
  console.log('ℹ️  Aplikasi dimulai dari nol. Tambahkan produk dan pelanggan dari menu utama.');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
