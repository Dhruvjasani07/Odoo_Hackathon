import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Label } from '../components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

const mockVehicles = [
  { id: 1, regNo: 'TRK-1001', name: 'Volvo FH16', type: 'Heavy Duty', maxLoad: '40T', odometer: '125,000 km', status: 'Available', region: 'North' },
  { id: 2, regNo: 'TRK-1002', name: 'Scania R500', type: 'Heavy Duty', maxLoad: '38T', odometer: '89,000 km', status: 'On Trip', region: 'South' },
  { id: 3, regNo: 'VAN-2001', name: 'Ford Transit', type: 'Light Commercial', maxLoad: '2T', odometer: '45,000 km', status: 'In Shop', region: 'East' },
  { id: 4, regNo: 'TRK-1003', name: 'Volvo FH16', type: 'Heavy Duty', maxLoad: '40T', odometer: '320,000 km', status: 'Retired', region: 'North' },
];

export default function Vehicles() {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const filteredVehicles = vehicles.filter(v => 
    v.regNo.toLowerCase().includes(search.toLowerCase()) ||
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate save
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Available': return <Badge variant="success">{status}</Badge>;
      case 'On Trip': return <Badge variant="info">{status}</Badge>;
      case 'In Shop': return <Badge variant="warning">{status}</Badge>;
      case 'Retired': return <Badge variant="outline" className="text-muted-foreground">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Registration</h1>
          <p className="text-muted-foreground mt-1">Manage your fleet vehicles and their current status.</p>
        </div>
        <Button onClick={() => { setEditingVehicle(null); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by Registration no or Name..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reg No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Max Load</TableHead>
                <TableHead>Odometer</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.regNo}</TableCell>
                  <TableCell>{vehicle.name}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.maxLoad}</TableCell>
                  <TableCell>{vehicle.odometer}</TableCell>
                  <TableCell>{vehicle.region}</TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => { setEditingVehicle(vehicle); setIsModalOpen(true); }}
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive opacity-70 hover:opacity-100" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredVehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No vehicles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Registration Number</Label>
              <Input defaultValue={editingVehicle?.regNo} required />
            </div>
            <div className="space-y-2">
              <Label>Vehicle Name</Label>
              <Input defaultValue={editingVehicle?.name} required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>Heavy Duty</option>
                <option>Light Commercial</option>
                <option>Passenger</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Max Load</Label>
              <Input defaultValue={editingVehicle?.maxLoad} required />
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>North</option>
                <option>South</option>
                <option>East</option>
                <option>West</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>Available</option>
                <option>On Trip</option>
                <option>In Shop</option>
                <option>Retired</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Vehicle</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
