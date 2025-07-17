'use client';

import { useState, useEffect } from 'react';
import ProductTable from '@/app/ui/produk/ProductTable';
import ProductForm from '@/app/ui/produk/ProductForm';
import { Product } from '@/app/lib/definitions';

export default function ProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/produk');
      if (!response.ok) throw new Error('Gagal mengambil data produk');
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFormSubmit = async (productData: Omit<Product, 'id'> | Product) => {
    const isEditing = 'id' in productData;
    const url = isEditing ? `/api/produk/${productData.id}` : '/api/produk';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan produk');
      }

      await fetchProducts(); // Refresh the list
      setIsFormVisible(false);
      setEditingProduct(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const response = await fetch(`/api/produk/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Gagal menghapus produk');
        await fetchProducts(); // Refresh the list
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingProduct(null);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormVisible(true);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Produk</h1>
        {!isFormVisible && (
          <button onClick={handleAddNew} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            + Tambah Produk Baru
          </button>
        )}
      </div>

      {isFormVisible ? (
        <ProductForm 
          productToEdit={editingProduct}
          onFormSubmit={handleFormSubmit} 
          onCancel={handleCancel} 
        />
      ) : (
        <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
