"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

interface ShippingDetailsProps {
  showShippingDetails: boolean;
}

const ShippingDetails: React.FC<ShippingDetailsProps> = ({
  showShippingDetails,
}) => {
  const { customerDetails } = useCart();

  if (!showShippingDetails) return null;

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
      <h3 className="font-semibold text-blue-800 mb-2">Shipping To:</h3>
      {customerDetails && (
        <address className="not-italic text-sm text-gray-700">
          {customerDetails.fullName}
          <br />
          {customerDetails.addressLine1}
          <br />
          {customerDetails.addressLine2}
          <br />
          {customerDetails.city}, {customerDetails.state}{" "}
          {customerDetails.zipCode}
          <br />
          {customerDetails.country}
        </address>
      )}
    </div>
  );
};

export default ShippingDetails;
