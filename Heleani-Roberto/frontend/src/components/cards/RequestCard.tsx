import { useState } from "react";

interface RequestCardProps {
  title: string;
  subtitle: string;
  details: { label: string; value: string }[];
  onApprove: (message: string) => Promise<void>;
  onReject: (message: string) => Promise<void>;
}

export default function RequestCard({
  title,
  subtitle,
  details,
  onApprove,
  onReject,
}: RequestCardProps) {
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleApprove = async () => {
    if (!message) {
      setError("Escribe un mensaje antes de procesar la solicitud.");
      return;
    }

    setError("");
    setProcessing(true);

    try {
      await onApprove(message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!message) {
      setError("Escribe un mensaje antes de procesar la solicitud.");
      return;
    }

    setError("");
    setProcessing(true);

    try {
      await onReject(message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 flex flex-col gap-3">
      <div>
        <h3 className="text-xl font-bold text-gray-700">{title}</h3>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-1">
        {details.map((d) => (
          <p key={d.label} className="text-gray-600 text-sm">
            <span className="font-semibold">{d.label}: </span>
            {d.value}
          </p>
        ))}
      </div>

      <input
        type="text"
        placeholder="Mensaje para el usuario (obligatorio)..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="
          input
          w-full
          bg-transparent
          border-[#79C798]
          focus:outline-none
          focus:border-green-600
        "
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={processing}
          onClick={handleApprove}
          className="
            btn
            bg-green-700
            hover:bg-green-800
            border-none
            text-white!
            disabled:opacity-60
          "
        >
          Aprobar
        </button>

        <button
          type="button"
          disabled={processing}
          onClick={handleReject}
          className="
            btn
            btn-outline
            border-red-600
            text-red-600
            disabled:opacity-60
          "
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}