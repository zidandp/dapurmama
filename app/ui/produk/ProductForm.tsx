import { useState, useEffect } from 'react';
import { Product } from '@/app/lib/definitions';

interface ProductFormProps {
  productToEdit: Product | null;
  onFormSubmit: (product: Omit<Product, 'id'> | Product) => void;
  onCancel: () => void;
}

export default function ProductForm({ productToEdit, onFormSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(productToEdit.price.toString());
      setDescription(productToEdit.description);
    } else {
      setName('');
      setPrice('');
      setDescription('');
    }
  }, [productToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { 
      name, 
      price: parseInt(price, 10), 
      description 
    };
    
    if (productToEdit) {
      onFormSubmit({ ...productData, id: productToEdit.id });
    } else {
      onFormSubmit(productData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">{productToEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Produk</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Harga</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        ></textarea>
      </div>
      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{productToEdit ? 'Simpan Perubahan' : 'Tambah Produk'}</button>
      </div>
    </form>
  );
}
