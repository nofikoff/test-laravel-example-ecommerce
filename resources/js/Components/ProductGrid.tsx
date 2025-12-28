import { useTranslation } from '@/hooks/useTranslation';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    const { t } = useTranslation();

    if (products.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-lg text-gray-500">{t('products.noProducts')}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
