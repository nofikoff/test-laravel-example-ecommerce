interface QuantitySelectorProps {
    quantity: number;
    maxQuantity: number;
    onChange: (quantity: number) => void;
    disabled?: boolean;
}

export default function QuantitySelector({
    quantity,
    maxQuantity,
    onChange,
    disabled = false,
}: QuantitySelectorProps) {
    const handleDecrement = () => {
        if (quantity > 1) {
            onChange(quantity - 1);
        }
    };

    const handleIncrement = () => {
        if (quantity < maxQuantity) {
            onChange(quantity + 1);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || quantity <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
                -
            </button>

            <span className="w-12 text-center font-medium">{quantity}</span>

            <button
                type="button"
                onClick={handleIncrement}
                disabled={disabled || quantity >= maxQuantity}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
                +
            </button>
        </div>
    );
}
