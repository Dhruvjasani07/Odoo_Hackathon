import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Label } from '../components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Wrench, CheckCircle2 } from 'lucide-react';

const mockRecords = [
  { id: 1, vehicle: 'VAN-2001', description: 'Engine oil change and filter replacement', cost: '₹150.00', date: '2026-07-10', status: 'Open' },
  { id: 2, vehicle: 'TRK-1002', description: 'Brake pad replacement (front)', cost: '₹450.00', date: '2026-06-25', status: 'Closed' },
  { id: 3, vehicle: 'TRK-1001', description: 'Annual DOT Inspection', cost: '₹200.00', date: '2026-05-15', status: 'Closed' },
];

export default function Maintenance() {
  const [records, setRecords] = useState(mockRecords);

  const handleLogMaintenance = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newRecord = {
      id: Date.now(),
      vehicle: formData.get('vehicle'),
      description: formData.get('description'),
      cost: `₹${parseFloat(formData.get('cost')).toFixed(2)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Open'
    };

    setRecords([newRecord, ...records]);
    e.target.reset();
  };

  const closeRecord = (id) => {
    setRecords(records.map(r => r.id === id ? { ...r, status: 'Closed' } : r));
  };

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Logs</h1>
        <p className="text-muted-foreground mt-1">Track vehicle repairs and maintenance history.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Log Form */}
        <Card className="col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Wrench className="mr-2 h-5 w-5 text-primary" />
              Log Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogMaintenance} className="space-y-4">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <select name="vehicle" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="" disabled selected>Select Vehicle</option>
                  <option value="TRK-1001">TRK-1001</option>
                  <option value="TRK-1002">TRK-1002</option>
                  <option value="TRK-1003">TRK-1003</option>
                </select>
                <p className="text-[10px] text-muted-foreground">Only shows vehicles not currently "In Shop"</p>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea 
                  name="description" 
                  required 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Describe the issue or service performed..."
                />
              </div>
              <div className="space-y-2">
                <Label>Estimated Cost (₹)</Label>
                <Input name="cost" type="number" step="0.01" required placeholder="0.00" />
              </div>
              <Button type="submit" className="w-full">Submit Ticket</Button>
            </form>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="whitespace-nowrap">{record.date}</TableCell>
                    <TableCell className="font-medium">{record.vehicle}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={record.description}>
                      {record.description}
                    </TableCell>
                    <TableCell>{record.cost}</TableCell>
                    <TableCell>
                      {record.status === 'Open' ? (
                        <Badge variant="warning">Open</Badge>
                      ) : (
                        <Badge variant="secondary">Closed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.status === 'Open' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => closeRecord(record.id)}
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Close
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
