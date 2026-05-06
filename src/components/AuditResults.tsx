export function AuditResults() {
  return (
    <div className="border border-gray-200 p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Potential Savings</h2>
      <div className="bg-green-50 text-green-800 p-4 rounded mb-4">
        <p className="text-lg">We found <strong>$500.00</strong> in potential monthly savings.</p>
      </div>
      <ul className="list-disc pl-5 space-y-2">
        <li>Resize EC2 instances</li>
        <li>Delete unattached EBS volumes</li>
      </ul>
    </div>
  );
}
