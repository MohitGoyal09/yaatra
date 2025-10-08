"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ArrowLeft, MapPin, Phone, Mail, Calendar } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    specialInstructions: "",
    deliveryDate: ""
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Order Confirmed! 🎉
            </h1>
            <p className="text-gray-600 text-lg">
              Your spiritual items have been successfully ordered
            </p>
          </div>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono">#YS{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery:</span>
                <span>3-5 business days</span>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  You will receive a confirmation email with tracking details shortly.
                  For temple visits, your passes will be available in your dashboard.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 space-y-4">
            <Link href="/dashboard">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Return to Dashboard
              </Button>
            </Link>
            <Link href="/claim-karma">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/claim-karma">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200'
            }`}>
              3
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Please provide your contact details for order confirmation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <Button 
                    onClick={() => setStep(2)}
                    disabled={!formData.fullName || !formData.email || !formData.phone}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    Continue to Delivery
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Information
                  </CardTitle>
                  <CardDescription>
                    Where would you like your items delivered?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="House/Flat number, Street name, Area"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Your city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="123456"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => setStep(3)}
                      disabled={!formData.address || !formData.city || !formData.pincode}
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                    >
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Review & Confirm
                  </CardTitle>
                  <CardDescription>
                    Please review your order details before confirming
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Contact Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{formData.fullName}</p>
                      <p>{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Delivery Address</h4>
                    <div className="text-sm text-gray-600">
                      <p>{formData.address}</p>
                      <p>{formData.city}, {formData.pincode}</p>
                      {formData.deliveryDate && (
                        <p className="mt-1">Preferred Date: {new Date(formData.deliveryDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                    <Textarea
                      id="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                      placeholder="Any special instructions for delivery or preparation..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(2)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Confirm Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Chapan Bhog Prasadam</span>
                    <span className="text-sm font-semibold">300 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sacred Diya Set</span>
                    <span className="text-sm font-semibold">75 pts</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Cost:</span>
                    <span className="text-orange-600">375 Points</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                    <span>Your Balance:</span>
                    <span>450 Points</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-green-600 mt-1">
                    <span>After Purchase:</span>
                    <span>75 Points</span>
                  </div>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">🎁 What you'll receive:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Fresh prasadam blessed by temple priests</li>
                    <li>• Handcrafted brass diyas with cotton wicks</li>
                    <li>• Official certificate of authenticity</li>
                    <li>• Packaging suitable for gifting</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}