type SearchBarProps = {
  visible: boolean;
};

export default function SearchBar({ visible }: SearchBarProps) {
  return (
    <div
      className={`
        overflow-hidden transition-all duration-300
        ${visible ? "max-h-28 opacity-100" : "max-h-0 opacity-0"}
      `}
    >
      <div className="bg-zinc-950/90 backdrop-blur border-t border-zinc-800 px-4 sm:px-10 py-4">

        <input
          type="text"
          placeholder="Search products..."
          className="
            w-full rounded-full bg-zinc-900 border border-zinc-700 px-6 py-3
            text-white placeholder-zinc-400
            focus:outline-none focus:border-white transition
          "
        />

      </div>
    </div>
  );
}
