import { TRIP_CONFIG } from '@/data/tripConfig';

export function GroupCoordCard() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h3 className="font-bold text-blue-900 flex items-center gap-2 text-sm">
        👥 Group of {TRIP_CONFIG.groupSize} — Coordination Notes
      </h3>
      <div className="mt-2 space-y-1.5 text-sm text-blue-800">
        <p>• Split into <strong>Party A ({TRIP_CONFIG.partyA} guests)</strong> and <strong>Party B ({TRIP_CONFIG.partyB} guests)</strong> for all LLSP bookings (Disney max: 12 per transaction)</p>
        <p>• Two designated <strong>lead bookers</strong> must purchase simultaneously at <strong>7:00 AM ET sharp</strong></p>
        <p>• Target the <strong>same return window</strong> so all 15 experience rides together</p>
        <p>• Ensure all 15 guests are linked in <strong>My Disney Experience (MDE)</strong> before trip</p>
      </div>
    </div>
  );
}
