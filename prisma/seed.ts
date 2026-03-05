import { prisma } from "../lib/prisma";

async function main() {
  const demoUserId = "133767f0-768d-4338-a612-50c8dc722b84";

  console.log("🌱 Iniciando seed de productos...");
  console.log(`📝 Usuario demo: ${demoUserId}`);

  try {
    // Create sample products one by one
    for (let i = 1; i <= 25; i++) {
      await prisma.product.create({
        data: {
          userId: demoUserId,
          name: `Product ${i}`,
          price: (Math.random() * 90 + 10).toFixed(2),
          quantity: Math.floor(Math.random() * 20),
          lowStockAt: 5,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 5)),
        },
      });
      console.log(`✅ Producto ${i} creado`);
    }

    console.log("🎉 ¡Seed completado exitosamente!");
    console.log(`📊 Se crearon 25 productos para el usuario: ${demoUserId}`);
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
