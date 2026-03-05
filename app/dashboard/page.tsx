import ProductChart from "@/components/products-charts";
import Sidebar from "@/components/sidebar";
import { auth, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TrendingUp } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user.id;
  // Fetch all data in parallel
  const [totalProducts, lowStock, allProduct] = await Promise.all([
    prisma.product.count({ where: { userId } }),
    prisma.product.count({
      where: {
        userId,
        lowStockAt: {
          not: null,
        },
        quantity: {
          lte: 5,
        },
      },
    }),
    prisma.product.findMany({
      select: {
        price: true,
        quantity: true,
        createdAt: true,
      },
    }),
  ]);

  const totalValue = allProduct.reduce((total, product) => {
    return total + Number(product.price) * Number(product.quantity);
  }, 0);
  const recent = await prisma.product.findMany({
    where: {
      // userId,
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });

  const now = new Date();
  const weeklyProductData: { week: string; products: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(2, "0")} / ${String(weekStart.getDate() + 1).padStart(2, "0")}`;
    console.log(weekLabel);

    const weekProducts = allProduct.filter((product) => {
      const productDate = new Date(product.createdAt);
      return productDate >= weekStart && productDate <= weekEnd;
    });

    weeklyProductData.push({
      week: weekLabel,
      products: weekProducts.length,
    });
    console.log(weekProducts);
  }
  console.log(recent);
  console.log(totalProducts);
  console.log(totalValue);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        currentPath="/dashboard"
        user={{
          name: user?.name,
          email: user?.email,
          image: user?.image,
        }}
      />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back! {user?.name || user?.email}, Here is overview of
                your inventory{" "}
              </p>
            </div>
          </div>
        </div>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Key Metrics
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {totalProducts}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
                <div className="flex items-center justify-center mt-1 ">
                  <span className="text-xs text-green-600">
                    + {totalValue.toFixed(0)}
                  </span>
                  <TrendingUp className="w-3 h-3 ml-1 text-green-600" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  ${totalValue.toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
                <div className="flex items-center justify-center mt-1 ">
                  <span className="text-xs text-green-600">
                    ${totalValue.toFixed(0)}
                  </span>
                  <TrendingUp className="w-3 h-3 ml-1 text-green-600" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {lowStock}
                </div>
                <div className="text-sm text-gray-600">Low Stock</div>
                <div className="flex items-center justify-center mt-1 ">
                  <span className="text-xs text-green-600">+{lowStock}</span>
                  <TrendingUp className="w-3 h-3 ml-1 text-green-600" />
                </div>
              </div>
            </div>
          </div>
          {/* Inventory over Time */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                New Products per week
              </h2>
            </div>
            <div className="h-48">
              <ProductChart data={weeklyProductData} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Stock levels */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Stock Levels
              </h2>
            </div>
            <div className="space-y-3">
              {recent.map((product, key) => {
                const stockLevel =
                  product.quantity === 0
                    ? 0
                    : product.quantity < (product.lowStockAt || 5)
                      ? 1
                      : 2;
                const bgColors = [
                  "bg-red-500",
                  "bg-yellow-500",
                  "bg-green-500",
                ];
                const textColors = [
                  "text-red-500",
                  "text-yellow-500",
                  "text-green-500",
                ];
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${bgColors[stockLevel]}`}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {product.name}
                      </span>
                    </div>
                    <div className={textColors[stockLevel]}>
                      {product.quantity} Units
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
