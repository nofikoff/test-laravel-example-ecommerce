import { useTranslation } from '@/hooks/useTranslation';
import { Cart, CartItem as CartItemType } from '@/types';
import { router } from '@inertiajs/react';
import { Fragment, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import QuantitySelector from './QuantitySelector';

interface CartSlideOverProps {
    cart: Cart | null;
    isOpen: boolean;
    onClose: () => void;
}

function CartItemRow({ item }: { item: CartItemType }) {
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
        <div className={`flex items-center border-b py-4 ${isUpdating ? 'opacity-50' : ''}`}>
            <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                <p className="text-sm text-gray-500">
                    ${Number(item.product.price).toFixed(2)} {t('cart.each')}
                </p>
            </div>

            <div className="flex items-center space-x-4">
                <QuantitySelector
                    quantity={item.quantity}
                    maxQuantity={item.product.stock_quantity}
                    onChange={handleQuantityChange}
                    disabled={isUpdating}
                />

                <span className="w-20 text-right font-medium">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                </span>

                <button
                    onClick={handleRemove}
                    disabled={isUpdating}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default function CartSlideOver({ cart, isOpen, onClose }: CartSlideOverProps) {
    const { t } = useTranslation();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = () => {
        setIsCheckingOut(true);
        router.post(
            route('checkout.store'),
            {},
            {
                onFinish: () => {
                    setIsCheckingOut(false);
                    onClose();
                },
            }
        );
    };

    const items = cart?.items || [];
    const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <TransitionChild
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col bg-white shadow-xl">
                                        <div className="flex items-center justify-between border-b px-4 py-6">
                                            <DialogTitle className="text-lg font-medium text-gray-900">
                                                {t('cart.title')}
                                            </DialogTitle>
                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-gray-500"
                                                onClick={onClose}
                                            >
                                                <span className="sr-only">
                                                    {t('cart.closePanel')}
                                                </span>
                                                <svg
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto px-4">
                                            {items.length === 0 ? (
                                                <div className="flex h-full items-center justify-center">
                                                    <p className="text-gray-500">
                                                        {t('cart.empty')}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    {items.map((item) => (
                                                        <CartItemRow key={item.id} item={item} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {items.length > 0 && (
                                            <div className="border-t px-4 py-6">
                                                <div className="mb-4 flex items-center justify-between">
                                                    <span className="text-lg font-medium text-gray-900">
                                                        {t('cart.total')}
                                                    </span>
                                                    <span className="text-lg font-bold text-gray-900">
                                                        ${total.toFixed(2)}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={handleCheckout}
                                                    disabled={isCheckingOut}
                                                    className="w-full rounded-md bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
                                                >
                                                    {isCheckingOut
                                                        ? t('common.processing')
                                                        : t('cart.checkout')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
