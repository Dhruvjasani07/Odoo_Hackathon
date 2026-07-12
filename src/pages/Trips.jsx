import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Label } from '../components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Play, CheckCircle2, XCircle } from 'lucide-react';

const mockTrips = [
  { id: 1, source: 'New York, NY', destination: 'Boston, MA', vehicle: 'TRK-1001', driver: 'John Doe', status: 'Dispatched', cargoWeight: '15T' },
  { id: 2, source: 'Chicago, IL', destination: 'Detroit, MI', vehicle: 'TRK-1002', driver: 'Jane Smith', status: 'Draft', cargoWeight: '20T' },
  { id: 3, source: 'Los Angeles, CA', destination: 'Las Vegas, NV', vehicle: 'VAN-2001', driver: 'Mike Johnson', status: 'Completed', cargoWeight: '1.5T' },
  { id: 4, source: 'Miami, FL', destination: 'Orlando, FL', vehicle: 'TRK-1003', driver: 'Robert Lee', status: 'Cancelled', cargoWeight: '10T' },
];

export default function Trips() {
  const [trips, setTrips] = useState(mockTrips);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [validationError, setValidationError] = useState('');

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Draft': return <Badge variant="secondary">{status}</Badge>;
      case 'Dispatched': return <Badge variant="info">{status}</Badge>;
      case 'Completed': return <Badge variant="success">{status}</Badge>;
      case 'Cancelled': return <Badge variant="destructive">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleCreateTrip = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cargoWeight = parseFloat(formData.get('cargoWeight'));
    
    // Simulate validation error (mock vehicle max capacity is 40T for heavy duty)
    if (cargoWeight > 40) {
      setValidationError('Cargo exceeds maximum vehicle capacity (40T)');
      return;
    }

    setValidationError('');
    setIsNewModalOpen(false);
  };

  const handleCompleteTrip = (e) => {
    e.preventDefault();
    setIsCompleteModalOpen(false);
  };

  const updateStatus = (id, newStatus) => {
    setTrips(trips.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trip Management</h1>
          <p className="text-muted-foreground mt-1">Dispatch and track active routes.</p>
        </div>
        <Button onClick={() => { setValidationError(''); setIsNewModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> New Trip
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{trip.source}</span>
                      <span className="text-xs text-muted-foreground">to {trip.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell>{trip.vehicle}</TableCell>
                  <TableCell>{trip.driver}</TableCell>
                  <TableCell>{trip.cargoWeight}</TableCell>
                  <TableCell>{getStatusBadge(trip.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {trip.status === 'Draft' && (
                        <Button variant="outline" size="sm" onClick={() => updateStatus(trip.id, 'Dispatched')}>
                          <Play className="mr-1 h-3 w-3" /> Dispatch
                        </Button>
                      )}
                      {trip.status === 'Dispatched' && (
                        <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => { setSelectedTrip(trip); setIsCompleteModalOpen(true); }}>
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Complete
                        </Button>
                      )}
                      {(trip.status === 'Draft' || trip.status === 'Dispatched') && (
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => updateStatus(trip.id, 'Cancelled')}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Trip Modal */}
      <Modal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} title="Create New Trip">
        <form onSubmit={handleCreateTrip} className="space-y-4">
          {validationError && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
              {validationError}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Source</Label>
              <Input name="source" placeholder="Origin City" required />
            </div>
            <div className="space-y-2">
              <Label>Destination</Label>
              <Input name="destination" placeholder="Destination City" required />
            </div>
            <div className="space-y-2">
              <Label>Vehicle (Available)</Label>
              <select name="vehicle" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>TRK-1001 (Volvo FH16)</option>
                <option>TRK-1002 (Scania R500)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Driver (Available)</Label>
              <select name="driver" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>John Doe</option>
                <option>Mike Johnson</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Cargo Weight (Tons)</Label>
              <Input name="cargoWeight" type="number" step="0.1" required />
            </div>
            <div className="space-y-2">
              <Label>Planned Distance (km)</Label>
              <Input name="distance" type="number" required />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsNewModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Draft</Button>
          </div>
        </form>
      </Modal>

      {/* Complete Trip Modal */}
      <Modal isOpen={isCompleteModalOpen} onClose={() => setIsCompleteModalOpen(false)} title="Complete Trip">
        <form onSubmit={handleCompleteTrip} className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">Please log final trip details for <strong>{selectedTrip?.source} to {selectedTrip?.destination}</strong>.</p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Actual Distance (km)</Label>
              <Input type="number" required />
            </div>
            <div className="space-y-2">
              <Label>Fuel Consumed (Liters)</Label>
              <Input type="number" required />
            </div>
            <div className="space-y-2">
              <Label>Ending Odometer</Label>
              <Input type="number" required />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsCompleteModalOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={() => selectedTrip && updateStatus(selectedTrip.id, 'Completed')}>Mark Completed</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
