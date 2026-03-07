import Sidebar from "@/components/sidebar";
import { createProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function AddProductPage() {
  const user = await getCurrentUser();
  const userId = user?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/add-product"></Sidebar>
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Add product
              </h1>
              <p className="text-sm text-gray-500">
                Add a new product to your inventory
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-2xl">
          {/* Formulario aquí */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form className="space-y-6" action={createProduct}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Price*
                  </label>
                  <input
                    type="number"
                    id="price"
                    step="0.01"
                    min="0"
                    required
                    name="price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="0"
                    required
                    name="quantity"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="sku"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  SKU (Optional)
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="Enter SKU"
                />
              </div>
              <div>
                <label
                  htmlFor="lowStockAt"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Low Stock *
                </label>
                <input
                  type="number"
                  id="lowStockAt"
                  min="0"
                  name="lowStockAt"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div className="flex gap-5">
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add Product
                </button>
                <Link
                  href="/inventory"
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
