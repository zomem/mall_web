import { Select } from "antd";

interface SearchInputProps {
  options: Options[];
  onSearch?: (text: string) => void;
  placeholder?: string;
  value?: string | number | null;
  onChange?: (v: string | number) => void;
  style?: any;
}
const SearchInput = ({
  options = [],
  onSearch = () => {},
  placeholder = "",
  value = "",
  onChange = () => {},
  style = {},
}: SearchInputProps) => {
  const handleSearch = (newValue: string) => {
    if (onSearch) {
      onSearch(newValue);
    }
  };
  const handleChange = (newValue: string | number) => {
    onChange(newValue);
  };
  return (
    <Select
      showSearch
      value={value}
      placeholder={placeholder}
      style={style}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      options={options}
    />
  );
};

export default SearchInput;
