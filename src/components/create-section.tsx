"use client";

import { useState } from "react";
import CreateForm from "@/components/create-form";
import { Bio } from "../app/type";
import BioCard from "./bio-card";

export default function CreateSection() {
  const [createdBio, setCreatedBio] = useState<Bio>();
  return (
    <>
      <CreateForm onCreated={setCreatedBio} />
      {createdBio && (
        <div className=" mt-8 flex justify-around">
          <BioCard className="w-full border-primary" bio={createdBio} canCopy />
        </div>
      )}
    </>
  );
}
