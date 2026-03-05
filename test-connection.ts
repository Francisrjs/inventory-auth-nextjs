import { prisma } from "./lib/prisma";

async function testConnection() {
  try {
    console.log("🔍 Intentando conectar a la base de datos...");
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Conexión exitosa:", result);
    
    const userCount = await prisma.user.count();
    console.log("✅ Usuarios en la BD:", userCount);
    
    const productCount = await prisma.product.count();
    console.log("✅ Productos en la BD:", productCount);
  } catch (error) {
    console.error("❌ Error de conexión:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
