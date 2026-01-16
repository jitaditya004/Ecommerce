type SearchBarProps = {
  visible: boolean;
};

export default function SearchBar({ visible }: SearchBarProps) {
  return (
    <div
      className={`
        overflow-hidden transition-all duration-300
        ${visible ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}
      `}
    >
      <div className="bg-white border-t px-10 py-4">
        <input
          type="text"
          placeholder="Search products..."
          className="
            w-full rounded-full border px-6 py-3
            focus:outline-none focus:ring-2 focus:ring-black/10
          "
        />
      </div>
    </div>
  );
}
