// GET  /api/v1/customers     — list semua pelanggan
// POST /api/v1/customers     — tambah pelanggan baru
import { prisma } from '@/lib/prisma';
import { withAuth, errorResponse, successResponse } from '@/lib/auth';
import { formatCustomer } from '@/lib/calculations';
import { customerSchema } from '@/lib/validation';

export const GET = withAuth(async (request) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { is_deleted: false },
      include: { discounts: true },
      orderBy: { nama: 'asc' },
    });
    return successResponse(customers.map(formatCustomer));
  } catch (error) {
    console.error('[GET /customers]', error);
    return errorResponse('Gagal memuat daftar pelanggan.', 'SERVER_ERROR', 500);
  }
});

export const POST = withAuth(async (request) => {
  try {
    const body = await request.json();
    const parsed = customerSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 'VALIDATION_ERROR', 422, parsed.error.format());
    }
    const { nama, bonus_threshold, discounts_lm, discounts_br, discounts } = parsed.data;

    // Build combined discount entries:
    // 1. Start with legacy discounts_lm / discounts_br
    const discountEntries = [];

    discounts_lm.filter(v => v >= 0 && v <= 100).forEach((pct, i) => {
      discountEntries.push({ product_type: 'LM', step_order: i + 1, percentage: pct });
    });
    discounts_br.filter(v => v >= 0 && v <= 100).forEach((pct, i) => {
      discountEntries.push({ product_type: 'BR', step_order: i + 1, percentage: pct });
    });

    // 2. Apply generic discounts dictionary (overrides same category if present)
    if (discounts) {
      for (const [catCode, steps] of Object.entries(discounts)) {
        const code = catCode.toUpperCase();
        // Remove any duplicates already added by legacy fields
        const filteredEntries = discountEntries.filter(e => e.product_type !== code);
        filteredEntries.push(
          ...steps.filter(v => v >= 0 && v <= 100).map((pct, i) => ({
            product_type: code,
            step_order: i + 1,
            percentage: pct,
          }))
        );
        discountEntries.length = 0;
        discountEntries.push(...filteredEntries);
      }
    }

    const customer = await prisma.customer.create({
      data: {
        nama: nama.trim(),
        bonus_threshold: bonus_threshold,
        discounts: { create: discountEntries },
      },
      include: { discounts: true },
    });

    return successResponse(formatCustomer(customer), 201);
  } catch (error) {
    console.error('[POST /customers]', error);
    return errorResponse('Gagal menambahkan pelanggan.', 'SERVER_ERROR', 500);
  }
});
