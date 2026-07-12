import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Label } from '../components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Wrench, CheckCircle2 } from 'lucide-react';

import api from '../api/axios';

export default function Maintenance() {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const fetchData = async () => {
    try {
      const [mRes, vRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/vehicles')
      ]);
      setRecords(mRes.data);
      setVehicles(vRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogMaintenance = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('/maintenance', {
        vehicleId: formData.get('vehicle'),
        description: formData.get('description'),
        cost: parseFloat(formData.get('cost')),
        date: new Date().toISOString().split('T')[0]
      });
      fetchData();
      e.target.reset();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log maintenance');
    }
  };

  const closeRecord = async (id) => {
    try {
      await api.put(`/maintenance/${id}/close`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to close record');
    }
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
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.registrationNumber} ({v.name})</option>
                  ))}
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
                    <TableCell className="whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{record.vehicle?.registrationNumber || 'N/A'}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={record.description}>
                      {record.description}
                    </TableCell>
                    <TableCell>₹{parseFloat(record.cost).toFixed(2)}</TableCell>
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
