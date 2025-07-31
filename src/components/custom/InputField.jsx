const InputField = ({ label, placeholder, icon, value, onChange, type = "text", name, required = false }) => (
  <div className="flex flex-col gap-1">
    <label className="text-base font-semibold text-black flex items-center gap-2">
      <img src={icon} className="w-5 h-5" alt="" />
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="bg-gray-50 px-4 py-3 rounded-xl text-xs font-semibold text-gray-500 w-full border border-gray-200 focus:border-red-500 focus:outline-none"
      value={value}
      onChange={onChange}
      name={name}
      required={required}
    />
  </div>
);
export default InputField;