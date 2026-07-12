import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const mockReports = [
  { id: 1, vehicle: 'TRK-1001 (Volvo)', distance: '12,500 km', fuelEfficiency: '3.2 km/L', opsCost: 4500.50, roi: '+12.5%' },
  { id: 2, vehicle: 'TRK-1002 (Scania)', distance: '10,200 km', fuelEfficiency: '2.9 km/L', opsCost: 4100.00, roi: '+8.2%' },
  { id: 3, vehicle: 'VAN-2001 (Ford)', distance: '4,500 km', fuelEfficiency: '8.5 km/L', opsCost: 1200.75, roi: '+22.1%' },
  { id: 4, vehicle: 'TRK-1003 (Volvo)', distance: '15,800 km', fuelEfficiency: '3.4 km/L', opsCost: 5200.25, roi: '+15.4%' },
];

const chartData = mockReports.map(r => ({
  name: r.vehicle.split(' ')[0],
  'Operational Cost': r.opsCost
}));

export default function Reports() {
  const handleExportCSV = () => {
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8,Vehicle,Distance,Fuel Efficiency,Operational Cost,ROI\n" + 
      mockReports.map(e => `${e.vehicle},${e.distance},${e.fuelEfficiency},${e.opsCost},${e.roi}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transitops_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Operational cost and efficiency metrics.</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="bg-background">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Operational Cost Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Operational Cost']}
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="Operational Cost" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Vehicle ROI & Efficiency Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Distance Traveled</TableHead>
                  <TableHead>Fuel Efficiency</TableHead>
                  <TableHead>Operational Cost</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.vehicle}</TableCell>
                    <TableCell>{report.distance}</TableCell>
                    <TableCell>{report.fuelEfficiency}</TableCell>
                    <TableCell>₹{report.opsCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full text-xs">
                        {report.roi}
                      </span>
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
