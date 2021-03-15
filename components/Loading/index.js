import React from "react";

const Loading = () => {
  return (
    <div className="h-screen flex justify-center flex-col items-center absolute z-50 bg-gray-900 opacity-50 w-full">
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
