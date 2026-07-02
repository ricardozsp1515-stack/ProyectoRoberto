interface PdfCardProps {
  fileName: string;
}

export default function PdfCard({
  fileName,
}: PdfCardProps) {
  return (
    <div className="border border-green-400 rounded-xl p-4 flex justify-between">
      <span>{fileName}</span>

      <span className="text-green-800 text-xl">
        ⬇
      </span>
    </div>
  );
}