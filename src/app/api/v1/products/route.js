// GET  /api/v1/products   — list semua produk
// POST /api/v1/products   — tambah produk baru
import { prisma } from '@/lib/prisma';
import { withAuth, errorResponse, successResponse } from '@/lib/auth';
import { formatProduct } from '@/lib/calculations';
import { productSchema } from '@/lib/validation';

export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const tipe = searchParams.get('tipe');

    const where = { is_deleted: false };
    if (tipe && tipe.trim()) where.tipe = tipe.trim().toUpperCase();

    const products = await prisma.product.findMany({
      where,
      orderBy: [{ tipe: 'asc' }, { nama: 'asc' }],
    });

    return successResponse(products.map(formatProduct));
  } catch (error) {
    console.error('[GET /products]', error);
    return errorResponse('Gagal memuat daftar produk.', 'SERVER_ERROR', 500);
  }
});

export const POST = withAuth(async (request) => {
  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 'VALIDATION_ERROR', 422, parsed.error.format());
    }
    const { nama, harga_modal, harga_base, tipe } = parsed.data;

    const product = await prisma.product.create({
      data: {
        nama: nama.trim(),
        harga_modal: harga_modal,
        harga_base: harga_base,
        tipe,
      },
    });

    return successResponse(formatProduct(product), 201);
  } catch (error) {
    console.error('[POST /products]', error);
    return errorResponse('Gagal menambahkan produk.', 'SERVER_ERROR', 500);
  }
});
