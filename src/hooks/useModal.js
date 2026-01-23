import { useState } from "react";

export default function useModal() {
  const [isOpen, setOpen] = useState(false);
  const [data, setData] = useState(null);

  const open = (modalData = null) => {
    setData(modalData);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setData(null);
  };

  return { isOpen, data, open, close };
}
