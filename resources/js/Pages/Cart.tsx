import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuantitySelector from '@/Components/QuantitySelector';
import { useTranslation } from '@/hooks/useTranslation';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Cart as CartType, CartItem, PageProps } from '@/types';
import { useState, useEffect } from 'react';

interface CartPageProps extends PageProps {
    cart: CartType | null;
    cartItemCount: number;
}

function CartItemRow({ item }: { item: CartItem }) {
    const { t } = useTranslation();
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
            <td className="px-6 py-4">
                <div>
                    <div className="font-medium text-gray-900">{item.product.name}</div>
                    <div className="text-sm text-gray-500">
                        ${Number(item.product.price).toFixed(2)} {t('cart.each')}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <QuantitySelector
                    quantity={item.quantity}
                    maxQuantity={item.product.stock_quantity}
                    onChange={handleQuantityChange}
                    disabled={isUpdating}
                />
            </td>
            <td className="px-6 py-4 text-right font-medium">
                ${(Number(item.product.price) * item.quantity).toFixed(2)}
            </td>
            <td className="px-6 py-4 text-right">
                <button
                    onClick={handleRemove}
                    disabled={isUpdating}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                    {t('cart.remove')}
                </button>
            </td>
        </tr>
    );
}

export default function Cart({ cart, cartItemCount }: CartPageProps) {
    const { t } = useTranslation();
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
        router.post(
            route('checkout.store'),
            {},
            {
                onFinish: () => setIsCheckingOut(false),
            }
        );
    };

    const items = cart?.items || [];
    const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {t('cart.title')}
                </h2>
            }
        >
            <Head title={t('cart.title')} />

            {showFlash && flash?.success && (
                <div className="fixed right-4 top-4 z-50 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700 shadow-lg">
                    {flash.success}
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {items.length === 0 ? (
                            <div className="p-12 text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mx-auto mb-4 h-16 w-16 text-gray-400"
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
                                <h3 className="mb-2 text-lg font-medium text-gray-900">
                                    {t('cart.empty')}
                                </h3>
                                <p className="mb-6 text-gray-500">{t('cart.emptyDescription')}</p>
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
                                >
                                    {t('cart.browseProducts')}
                                </Link>
                            </div>
                        ) : (
                            <>
                                <table className="w-full">
                                    <thead className="border-b bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                {t('cart.table.product')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                {t('cart.table.quantity')}
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                {t('cart.table.subtotal')}
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                {t('cart.table.action')}
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
                                            <td
                                                colSpan={2}
                                                className="px-6 py-4 text-right font-medium text-gray-900"
                                            >
                                                {t('cart.total')}:
                                            </td>
                                            <td className="px-6 py-4 text-right text-xl font-bold text-gray-900">
                                                ${total.toFixed(2)}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>

                                <div className="flex items-center justify-between border-t p-6">
                                    <Link
                                        href={route('dashboard')}
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        &larr; {t('cart.continueShopping')}
                                    </Link>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={isCheckingOut}
                                        className="rounded-md bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
                                    >
                                        {isCheckingOut
                                            ? t('common.processing')
                                            : t('cart.proceedToCheckout')}
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
