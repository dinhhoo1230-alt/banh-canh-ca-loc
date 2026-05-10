"use client";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onChange,
  min = 0,
  max = 99,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-300 transition-colors"
        disabled={quantity <= min}
      >
        -
      </button>
      <span className="w-8 text-center font-semibold">{quantity}</span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-lg font-bold hover:bg-amber-600 transition-colors"
        disabled={quantity >= max}
      >
        +
      </button>
    </div>
  );
}
