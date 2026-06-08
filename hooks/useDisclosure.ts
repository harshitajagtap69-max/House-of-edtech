import { useState } from "react";

// Controls any open/close state (modal, panel, menu)
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
