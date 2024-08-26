import { useEffect } from "react";
import { useFormStatus, useFormState } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { createBio } from "@/lib/actions";
import { Bio } from "@/app/type";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full min-w-32 sm:w-auto h-12"
      disabled={pending}
    >
      { pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
      生成{pending ? "中..." : ""}
    </Button>
  );
}

export default function CreateForm({
  onCreated,
}: {
  onCreated: (bio: Bio) => void;
}) {
  const [state, formAction] = useFormState(createBio, undefined);
  useEffect(() => {
    if (state && "errorMessage" in state) {
      window.alert(state.errorMessage);
    } else if (state?.content) {
      onCreated(state);
    }
  }, [state, onCreated]);

  return (
    <form
      action={formAction}
      className="flex w-full items-center flex-col gap-3 sm:flex-row"
    >
      <Input
        name="merit"
        type="text"
        className="h-12"
        autoComplete="off"
        placeholder="例如：95 后程序员，现居深圳，热爱编程"
      />
      <SubmitButton />
    </form>
  );
}
