interface RegisterInputProps {
  type?: string;
  placeholder: string;

  value?: string;

  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function RegisterInput({
  type = "text",
  placeholder,
  value,
  onChange,
}: RegisterInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        input
        w-full
        bg-transparent
        border-[#79C798]
        focus:outline-none
        focus:border-green-600
      "
    />
  );
}