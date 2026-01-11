const DetailRow = ({ label, content }) => {
    if (!content) return null;
    return (
        <div>
            <h4 className="font-semibold text-gray-500 text-xs uppercase mb-0.5">{label}</h4>
            <p className="text-gray-800 leading-relaxed bg-white p-2 rounded border border-gray-100">{content}</p>
        </div>
    );
};

export default DetailRow;
