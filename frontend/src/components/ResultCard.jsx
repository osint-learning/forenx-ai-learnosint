function ResultCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">
        {title}
      </h2>

      {children}
    </div>
  );
}

export default ResultCard;