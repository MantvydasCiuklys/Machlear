"use client";

import { useState } from "react";
import { useDemoModal } from "@/components/home/demo-modal";
import { useLoadScript, GoogleMap } from "react-google-maps";
import Popover from "@/components/shared/popover";
import Tooltip from "@/components/shared/tooltip";
import { ChevronDown } from "lucide-react";

export default function ComponentGrid() {
  const { DemoModal, setShowDemoModal } = useDemoModal();
  const [openPopover, setOpenPopover] = useState(false);
  return (
    <div className="grid grid-cols-4 gap-8 md:grid-cols-4">

    </div>
  );
}
