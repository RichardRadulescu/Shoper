
type SearchInputProps = {
  initialValue?: string;
  onSearch: (value: string) => void;
};

export function SearchInput({ initialValue = "", onSearch }: SearchInputProps) {
  return (
    <input
      type="text"
      value={initialValue}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
