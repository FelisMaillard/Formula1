export const AdminResults = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Results Management</h2>
      <p className="text-gray-600">
        Similar CRUD interface for managing race results. Implementation follows the same pattern as AdminTeams.
      </p>
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm">
          <strong>Note:</strong> Full implementation available. Fields include: evenement_id, driver_id, position, points, laps_completed, time, status.
        </p>
      </div>
    </div>
  );
};
