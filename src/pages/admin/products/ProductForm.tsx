import { getLocalizedValue } from '../../../types/i18n';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate as useNavigate } from '../../../hooks/useLocalizedNavigate';
import { useEffect } from 'react';
import { useParams, } from 'react-router';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProduct, useCreateProduct, useUpdateProduct } from '../../../hooks/useProducts';
import { Button } from '../../../components/ui/Button';
import { NewProduct, ProductVariant } from '../../../types/product';

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  isActive: z.boolean().default(true),
  storage: z.string().optional(),
  color: z.string().optional(),
  colorHex: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().min(0, "Stock must be positive"),
  sku: z.string().min(1, "SKU is required"),
});

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  brand: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  compareAtPrice: z.coerce.number().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  inStock: z.boolean(),
  stock: z.coerce.number().min(0, "Stock must be positive"),
  sku: z.string().min(1, "SKU is required"),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  images: z.string().min(1, "At least one image URL is required"), // We'll split by comma
  productLine: z.string().optional(),
  generation: z.string().optional(),
  variants: z.array(variantSchema).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminProductForm() {
  const { t } = useTranslation(['admin', 'common']);
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  
  const { data: product, isLoading } = useProduct(id || '');
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      brand: 'brand_apple',
      inStock: true,
      isActive: true,
      isFeatured: false,
      images: '',
      stock: 0,
      price: 0,
      variants: [],
    }
  });

  const { fields: variantFields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    if (product && isEditing) {
      reset({
        ...product,
        images: product.images.join(', '),
      });
    }
  }, [product, isEditing, reset]);

  const onSubmit = async (data: ProductFormData) => {
    const processedData: NewProduct = {
      ...data,
      images: data.images.split(',').map(s => s.trim()).filter(Boolean),
      compareAtPrice: data.compareAtPrice || undefined,
      variants: data.variants?.map(v => ({
        ...v,
        id: v.id || `var_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      })) as ProductVariant[],
    };

    if (isEditing && id) {
      await updateProduct.mutateAsync({ id, patch: processedData });
    } else {
      await createProduct.mutateAsync(processedData);
    }
    navigate('/admin/products');
  };

  if (isEditing && isLoading) return <div>{t('loading', { ns: 'common' })}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">{isEditing ? 'Edit Product' : 'New Product'}</h1>
        <Button variant="outline" onClick={() => navigate('/admin/products')}>{t('cancel', { ns: 'common' })}</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-canvas-secondary p-6 rounded-2xl border border-border space-y-4">
          <h2 className="text-xl font-medium mb-4">Basic Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="block text-sm font-medium mb-1" data-for="field_1">{t('name', { ns: 'common' })}</div>
              <input id="field_1" {...register("name")} className="w-full rounded-xl border border-border p-2" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <div className="block text-sm font-medium mb-1" data-for="field_2">Slug</div>
              <input id="field_2" {...register("slug")} className="w-full rounded-xl border border-border p-2" />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <div className="block text-sm font-medium mb-1" data-for="field_3">Brand</div>
              <input id="field_3" {...register("brand")} className="w-full rounded-xl border border-border p-2" />
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
            </div>
            
            <div>
              <div className="block text-sm font-medium mb-1" data-for="field_4">Category</div>
              <select id="field_4" {...register("categoryId")} className="w-full rounded-xl border border-border p-2">
                <option value="">Select Category...</option>
                <option value="iphone">iPhone</option>
                <option value="mac">Mac</option>
                <option value="ipad">iPad</option>
                <option value="watch">Apple Watch</option>
                <option value="airpods">AirPods</option>
                <option value="accessories">Accessories</option>
              </select>
              {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
            </div>
            
            <div className="md:col-span-2">
              <div className="block text-sm font-medium mb-1" data-for="field_5">Description</div>
              <textarea id="field_5" {...register("description")} rows={4} className="w-full rounded-xl border border-border p-2" />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="md:col-span-2">
              <div className="block text-sm font-medium mb-1" data-for="field_6">Images (comma separated URLs)</div>
              <input id="field_6" {...register("images")} className="w-full rounded-xl border border-border p-2" />
              {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>}
            </div>
          </div>
        </div>

        <div className="bg-canvas-secondary p-6 rounded-2xl border border-border space-y-4">
          <h2 className="text-xl font-medium mb-4">Pricing & Inventory</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="block text-sm font-medium mb-1" data-for="field_7">{t('price_xaf', { ns: 'common' })}</div>
              <input id="field_7" type="number" {...register("price")} className="w-full rounded-xl border border-border p-2" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            
            <div>
              <div className="block text-sm font-medium mb-1" data-for="field_8">Compare at Price (Optional)</div>
              <input id="field_8" type="number" {...register("compareAtPrice")} className="w-full rounded-xl border border-border p-2" />
            </div>

            <div>
              <div className="block text-sm font-medium mb-1" data-for="field_9">{t('sku', { ns: 'admin' })}</div>
              <input id="field_9" {...register("sku")} className="w-full rounded-xl border border-border p-2" />
            </div>

            <div>
              <div className="block text-sm font-medium mb-1" data-for="field_10">Stock Count</div>
              <input id="field_10" type="number" {...register("stock")} className="w-full rounded-xl border border-border p-2" />
            </div>
          </div>

          <div className="flex space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" {...register("inStock")} className="rounded border-border" />
              <span className="text-sm font-medium">In Stock</span>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" {...register("isActive")} className="rounded border-border" />
              <span className="text-sm font-medium">Active (Visible)</span>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" {...register("isFeatured")} className="rounded border-border" />
              <span className="text-sm font-medium">Featured</span>
            </div>
          </div>
        </div>
        
        <div className="bg-canvas-secondary p-6 rounded-2xl border border-border space-y-4">
          <h2 className="text-xl font-medium mb-4">Product Specs (Apple specific)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="block text-sm font-medium mb-1" data-for="field_11">Product Line (e.g. MacBook Pro)</div>
              <input id="field_11" {...register("productLine")} className="w-full rounded-xl border border-border p-2" />
            </div>
            <div>
              <div className="block text-sm font-medium mb-1" data-for="field_12">Generation (e.g. M3, 15th Gen)</div>
              <input id="field_12" {...register("generation")} className="w-full rounded-xl border border-border p-2" />
            </div>
          </div>
        </div>

        <div className="bg-canvas-secondary p-6 rounded-2xl border border-border space-y-4">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-medium">Variants</h2>
             <Button type="button" variant="outline" size="sm" onClick={() => append({ sku: '', name: '', price: 0, stock: 0, isActive: true })}>
               Add Variant
             </Button>
          </div>
          
          <div className="space-y-4">
            {variantFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-border/50 rounded-2xl bg-canvas relative">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 text-red-500" 
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                   <div>
                     <div className="block text-xs font-medium mb-1" data-for="field_13">{t('sku', { ns: 'admin' })}</div>
              <input id="field_13" {...register(`variants.${index}.sku`)} className="w-full rounded-xl border border-border p-1.5 text-base md:text-sm" />
                   </div>
                   <div>
                     <div className="block text-xs font-medium mb-1" data-for="field_14">{t('price_xaf', { ns: 'common' })}</div>
              <input id="field_14" type="number" {...register(`variants.${index}.price`)} className="w-full rounded-xl border border-border p-1.5 text-base md:text-sm" />
                   </div>
                   <div>
                     <div className="block text-xs font-medium mb-1" data-for="field_15">{t('stock', { ns: 'admin' })}</div>
              <div className="grid grid-cols-2 gap-4 mb-2">
    <div>
      <div className="block text-sm font-medium text-fg-muted mb-1">Variant Name</div>
      <input {...register(`variants.${index}.name`)} className="w-full rounded-xl border border-border p-1.5 text-base md:text-sm" />
    </div>
    <div className="flex items-end mb-2">
      <div className="flex items-center space-x-2">
        <input type="checkbox" {...register(`variants.${index}.isActive`)} className="rounded border-border" />
        <span className="text-sm font-medium">Active</span>
      </div>
    </div>
  </div>
  <input id="field_15" type="number" {...register(`variants.${index}.stock`)} className="w-full rounded-xl border border-border p-1.5 text-base md:text-sm" />
                   </div>
                   <div>
                     <div className="block text-xs font-medium mb-1" data-for="field_16">Storage</div>
              <input id="field_16" {...register(`variants.${index}.storage`)} className="w-full rounded-xl border border-border p-1.5 text-base md:text-sm" />
                   </div>
                   <div>
                     <div className="block text-xs font-medium mb-1" data-for="field_17">Colour Name</div>
              <input id="field_17" {...register(`variants.${index}.color`)} className="w-full rounded-xl border border-border p-1.5 text-base md:text-sm" />
                   </div>
                   <div>
                     <div className="block text-xs font-medium mb-1" data-for="field_18">Colour Hex (e.g. #000000)</div>
              <input id="field_18" {...register(`variants.${index}.colorHex`)} className="w-full rounded-xl border border-border p-1.5 text-base md:text-sm" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled={createProduct.isPending || updateProduct.isPending}>
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
