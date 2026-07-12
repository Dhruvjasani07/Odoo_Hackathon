import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

import api from '../api/axios';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [roiRes, feRes] = await Promise.all([
          api.get('/reports/vehicle-roi'),
          api.get('/reports/fuel-efficiency')
        ]);
        
        // Merge them by vehicleId
        const mergedReports = roiRes.data.map(roi => {
          const fe = feRes.data.find(f => f.vehicleId === roi.vehicleId);
          return {
            ...roi,
            fuelEfficiency: fe ? fe.fuelEfficiency : 0
          };
        });
        
        setReports(mergedReports);
        
        const cData = mergedReports.map(r => ({
          name: r.registrationNumber,
          'Operational Cost': parseFloat(r.totalOperationalCost) || 0
        }));
        setChartData(cData);
      } catch (err) {
        console.error('Failed to fetch reports', err);
      }
    };
    fetchReports();
  }, []);

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/reports/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vehicle_roi_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export CSV');
    }
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
                {reports.map((report) => (
                  <TableRow key={report.vehicleId}>
                    <TableCell className="font-medium">{report.registrationNumber}</TableCell>
                    <TableCell>{report.totalDistance.toFixed(2)} km</TableCell>
                    <TableCell>{report.fuelEfficiency.toFixed(2)} km/L</TableCell>
                    <TableCell>₹{report.totalOperationalCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className={`${report.roiPercent >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} font-medium px-2 py-1 rounded-full text-xs`}>
                        {report.roiPercent >= 0 ? '+' : ''}{report.roiPercent.toFixed(2)}%
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
