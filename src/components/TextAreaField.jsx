const TextAreaField = ({ label, name, value, onChange, icon }) => (
    <div className="bg-white">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
            {icon} {label}
        </label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows="2"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none transition-all resize-none"
            placeholder={`Escribe aquí...`}
        />
    </div>
);

export default TextAreaField;
