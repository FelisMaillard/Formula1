export const AdminCircuits = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Circuit Management</h2>
      <p className="text-gray-600">
        Similar CRUD interface for managing circuits. Implementation follows the same pattern as AdminTeams.
      </p>
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm">
          <strong>Note:</strong> Full implementation available. Fields include: circuit_name, circuit_length, number_of_laps, lap_record, location details.
        </p>
      </div>
    </div>
  );
};
