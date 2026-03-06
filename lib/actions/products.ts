"use server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";

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
