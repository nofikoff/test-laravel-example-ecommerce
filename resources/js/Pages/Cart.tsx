import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuantitySelector from '@/Components/QuantitySelector';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Cart as CartType, CartItem, PageProps } from '@/types';
import { useState, useEffect } from 'react';

interface CartPageProps extends PageProps {
    cart: CartType | null;
    cartItemCount: number;
}

function CartItemRow({ item }: { item: CartItem }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleQuantityChange = (newQuantity: number) => {
        setIsUpdating(true);
        router.patch(
            route('cart.update', item.id),
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onFinish: () => setIsUpdating(false),
            }
        );
    };

    const handleRemove = () => {
        setIsUpdating(true);
        router.delete(route('cart.destroy', item.id), {
            preserveScroll: true,
            onFinish: () => setIsUpdating(false),
        });
    };

    return (
        <tr className={isUpdating ? 'opacity-50' : ''}>
            <td className="py-4 px-6">
                <div>
                    <div className="font-medium text-gray-900">{item.product.name}</div>
                    <div className="text-sm text-gray-500">
                        ${Number(item.product.price).toFixed(2)} each
                    </div>
                </div>
            </td>
            <td className="py-4 px-6">
                <QuantitySelector
                    quantity={item.quantity}
                    maxQuantity={item.product.stock_quantity}
                    onChange={handleQuantityChange}
                    disabled={isUpdating}
                />
            </td>
            <td className="py-4 px-6 text-right font-medium">
                ${(Number(item.product.price) * item.quantity).toFixed(2)}
            </td>
            <td className="py-4 px-6 text-right">
                <button
                    onClick={handleRemove}
                    disabled={isUpdating}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                    Remove
                </button>
            </td>
        </tr>
    );
}

export default function Cart({ cart, cartItemCount }: CartPageProps) {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const { flash } = usePage<PageProps>().props;
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    const handleCheckout = () => {
        setIsCheckingOut(true);
        router.post(route('checkout.store'), {}, {
            onFinish: () => setIsCheckingOut(false),
        });
    };

    const items = cart?.items || [];
    const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Shopping Cart
                </h2>
            }
        >
            <Head title="Cart" />

            {showFlash && flash?.success && (
                <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
                    {flash.success}
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        {items.length === 0 ? (
                            <div className="p-12 text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 mx-auto text-gray-400 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Your cart is empty
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Add some products to get started.
                                </p>
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700"
                                >
                                    Browse Products
                                </Link>
                            </div>
                        ) : (
                            <>
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Subtotal
                                            </th>
                                            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {items.map((item) => (
                                            <CartItemRow key={item.id} item={item} />
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan={2} className="py-4 px-6 text-right font-medium text-gray-900">
                                                Total:
                                            </td>
                                            <td className="py-4 px-6 text-right text-xl font-bold text-gray-900">
                                                ${total.toFixed(2)}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>

                                <div className="p-6 border-t flex justify-between items-center">
                                    <Link
                                        href={route('dashboard')}
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        &larr; Continue Shopping
                                    </Link>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={isCheckingOut}
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75"
                                    >
                                        {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
