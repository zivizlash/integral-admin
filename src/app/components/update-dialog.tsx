import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Button } from "@headlessui/react";

export const UpdateDialog = ({
  updateStatus,
  close,
  successMessage
}: Readonly<{
  updateStatus: string,
  close: () => void,
  successMessage: string
}>) => {
  return <Dialog open={updateStatus == "fail" || updateStatus == "success"} as="div"
    className="relative z-10 focus:outline-none" onClose={close}>
    <DialogBackdrop className="fixed inset-0 bg-black/30" />
    <div className="fixed inset-0 z-10 w-screen">
      <div className="flex min-h-full items-center justify-center p-4">
        <DialogPanel
          transition
          className="max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
        >
          <DialogTitle as="h3" className="text-base/7 font-medium text-white">
            {updateStatus == "fail" ? "Произошла ошибка" : "Успешно"}
          </DialogTitle>
          <p className="mt-2 text-sm/6 text-white/50">
            {updateStatus == "fail" ? "Повторите попытку позже" : successMessage}
          </p>
          <div className="mt-4">
            <Button
              className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
              onClick={close}
            >
              Ок
            </Button>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
};
