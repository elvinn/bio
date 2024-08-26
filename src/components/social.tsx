import { Coffee, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const itemList = [
  {
    icon: <Coffee className="h-6 w-6" />,
    link: "https://buymeacoffee.com/elvinn",
    tooltip: "Buy me a coffee",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    link: "mailto:elvin.pjw@gmail.com",
    tooltip: "邮件联系",
  },
] as const;

export default function Social() {
  return (
    <div className="flex items-center gap-2">
      {itemList.map((item) => (
        <TooltipProvider key={item.link} delayDuration={400}>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={item.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Button variant="ghost" size="icon" aria-label={item.tooltip}>
                  {item.icon}
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
