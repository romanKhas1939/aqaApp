export default function Select({ options, onChange, className }) {
  return (
    <select className={`border px-3 py-2 rounded-md ${className}`} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
