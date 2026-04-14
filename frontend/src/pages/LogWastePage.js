import React, { useState } from 'react';
import { wasteLogAPI } from '../services/api';
import { Select, Input, Button, Card } from '../components/UI';

const DINING_HALLS = ['Main Dining Hall', 'North Cafeteria', 'South Commons', 'West Bistro'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const FOOD_CATEGORIES = ['Grains & Bread', 'Dairy', 'Fruits', 'Vegetables', 'Meat & Protein', 'Beverages', 'Desserts', 'Prepared Meals'];
const WASTE_REASONS = ['Overcooked', 'Undercooked', 'Too Much Served', "Didn't Like Taste", 'Expired', 'Contaminated', 'Leftover from Event', 'Other'];

export default function LogWastePage() {
  const [form, setForm] = useState({
    dining_hall: DINING_HALLS[0],
    meal_type: MEAL_TYPES[0],
    food_category: FOOD_CATEGORIES[0],
    quantity_kg: '',
    reason: WASTE_REASONS[0],
    notes: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.quantity_kg || +form.quantity_kg <= 0) return;
    setLoading(true);
    setError('');
    try {
      await wasteLogAPI.create({ ...form, quantity_kg: +form.quantity_kg });
      setSuccess(true);
      setForm(f => ({ ...f, quantity_kg: '', notes: '' }));
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to log entry');
    }
    setLoading(false);
  };

  const qty = parseFloat(form.quantity_kg) || 0;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8 animate-fade-slide">
        <span className="text-5xl">📝</span>
        <h2 className="text-xl font-bold text-gray-100 mt-3">Log Food Waste</h2>
        <p className="text-sm text-gray-500 mt-1">Every entry helps us reduce campus food waste</p>
      </div>

      <Card className="animate-fade-slide" style={{ animationDelay: '0.1s' }}>
        {success && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-2">
            ✅ Entry logged successfully! Your contribution matters.
          </div>
        )}

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Select label="Dining Hall" value={form.dining_hall} onChange={set('dining_hall')} options={DINING_HALLS} />
          <Select label="Meal Type" value={form.meal_type} onChange={set('meal_type')} options={MEAL_TYPES} />
          <Select label="Food Category" value={form.food_category} onChange={set('food_category')} options={FOOD_CATEGORIES} />
          <Select label="Reason" value={form.reason} onChange={set('reason')} options={WASTE_REASONS} />
          <Input label="Quantity (kg)" type="number" value={form.quantity_kg} onChange={set('quantity_kg')} placeholder="e.g. 12.5" />
          <Input label="Notes (optional)" value={form.notes} onChange={set('notes')} placeholder="Additional details..." />
        </div>

        {/* Impact Preview */}
        {qty > 0 && (
          <div className="mt-5 p-4 rounded-xl bg-primary-400/5 border border-primary-400/20 grid grid-cols-3 gap-4 text-center animate-fade-slide">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">CO₂ Impact</p>
              <p className="text-lg font-bold font-mono text-yellow-400 mt-1">{(qty * 2.5).toFixed(1)} kg</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Cost Impact</p>
              <p className="text-lg font-bold font-mono text-primary-400 mt-1">${(qty * 3.2).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Meals Equiv.</p>
              <p className="text-lg font-bold font-mono text-emerald-400 mt-1">{Math.round(qty * 2.5)}</p>
            </div>
          </div>
        )}

        <Button onClick={handleSubmit} disabled={!qty || loading} className="w-full mt-5">
          {loading ? '⏳ Submitting...' : '📤 Submit Waste Log'}
        </Button>
      </Card>
    </div>
  );
}
