"use server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import z from "zod";
import { redirect } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().nonnegative("Price must be positive"),
  quantity: z.coerce
    .number()
    .int()
    .nonnegative("Quantity must be a non-negative integer"),
  sku: z.string().optional(),
  lowStockAt: z.coerce.number().int().min(0).optional(),
});
export async function deleteProduct(formData: FormData) {
  const user = await getCurrentUser();
  const id = String(formData.get("id") || "");

  console.log("🗑️ Deleting product -> id:", id, "userId:", user?.id);

  if (!user?.id) {
    console.error("❌ User not authenticated");
    throw new Error("User not authenticated");
  }

  if (!id) {
    console.error("❌ Product id is required");
    throw new Error("Product id is required");
  }

  const result = await prisma.product.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  console.log(
    `✅ Product deleted -> id: ${id}, deleted count: ${result.count}`,
  );
  revalidatePath("/inventory");
}
// zod pra validar las entradas del formulario
export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();

  console.log("📝 [createProduct] Starting product creation");
  console.log("📝 [createProduct] User ID:", user?.id);

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku") || undefined,
    lowStockAt: formData.get("lowStockAt") || undefined,
  });

  console.log("📝 [createProduct] Parsed success:", parsed.success);
  if (!parsed.success) {
    console.error(
      "❌ [createProduct] Validation errors:",
      parsed.error.flatten(),
    );
    throw new Error("Validation failed");
  }

  console.log("📝 [createProduct] Parsed data:", parsed.data);

  try {
    const result = await prisma.product.create({
      data: { ...parsed.data, userId: user.id },
    });
    console.log("✅ [createProduct] Product created:", result.id);
  } catch (error) {
    console.error("❌ [createProduct] Database error:", error);
    throw new Error("Failed to create product");
  }

  redirect("/inventory");
}
