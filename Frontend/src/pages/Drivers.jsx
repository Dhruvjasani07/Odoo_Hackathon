import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Label } from '../components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Search, Plus, Edit2, ShieldAlert } from 'lucide-react';

const mockDrivers = [
  { id: 1, name: 'John Doe', licenseNumber: 'DL-100234', licenseCategory: 'Class A', expiryDate: '2026-10-15', safetyScore: 98, status: 'Available' },
  { id: 2, name: 'Jane Smith', licenseNumber: 'DL-908721', licenseCategory: 'Class B', expiryDate: '2024-05-10', safetyScore: 85, status: 'On Trip' },
  { id: 3, name: 'Mike Johnson', licenseNumber: 'DL-456123', licenseCategory: 'Class A', expiryDate: '2027-01-20', safetyScore: 92, status: 'Available' },
  { id: 4, name: 'Robert Lee', licenseNumber: 'DL-789012', licenseCategory: 'Class C', expiryDate: '2023-11-05', safetyScore: 76, status: 'Suspended' },
];

export default function Drivers() {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Available': return <Badge variant="success">{status}</Badge>;
      case 'On Trip': return <Badge variant="info">{status}</Badge>;
      case 'Suspended': return <Badge variant="destructive">{status}</Badge>;
      case 'Off Duty': return <Badge variant="secondary">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Driver Management</h1>
          <p className="text-muted-foreground mt-1">Manage personnel, licenses, and safety scores.</p>
        </div>
        <Button onClick={() => { setEditingDriver(null); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Driver
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by Name or License no..."
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
                <TableHead>Name</TableHead>
                <TableHead>License No.</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Safety Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => {
                const expired = isExpired(driver.expiryDate);
                return (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell>{driver.licenseNumber}</TableCell>
                    <TableCell>{driver.licenseCategory}</TableCell>
                    <TableCell className={expired ? "text-destructive font-medium flex items-center gap-1" : ""}>
                      {driver.expiryDate}
                      {expired && <ShieldAlert className="h-4 w-4" />}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${driver.safetyScore > 90 ? 'bg-green-500' : driver.safetyScore > 80 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${driver.safetyScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{driver.safetyScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(driver.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => { setEditingDriver(driver); setIsModalOpen(true); }}
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingDriver ? "Edit Driver" : "Add New Driver"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={editingDriver?.name} required />
            </div>
            <div className="space-y-2">
              <Label>License Number</Label>
              <Input defaultValue={editingDriver?.licenseNumber} required />
            </div>
            <div className="space-y-2">
              <Label>License Category</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>Class A</option>
                <option>Class B</option>
                <option>Class C</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input type="date" defaultValue={editingDriver?.expiryDate} required />
            </div>
            <div className="space-y-2">
              <Label>Safety Score</Label>
              <Input type="number" min="0" max="100" defaultValue={editingDriver?.safetyScore || 100} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>Available</option>
                <option>On Trip</option>
                <option>Suspended</option>
                <option>Off Duty</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Driver</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
