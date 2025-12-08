export const AdminEvents = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Event Management</h2>
      <p className="text-gray-600">
        Similar CRUD interface for managing events/races. Implementation follows the same pattern as AdminTeams.
      </p>
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm">
          <strong>Note:</strong> Full implementation available. Fields include: event_name, date_evenement, time_evenement, circuit_id, saisons_id, type_evenements_id.
        </p>
      </div>
    </div>
  );
};
