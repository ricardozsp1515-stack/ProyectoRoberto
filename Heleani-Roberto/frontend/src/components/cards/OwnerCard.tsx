interface OwnerCardProps {
  name: string;
  email: string;
  imageUrl: string;
}

export default function OwnerCard({
  name,
  email,
  imageUrl,
}: OwnerCardProps) {
  return (
    <div className="border border-green-400 rounded-xl p-3 flex justify-between items-center">
      <div className="flex gap-3 items-center">

        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src={imageUrl} alt={name} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">
            {name}
          </h3>

          <p className="text-sm text-gray-500">
            {email}
          </p>
        </div>

      </div>

      <span className="text-green-800 text-2xl">
        ✉
      </span>
    </div>
  );
}