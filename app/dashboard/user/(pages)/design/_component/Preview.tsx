import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import React from "react";

interface PreviewProps {
  designCode: string;
  setOpen: (open: boolean) => void;
}
const Preview = ({ designCode, setOpen }: PreviewProps) => {
  return (
    <dialog className="fixed inset-0 flex items-center justify-center z-[2222] bg-black/80 h-screen w-screen">
      <div className="bg-white h-[calc(100%-300px)] max-w-screen-lg w-full rounded-md shadow-md flex flex-col p-4">
        <header className="p-4 border-b flex items-center relative justify-center space-x-4">
          <Button>Preview</Button>
          <Button>Code</Button>
          <Button
            className="absolute right-4 cursor-pointer"
            variant={"outline"}
            onClick={() => setOpen(false)}
          >
            <XIcon />
          </Button>
        </header>
        <iframe className="w-full h-full rounded-md mt-6" srcDoc={designCode} />
      </div>
    </dialog>
  );
};

export default Preview;
