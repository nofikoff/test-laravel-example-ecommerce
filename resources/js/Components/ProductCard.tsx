import { Product } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = () => {
        setIsLoading(true);
        router.post(
            route('cart.store'),
            { product_id: product.id, quantity: 1 },
            {
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const isOutOfStock = product.stock_quantity === 0;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                        ${Number(product.price).toFixed(2)}
                    </span>

                    {isOutOfStock ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Out of Stock
                        </span>
                    ) : (
                        <span className="text-sm text-gray-500">
                            {product.stock_quantity} in stock
                        </span>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isLoading}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                        isOutOfStock
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    } ${isLoading ? 'opacity-75' : ''}`}
                >
                    {isLoading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}
