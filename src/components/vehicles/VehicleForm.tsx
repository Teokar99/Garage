import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { logError } from '../../utils/errorHandler';

interface VehicleFormProps {
  customerId: string;
  onClose: () => void;
  onSave: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ customerId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    vin: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('vehicles')
        .insert([{
          ...formData,
          customer_id: customerId
        }]);

      if (error) throw error;

      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        license_plate: '',
        vin: ''
      });
      onSave();
      onClose();
    } catch (error) {
      logError('Error adding vehicle', error);
      alert('Error adding vehicle');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
        <input
          type="text"
          required
          value={formData.make}
          onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Toyota, Ford, BMW"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
        <input
          type="text"
          required
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Camry, F-150, X3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
        <input
          type="number"
          required
          min="1900"
          max={new Date().getFullYear() + 1}
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
        <input
          type="text"
          value={formData.license_plate}
          onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., ABC-1234"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
        <input
          type="text"
          value={formData.vin}
          onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="17-character VIN"
          maxLength={17}
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Add Vehicle
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
