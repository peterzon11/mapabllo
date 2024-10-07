import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2 } from "lucide-react";

const PriceCalculator = () => {
  const [duration, setDuration] = useState('');
  const [isVlog, setIsVlog] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isVeryUrgent, setIsVeryUrgent] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // Load saved state from localStorage
    const savedState = localStorage.getItem('priceCalculatorState');
    if (savedState) {
      const { duration, isVlog, isUrgent, isVeryUrgent } = JSON.parse(savedState);
      setDuration(duration);
      setIsVlog(isVlog);
      setIsUrgent(isUrgent);
      setIsVeryUrgent(isVeryUrgent);
    }
  }, []);

  useEffect(() => {
    // Save state to localStorage
    const stateToSave = { duration, isVlog, isUrgent, isVeryUrgent };
    localStorage.setItem('priceCalculatorState', JSON.stringify(stateToSave));
  }, [duration, isVlog, isUrgent, isVeryUrgent]);

  const calculatePrice = () => {
    if (!duration) return;

    let basePrice = parseFloat(duration) * 49;
    let finalPrice = basePrice;

    if (isVlog) finalPrice *= 1.15;
    if (isUrgent) finalPrice *= 1.3;
    if (isVeryUrgent) finalPrice *= 1.5;

    setPrice(Math.round(finalPrice));
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ผลการคำนวณราคา',
        text: `ราคาสุทธิ: ${price} บาท (ระยะเวลา: ${duration} นาที)`
      }).catch(console.error);
    } else {
      alert('การแชร์ไม่รองรับบนอุปกรณ์นี้');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">แอปคำนวณราคา</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">ระยะเวลาทำงาน (นาที)</label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="ใส่จำนวนนาที"
              className="mt-1"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="vlog" checked={isVlog} onCheckedChange={setIsVlog} />
              <label htmlFor="vlog" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Vlog (บวกเพิ่ม 15%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="urgent" checked={isUrgent} onCheckedChange={setIsUrgent} />
              <label htmlFor="urgent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">งานด่วน (บวกเพิ่ม 30%)</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="veryUrgent" checked={isVeryUrgent} onCheckedChange={setIsVeryUrgent} />
              <label htmlFor="veryUrgent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">งานด่วนสุด (บวกเพิ่ม 50%)</label>
            </div>
          </div>
          <Button onClick={calculatePrice} className="w-full">คำนวณราคา</Button>
          {price > 0 && (
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">ราคาสุทธิ: {price} บาท</p>
              <Button onClick={shareResult} className="mt-2" variant="outline">
                <Share2 className="mr-2 h-4 w-4" /> แชร์ผลลัพธ์
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCalculator;
