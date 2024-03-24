import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Dropzone from "../ui/Dropzone";
import { FileCheck2Icon } from "lucide-react";
import { useCanvas } from "@/context/CanvasContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const MyForm = () => {
  const defaultValues: { file: null | File } = {
    file: null,
  };

  const methods = useForm({
    defaultValues,
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
  });

  const { addImage } = useCanvas();

  function handleOnDrop(acceptedFiles: FileList | null) {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const allowedTypes = [
        { name: "jpeg", types: ["image/jpeg"] },
        { name: "jpg", types: ["image/jpg"] },
        { name: "png", types: ["image/png"] },
      ];
      const fileType = allowedTypes.find((allowedType) =>
        allowedType.types.find((type) => type === acceptedFiles[0].type)
      );
      if (!fileType) {
        methods.setValue("file", null);
        methods.setError("file", {
          message: "File type is not valid",
          type: "typeError",
        });
      } else {
        methods.setValue("file", acceptedFiles[0]);
        methods.clearErrors("file");
      }
    } else {
      methods.setValue("file", null);
      methods.setError("file", {
        message: "File is required",
        type: "typeError",
      });
    }
  }

  const handleFormSubmit = (data: any) => {
    console.log(data);
    if (data.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addImage(reader.result as string);
      };
      reader.readAsDataURL(data.file);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button  variant="outline" className="text-muted-foreground max-w-[150px]">
            Add Image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload your file</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            className="flex flex-col items-center justify-center w-100 gap-2"
            onSubmit={methods.handleSubmit(handleFormSubmit)}
            noValidate
            autoComplete="off"
          >
            <FormField
              control={methods.control}
              name="file"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Dropzone
                      {...field}
                      dropMessage="Drop files or click here"
                      handleOnDrop={handleOnDrop}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {methods.watch("file") && (
              <div className="flex items-center justify-center gap-3 p-4 relative">
                <FileCheck2Icon className="h-4 w-4" />
                <p className="text-sm font-medium">
                  {methods.watch("file")?.name}
                </p>
              </div>
            )}
            <DialogClose>
              {methods.watch("file") && <Button type="submit">Upload</Button>}
            </DialogClose>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default MyForm;
