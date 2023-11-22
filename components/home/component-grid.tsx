"use client";

import { useState } from "react";
import { useDemoModal } from "@/components/home/demo-modal";
import {useLoadScript} from "@react-google-maps/api";
import Map from "@/components/map/map";
import Popover from "@/components/shared/popover";
import Tooltip from "@/components/shared/tooltip";
import { ChevronDown } from "lucide-react";

export default function ComponentGrid() {
  const { DemoModal, setShowDemoModal } = useDemoModal();
  const [openPopover, setOpenPopover] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey:process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  })
  if(!isLoaded)  return <div>Loading...</div>
  return (
      <Map/>
  );
}
