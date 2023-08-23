"use client";
import RaceSetup from "@/components/race/RaceSetup";
import { Button } from "flowbite-react";
import { useState } from "react";

const Page = () => {
  const [runner, setRunner] = useState<RaceRunner[]>([{ name: "" }]);
  return (
    <>
      <RaceSetup runner={runner} setRunner={setRunner} />

      <Button>Start Race!</Button>
    </>
  );
};

export default Page;
