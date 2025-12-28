import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductGrid from '@/Components/ProductGrid';
import CartSlideOver from '@/Components/CartSlideOver';
import { Head, usePage } from '@inertiajs/react';
import { Cart, PageProps, Product } from '@/types';
import { useState, useEffect } from 'react';

interface DashboardProps extends PageProps {
    products: Product[];
    cart: Cart | null;
    cartItemCount: number;
}

export default function Dashboard({ products, cart, cartItemCount }: DashboardProps) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { flash } = usePage<PageProps>().props;
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Products
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </span>
                        )}
                    </button>
                </div>
            }
        >
            <Head title="Products" />

            {showFlash && flash?.success && (
                <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
                    {flash.success}
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <ProductGrid products={products} />
                </div>
            </div>

            <CartSlideOver
                cart={cart}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </AuthenticatedLayout>
    );
}
