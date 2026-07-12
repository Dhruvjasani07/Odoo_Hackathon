import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Label } from '../components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Search, Plus, Edit2, ShieldAlert, Trash2 } from 'lucide-react';

import api from '../api/axios';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseCategory: 'Class A',
    licenseExpiryDate: '',
    contactNumber: '',
    safetyScore: 100,
    status: 'Available'
  });

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/drivers');
      setDrivers(res.data);
    } catch (err) {
      console.error('Failed to fetch drivers', err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        await api.put(`/drivers/${editingDriver.id}`, formData);
      } else {
        await api.post('/drivers', formData);
      }
      setIsModalOpen(false);
      fetchDrivers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save driver');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await api.delete(`/drivers/${id}`);
        fetchDrivers();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete driver');
      }
    }
  };

  const openModal = (driver = null) => {
    setEditingDriver(driver);
    if (driver) {
      setFormData({
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        licenseCategory: driver.licenseCategory,
        licenseExpiryDate: driver.licenseExpiryDate,
        contactNumber: driver.contactNumber || '',
        safetyScore: driver.safetyScore,
        status: driver.status
      });
    } else {
      setFormData({
        name: '',
        licenseNumber: '',
        licenseCategory: 'Class A',
        licenseExpiryDate: '',
        contactNumber: '',
        safetyScore: 100,
        status: 'Available'
      });
    }
    setIsModalOpen(true);
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
        <Button onClick={() => openModal()}>
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
                <TableHead>Contact No.</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Safety Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => {
                const expired = isExpired(driver.licenseExpiryDate);
                return (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell>{driver.licenseNumber}</TableCell>
                    <TableCell>{driver.contactNumber || '-'}</TableCell>
                    <TableCell>{driver.licenseCategory}</TableCell>
                    <TableCell className={expired ? "text-destructive font-medium flex items-center gap-1" : ""}>
                      {driver.licenseExpiryDate}
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
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openModal(driver)}
                        >
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(driver.id)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
              <Input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>License Number</Label>
              <Input 
                value={formData.licenseNumber} 
                onChange={e => setFormData({...formData, licenseNumber: e.target.value})} 
                required
                minLength={15}
                maxLength={15}
                title="License number must be exactly 15 characters long"
              />
            </div>
            <div className="space-y-2">
              <Label>License Category</Label>
              <select 
                value={formData.licenseCategory} 
                onChange={e => setFormData({...formData, licenseCategory: e.target.value})} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option>Class A</option>
                <option>Class B</option>
                <option>Class C</option>
                <option>Class D</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input 
                type="date" 
                value={formData.licenseExpiryDate} 
                onChange={e => setFormData({...formData, licenseExpiryDate: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input 
                type="tel"
                placeholder="e.g. 9876543210"
                value={formData.contactNumber} 
                onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                pattern="\d{10}"
                title="Contact number must be exactly 10 digits"
                maxLength={10}
              />
            </div>
            <div className="space-y-2">
              <Label>Safety Score</Label>
              <Input 
                type="number" 
                min="0" 
                max="100" 
                value={formData.safetyScore} 
                onChange={e => setFormData({...formData, safetyScore: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
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
