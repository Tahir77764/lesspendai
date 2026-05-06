export function SpendForm() {
  return (
    <form className="flex flex-col gap-4 max-w-md mx-auto mt-10">
      <label className="flex flex-col gap-2">
        <span className="font-medium">Upload Cloud Bill (CSV/PDF)</span>
        <input type="file" className="border p-2 rounded" />
      </label>
      <button 
        type="submit" 
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Analyze Spend
      </button>
    </form>
  );
}
