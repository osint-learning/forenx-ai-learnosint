function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2">
      <span className="font-semibold">{label}</span>

      <span className="text-gray-700 break-all">
        {value || "N/A"}
      </span>
    </div>
  );
}

export default InfoRow;