import React from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import landingComp from '../assets/landingComp.png'  

const LandingContent = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex md:p-0 p-5">
      <div className="md:w-[50%] flex flex-col justify-center">
        <h3 className="text-5xl">Manage Your</h3>
        <h1 className="text-6xl font-bold">Queues Perfectly</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia,
          dolores?
        </p>
        <Button
          className="bg-[#6236F5] p-2 px-5 rounded-md text-white w-fit mt-3"
          onClick={() => navigate("/userForm")}
        >
          Book your slot
        </Button>
      </div>
      <div className="flex-1 relative">
        <img src={landingComp} className="absolute top-16" alt="" />
      </div>
    </div>
  );
};

export default LandingContent;