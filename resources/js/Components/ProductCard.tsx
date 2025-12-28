import { useTranslation } from '@/hooks/useTranslation';
import { Product } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    const [displayedStock, setDisplayedStock] = useState(product.stock_quantity);

    const handleAddToCart = () => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        if (displayedStock <= 0) {
            return;
        }

        setIsLoading(true);
        router.post(
            route('cart.store'),
            { product_id: product.id, quantity: 1 },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDisplayedStock((prev) => Math.max(0, prev - 1));
                },
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const isOutOfStock = displayedStock === 0;

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
            <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{product.name}</h3>

                <div className="mb-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                        ${Number(product.price).toFixed(2)}
                    </span>

                    {isOutOfStock ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            {t('products.outOfStock')}
                        </span>
                    ) : (
                        <span className="text-sm text-gray-500">
                            {displayedStock} {t('products.inStock')}
                        </span>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isLoading}
                    className={`w-full rounded-md px-4 py-2 font-medium transition-colors ${
                        isOutOfStock
                            ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    } ${isLoading ? 'opacity-75' : ''}`}
                >
                    {isLoading
                        ? t('products.adding')
                        : isOutOfStock
                          ? t('products.outOfStock')
                          : t('products.addToCart')}
                </button>
            </div>
        </div>
    );
}
