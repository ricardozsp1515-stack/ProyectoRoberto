import { useState } from "react";

interface VerificationUploadProps {
    title: string;
}

export default function VerificationUpload({
    title,
}: VerificationUploadProps) {
    const [uploaded, setUploaded] = useState(false);

    return (
        <div className="flex flex-col gap-2">

            <h3 className="font-semibold text-gray-700">
                {title}
            </h3>

            <button
                type="button"
                onClick={() => setUploaded(true)}
                className="
                    border-2
                    border-dashed
                    border-green-700
                    rounded-xl
                    p-4
                    text-green-700
                    hover:bg-green-50
                "
            >
                Subir documento
            </button>

            {uploaded && (
                <p className="text-green-700 text-sm">
                    Documento subido exitosamente.
                </p>
            )}

        </div>
    );
}