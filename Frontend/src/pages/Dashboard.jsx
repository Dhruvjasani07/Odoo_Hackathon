import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Truck, Activity, Wrench, Navigation, Users, Percent } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import api from '../api/axios';

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#64748b'];

export default function Dashboard() {
  const [kpis, setKpis] = useState({
    activeVehicles: 45,
    availableVehicles: 30,
    maintenanceVehicles: 12,
    activeTrips: 42,
    pendingTrips: 15,
    driversOnDuty: 50,
    fleetUtilization: 78,
    weeklyUtilization: [
      { name: 'Mon', utilization: 0 },
      { name: 'Tue', utilization: 0 },
      { name: 'Wed', utilization: 0 },
      { name: 'Thu', utilization: 0 },
      { name: 'Fri', utilization: 0 },
      { name: 'Sat', utilization: 0 },
      { name: 'Sun', utilization: 0 },
    ]
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKpis = async () => {
      setLoading(true);
      try {
        const res = await api.get('/dashboard/kpis');
        setKpis({
          activeVehicles: res.data.activeVehicles || 0,
          availableVehicles: res.data.availableVehicles || 0,
          maintenanceVehicles: res.data.inMaintenance || 0,
          activeTrips: res.data.activeTrips || 0,
          pendingTrips: res.data.pendingTrips || 0,
          driversOnDuty: res.data.driversOnDuty || 0,
          fleetUtilization: res.data.fleetUtilizationPercent || 0,
          weeklyUtilization: res.data.weeklyUtilization || kpis.weeklyUtilization
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchKpis();
  }, []);

  const fleetStatusData = [
    { name: 'Available Vehicles', value: kpis.availableVehicles },
    { name: 'Active Vehicles', value: kpis.activeVehicles },
    { name: 'In Maintenance', value: kpis.maintenanceVehicles },
    { name: 'Retired Vehicles', value: 3 }, // Mock retired
  ];



  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your fleet operations and key metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Active Vehicles" 
          value={kpis.activeVehicles} 
          icon={<Truck className="h-4 w-4 text-blue-500" />} 
        />
        <KpiCard 
          title="Available Vehicles" 
          value={kpis.availableVehicles} 
          icon={<Activity className="h-4 w-4 text-green-500" />} 
        />
        <KpiCard 
          title="In Maintenance" 
          value={kpis.maintenanceVehicles} 
          icon={<Wrench className="h-4 w-4 text-orange-500" />} 
        />
        <KpiCard 
          title="Fleet Utilization" 
          value={`${kpis.fleetUtilization}%`} 
          icon={<Percent className="h-4 w-4 text-purple-500" />} 
        />
        <KpiCard 
          title="Active Trips" 
          value={kpis.activeTrips} 
          icon={<Navigation className="h-4 w-4 text-blue-500" />} 
        />
        <KpiCard 
          title="Pending Trips" 
          value={kpis.pendingTrips} 
          icon={<Navigation className="h-4 w-4 text-yellow-500" />} 
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Fleet Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fleetStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fleetStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Weekly Utilization (%)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpis.weeklyUtilization}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="utilization" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, trend }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
      </CardContent>
    </Card>
  );
}
