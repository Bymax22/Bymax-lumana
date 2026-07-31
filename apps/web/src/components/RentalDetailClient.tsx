"use client";

import React, { useState } from 'react';
import { publicApi } from '@/lib/publicApi';
import ConvertedAmount from '@/components/ConvertedAmount';
import { type PaymentMethod } from '@/lib/paymentMethods';

export default function RentalDetailClient({ vehicle }: { vehicle: any }) {
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [durationType, setDurationType] = useState<'daily' | 'custom' | 'weekly' | 'monthly'>('daily');
  const [customDays, setCustomDays] = useState(3);
  const [driverName, setDriverName] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [paymentMethod] = useState<PaymentMethod>('MASTERCARD');
  const [message, setMessage] = useState('');

  const baseDailyPrice = Number(vehicle.basePrice ?? 0);
  const localDailyPrice = baseDailyPrice;
  const outsideDailyPrice = Math.max(0, Math.round(baseDailyPrice * 1.15));

  const normalizeLocation = (value: string) => value.trim().toLowerCase();
  const isLusaka = (value: string) => /lusaka/i.test(value.trim());
  const pickupArea = normalizeLocation(pickupLocation);
  const returnArea = normalizeLocation(returnLocation);
  const isOutsideLusaka = pickupLocation && returnLocation ? !isLusaka(pickupLocation) || !isLusaka(returnLocation) : false;
  const activeDailyRate = isOutsideLusaka ? outsideDailyPrice : localDailyPrice;

  const durationDays = durationType === 'daily' ? 1 : durationType === 'weekly' ? 7 : durationType === 'monthly' ? 30 : Math.max(1, Number(customDays));
  const totalPrice = activeDailyRate * durationDays;
  const weeklyPrice = Math.round(activeDailyRate * 6.5);
  const monthlyPrice = Math.round(activeDailyRate * 25);

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
        paymentMethod,
        notes: `Driver: ${driverName}. License: ${driverLicense}. Phone: ${driverPhone}. Emergency Contact: ${emergencyContact || 'N/A'}. Requirements: ${specialRequirements || 'None'}`,
        metadata: {
          driverName,
          driverLicense,
          driverPhone,
          emergencyContact,
          specialRequirements,
        },
      };

      const booking = await publicApi('/hire/bookings', { method: 'POST', body: JSON.stringify(payload) });
      if (paymentMethod === 'BANK_TRANSFER') {
        setMessage(`Booking created. Please complete bank transfer with reference ${booking.bookingRef}.`);
      } else if (paymentMethod === 'CASH') {
        setMessage('Booking created. Please pay cash when the car is delivered.');
      } else {
        setMessage('Booking created and payment completed successfully.');
      }
      setTimeout(() => setMessage(''), 4000);
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

          <div className="mt-6 rounded-[20px] bg-[#121212] p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-slate-400">Pickup Location</label>
                <input value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="mt-1 w-full rounded bg-[#101010] px-3 py-2" placeholder="Lusaka or outside" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Return Location</label>
                <input value={returnLocation} onChange={(e) => setReturnLocation(e.target.value)} className="mt-1 w-full rounded bg-[#101010] px-3 py-2" placeholder="Lusaka or outside" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Rate Type</label>
                <select value={durationType} onChange={(e) => setDurationType(e.target.value as any)} className="mt-1 w-full rounded bg-[#101010] px-3 py-2 text-white">
                  <option value="daily">Daily</option>
                  <option value="custom">Custom days</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              {durationType === 'custom' ? (
                <div>
                  <label className="text-sm text-slate-400">Number of Days</label>
                  <input
                    type="number"
                    min={1}
                    value={customDays}
                    onChange={(e) => setCustomDays(Math.max(1, Number(e.target.value)))}
                    className="mt-1 w-full rounded bg-[#101010] px-3 py-2"
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-[16px] bg-[#0d0d0d] p-4 text-sm text-slate-300">
              <p className="text-xs uppercase text-slate-500">Pricing summary</p>
              <div className="mt-3 grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Active rate</span>
                  <span className="font-semibold text-white">{isOutsideLusaka ? 'Outside Lusaka' : 'Within Lusaka'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Daily rate</span>
                  <span className="font-semibold text-white"><ConvertedAmount amountUsd={activeDailyRate} /></span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Duration</span>
                  <span className="font-semibold text-white">{durationDays} {durationDays === 1 ? 'day' : 'days'}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="font-semibold text-slate-400">Estimated total</span>
                  <span className="font-semibold text-yellow-400"><ConvertedAmount amountUsd={totalPrice} /></span>
                </div>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-[14px] bg-[#111111] p-3">
                  <p className="text-xs uppercase text-slate-500">Weekly price</p>
                  <p className="mt-2 text-base font-semibold text-white"><ConvertedAmount amountUsd={weeklyPrice} /></p>
                </div>
                <div className="rounded-[14px] bg-[#111111] p-3">
                  <p className="text-xs uppercase text-slate-500">Monthly price</p>
                  <p className="mt-2 text-base font-semibold text-white"><ConvertedAmount amountUsd={monthlyPrice} /></p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-slate-400">Pickup Date</label>
                <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="mt-1 w-full rounded bg-[#121212] px-3 py-2" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Return Date</label>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="mt-1 w-full rounded bg-[#121212] px-3 py-2" />
              </div>
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
