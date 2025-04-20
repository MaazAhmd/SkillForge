import { useState } from "react";

function RoleToggle({ selected, onChange }) {
  const [role, setRole] = useState(selected || "freelancer");

  const handleSelect = (value) => {
    setRole(value);
    onChange && onChange(value);
  };

  return (
    <div className="flex border-2 mb-4 border-primary rounded-lg overflow-hidden w-fit">
      <button
        type="button"
        onClick={() => handleSelect("freelancer")}
        className={`px-2 py-4 font-medium ${
          role === "freelancer"
            ? "bg-primary text-white"
            : "bg-white text-black"
        }`}
      >
        I am looking for work
      </button>
      <button
        type="button"
        onClick={() => handleSelect("client")}
        className={`px-2 py-4 font-medium ${
          role === "client"
            ? "bg-primary text-white"
            : "bg-white text-black"
        }`}
      >
        I am looking for talent
      </button>
    </div>
  );
}

export default RoleToggle;
