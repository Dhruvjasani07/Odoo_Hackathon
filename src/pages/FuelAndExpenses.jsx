import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Fuel, Receipt } from 'lucide-react';

const mockLogs = [
  { id: 1, type: 'Fuel', vehicle: 'TRK-1001', amount: '120 L', cost: 180.50, date: '2026-07-11' },
  { id: 2, type: 'Toll', vehicle: 'TRK-1002', amount: '-', cost: 45.00, date: '2026-07-10' },
  { id: 3, type: 'Fuel', vehicle: 'VAN-2001', amount: '65 L', cost: 95.20, date: '2026-07-09' },
  { id: 4, type: 'Parking', vehicle: 'TRK-1001', amount: '-', cost: 25.00, date: '2026-07-08' },
];

export default function FuelAndExpenses() {
  const [logs, setLogs] = useState(mockLogs);

  const handleFuelSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newLog = {
      id: Date.now(),
      type: 'Fuel',
      vehicle: formData.get('vehicle'),
      amount: `${formData.get('liters')} L`,
      cost: parseFloat(formData.get('cost')),
      date: formData.get('date')
    };
    setLogs([newLog, ...logs]);
    e.target.reset();
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newLog = {
      id: Date.now(),
      type: formData.get('type'),
      vehicle: formData.get('vehicle'),
      amount: '-',
      cost: parseFloat(formData.get('cost')),
      date: formData.get('date')
    };
    setLogs([newLog, ...logs]);
    e.target.reset();
  };

  const totalCost = logs.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fuel & Expenses</h1>
        <p className="text-muted-foreground mt-1">Log fuel refills and other operational expenses.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Fuel Form */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Fuel className="mr-2 h-5 w-5 text-blue-500" />
              Log Fuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFuelSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <select name="vehicle" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="" disabled selected>Select Vehicle</option>
                  <option value="TRK-1001">TRK-1001</option>
                  <option value="TRK-1002">TRK-1002</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Volume (Liters)</Label>
                <Input name="liters" type="number" step="0.1" required />
              </div>
              <div className="space-y-2">
                <Label>Total Cost (₹)</Label>
                <Input name="cost" type="number" step="0.01" required />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <Button type="submit" className="w-full">Save Fuel Log</Button>
            </form>
          </CardContent>
        </Card>

        {/* Expense Form */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Receipt className="mr-2 h-5 w-5 text-orange-500" />
              Log Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Vehicle (Optional)</Label>
                <select name="vehicle" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="None">None (General)</option>
                  <option value="TRK-1001">TRK-1001</option>
                  <option value="TRK-1002">TRK-1002</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Expense Type</Label>
                <select name="type" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="Toll">Toll</option>
                  <option value="Parking">Parking</option>
                  <option value="Permit">Permit/License</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Total Cost (₹)</Label>
                <Input name="cost" type="number" step="0.01" required />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <Button type="submit" className="w-full" variant="secondary">Save Expense</Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card className="col-span-1 lg:col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Entries</CardTitle>
            <div className="text-lg font-bold text-primary">Total: ₹{totalCost.toFixed(2)}</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {logs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${log.type === 'Fuel' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                      {log.type === 'Fuel' ? <Fuel className="h-4 w-4" /> : <Receipt className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{log.vehicle !== 'None' ? log.vehicle : 'General'} - {log.type}</p>
                      <p className="text-xs text-muted-foreground">{log.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">₹{log.cost.toFixed(2)}</p>
                    {log.amount !== '-' && <p className="text-xs text-muted-foreground">{log.amount}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
