import React from "react";

interface EmptySummaryProps {
  emptyStateMessage: string;
}

const EmptySummary: React.FC<EmptySummaryProps> = ({ emptyStateMessage }) => {
  return (
    <p id="order-summary-empty-state" className="text-center text-gray-500">
      {emptyStateMessage}
    </p>
  );
};

export default EmptySummary;
