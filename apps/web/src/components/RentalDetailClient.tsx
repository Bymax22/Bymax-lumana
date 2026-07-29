"use client";

import React, { useState } from 'react';
import { publicApi } from '@/lib/publicApi';
import ConvertedAmount from '@/components/ConvertedAmount';

export default function RentalDetailClient({ vehicle }: { vehicle: any }) {
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [message, setMessage] = useState('');

  async function book() {
    const userId = typeof window !== 'undefined' ? window.localStorage.getItem('user') : null;
    let parsedUserId: string | null = null;
    try {
      parsedUserId = userId ? JSON.parse(userId)?.id : null;
    } catch {
      parsedUserId = null;
    }

    if (!parsedUserId) {
      setMessage('Please sign in to continue');
      return;
    }
    if (!pickupDate || !returnDate || !pickupLocation || !returnLocation || !driverName || !driverLicense || !driverPhone) {
      setMessage('Please complete the required customer details');
      return;
    }

    try {
      const payload = {
        rentalVehicleId: vehicle.id,
        userId: parsedUserId,
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        pickupLocation,
        returnLocation,
        notes: `Driver: ${driverName}. License: ${driverLicense}. Phone: ${driverPhone}. Emergency Contact: ${emergencyContact || 'N/A'}. Requirements: ${specialRequirements || 'None'}`,
        metadata: {
          driverName,
          driverLicense,
          driverPhone,
          emergencyContact,
          specialRequirements,
        },
      };

      await publicApi('/hire/bookings', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('Booking created successfully');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setMessage('Unable to create booking');
    }
  }

  return (
    <div className="rounded bg-[#0d0d0d] p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="h-64 w-full rounded-md bg-[#0d0d0d]" />
        </div>
        <div className="col-span-2">
          <h2 className="text-2xl font-semibold">{vehicle.make} {vehicle.model}</h2>
          <p className="text-slate-400">{vehicle.year}</p>

          <div className="mt-6 text-sm text-slate-300">
            <p>{vehicle.description || 'No description available'}</p>
            <p className="mt-2">Base Price: {vehicle.basePrice ? <ConvertedAmount amountUsd={vehicle.basePrice} /> : '—'}</p>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm text-slate-400">Pickup Date</label>
              <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="mt-1 w-full rounded bg-[#121212] px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-slate-400">Return Date</label>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="mt-1 w-full rounded bg-[#121212] px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-slate-400">Pickup Location</label>
              <input value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="mt-1 w-full rounded bg-[#121212] px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-slate-400">Return Location</label>
              <input value={returnLocation} onChange={(e) => setReturnLocation(e.target.value)} className="mt-1 w-full rounded bg-[#121212] px-3 py-2" />
            </div>
            <div className="rounded-[14px] bg-[#121212] p-3">
              <h4 className="font-semibold text-white">Customer Details</h4>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-sm text-slate-400">Driver Full Name</label>
                  <input value={driverName} onChange={(e) => setDriverName(e.target.value)} className="mt-1 w-full rounded bg-[#101010] px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Driver License Number</label>
                  <input value={driverLicense} onChange={(e) => setDriverLicense(e.target.value)} className="mt-1 w-full rounded bg-[#101010] px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Phone Number</label>
                  <input value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)} className="mt-1 w-full rounded bg-[#101010] px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Emergency Contact</label>
                  <input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} className="mt-1 w-full rounded bg-[#101010] px-3 py-2" />
                </div>
              </div>
              <div className="mt-3">
                <label className="text-sm text-slate-400">Special Requirements</label>
                <textarea value={specialRequirements} onChange={(e) => setSpecialRequirements(e.target.value)} className="mt-1 w-full rounded bg-[#101010] px-3 py-2" rows={3} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={book} className="rounded bg-emerald-600 px-4 py-2 text-white">Book Now</button>
            </div>
            {message ? <div className="mt-2 text-emerald-300">{message}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
