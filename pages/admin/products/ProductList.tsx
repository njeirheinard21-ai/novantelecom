import { useState } from 'react';
import { Link } from 'react-router';
import { useProducts, useSetProductActive } from '../../../hooks/useProducts';
import { Button } from '../../../components/ui/Button';
import { formatPrice } from '../../../lib/money';

export default function AdminProductList() {
  const [search, setSearch] = useState('');
  
  
  const { data, isLoading, isError } = useProducts({
    search,
    limit: 10,
    includeInactive: true,
  });

  const setActive = useSetProductActive();

  const handleToggleActive = (id: string, current: boolean) => {
    setActive.mutate({ id, isActive: !current });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">Products</h1>
        <Link to="/admin/products/new">
          <Button>New Product</Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search products..." 
          className="w-full max-w-md rounded-full border border-border/50 bg-canvas px-5 py-2.5 outline-none focus:ring-2 focus:ring-accent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className="text-red-500">Error loading products.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-canvas-secondary/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.items.map(product => (
                <tr key={product.id} className={!product.isActive ? 'opacity-60' : ''}>
                  <td className="px-4 py-3">
                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-fg/70 capitalize">{product.categoryId}</td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    {product.isActive ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-600 font-medium">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex space-x-2">
                    <Link to={`/admin/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleActive(product.id, product.isActive)}
                    >
                      {product.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
              
              {data?.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-fg-muted font-medium">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
