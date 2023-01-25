import React from "react";

function ErrorComponent() {
  return (
    <div className="fixed flex justify-center items-center w-full z-50 top-20">
      <div className="flex justify-center items-center text-lg font-medium w-96 rounded-md h-16 border border-red-600 bg-red-50 text-red-600">
        <p>Something went wrong!.</p>
      </div>
    </div>
  );
}

export default ErrorComponent;
