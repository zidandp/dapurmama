import { Product } from '@/app/lib/definitions';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Nama</th>
            <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Harga</th>
            <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Deskripsi</th>
            <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 border-b text-sm text-gray-700">{product.name}</td>
              <td className="py-3 px-4 border-b text-sm text-gray-700">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}</td>
              <td className="py-3 px-4 border-b text-sm text-gray-700">{product.description}</td>
              <td className="py-3 px-4 border-b text-sm">
                <button onClick={() => onEdit(product)} className="text-blue-600 hover:text-blue-800 font-medium mr-3">Edit</button>
                <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-800 font-medium">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
