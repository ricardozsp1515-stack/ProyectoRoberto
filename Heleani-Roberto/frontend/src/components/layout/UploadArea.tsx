import { useState } from "react";

interface UploadAreaProps {
  text: string;
  successMessage: string;
  height?: string;
}

export default function UploadArea({
  text,
  successMessage,
  height = "h-44",
}: UploadAreaProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpload = () => {
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleUpload}
        className={`
          w-full
          ${height}
          border
          border-green-600
          rounded-3xl
          flex
          flex-col
          items-center
          justify-center
          bg-transparent
        `}
      >
        <span className="text-green-800 text-4xl">↥</span>

        <span className="text-gray-700 text-xl">
          {text}
        </span>
      </button>

      {showSuccess && (
        <div className="mt-3 bg-green-700 text-white px-3 py-1 text-sm">
          {successMessage}
        </div>
      )}
    </div>
  );
}