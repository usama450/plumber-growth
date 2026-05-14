import { Suspense } from "react";
import { OrderSuccessClient } from "./OrderSuccessClient";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1A1410] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderSuccessClient />
    </Suspense>
  );
}
