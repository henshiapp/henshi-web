import { icons } from "@phosphor-icons/core";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dispatch, memo, SetStateAction, useRef, useState } from "react";
import * as Yup from "yup";
import { ListCardCollectionsResponse } from "../hooks/useCardCollections";
import { UseQueryResult } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import { useToast } from "../../../shared/hooks/useToast";
import { useCreateCardCollection } from "../hooks/useCreateCardCollection";

type CreateCardCollectionFormProps = {
  isCreateCollectionDialogOpen: boolean;
  setIsCreateCollectionDialogOpen: Dispatch<SetStateAction<boolean>>;
  collectionsQuery: UseQueryResult<ListCardCollectionsResponse, Error>;
};

export function CreateCardCollectionForm({
  isCreateCollectionDialogOpen,
  setIsCreateCollectionDialogOpen,
  collectionsQuery,
}: CreateCardCollectionFormProps) {
  const { showSuccessToast, showErrorToast } = useToast();

  const op = useRef<OverlayPanel>(null);
  const [iconSearch, setIconSearch] = useState<string>("");

  function onIconSelect(iconName: string) {
    createCollectionForm.setFieldValue("icon", iconName);
  }

  const createCollectionMutation = useCreateCardCollection();

  const createCollectionForm = useFormik({
    initialValues: {
      icon: "ph-cards",
      title: "",
      description: null,
    },
    validationSchema: Yup.object({
      icon: Yup.string().required("Required"),
      title: Yup.string()
        .max(30, "Must be 30 characters or less")
        .required("Required"),
      description: Yup.string()
        .max(255, "Must be 255 characters or less")
        .nullable(),
    }),
    onSubmit: (values) => {
      createCollectionMutation.mutate(values, {
        onSuccess: async () => {
          showSuccessToast("Collection created successfully");
          await collectionsQuery.refetch();
          setIsCreateCollectionDialogOpen(false);
          createCollectionForm.resetForm();
        },
        onError: (e) => {
          showErrorToast("Error while trying to create collection", e.message);
          setIsCreateCollectionDialogOpen(false);
        },
      });
    },
  });

  function onDialogHide() {
    if (!isCreateCollectionDialogOpen) return;

    setIsCreateCollectionDialogOpen(false);
    createCollectionForm.resetForm();
    setIconSearch("");
  }

  const IconSelector = memo(() => (
    <OverlayPanel ref={op} closeOnEscape dismissable={true}>
      <InputText onChange={(e) => setIconSearch(e.target.value)}></InputText>
      <div className="grid grid-cols-8 gap-1 mt-3 max-h-36 max-w-72 overflow-y-auto">
        {icons
          .filter((i) => i.name.includes(iconSearch))
          .map((i) => (
            <i
              key={i.name}
              className={
                "flex justify-center items-center text-white hover:bg-slate-500 rounded ph ph-" +
                i.name
              }
              onClick={() => onIconSelect(`ph-${i.name}`)}
            ></i>
          ))}
      </div>
    </OverlayPanel>
  ));

  return (
    <Dialog
      header="Create collection"
      visible={isCreateCollectionDialogOpen}
      style={{ width: "50vw" }}
      draggable={false}
      onHide={onDialogHide}
    >
      <form
        className="flex flex-col gap-2"
        onSubmit={createCollectionForm.handleSubmit}
      >
        <div className="flex gap-2">
          <div className="flex flex-col">
            <label className="mb-2" htmlFor="icon">
              Icon
            </label>
            <i
              id="icon"
              onClick={(e) => op.current?.toggle(e)}
              style={{ fontSize: "32px" }}
              className={
                "bg-slate-600 cursor-pointer h-12 w-12 p-2 rounded-lg ph " +
                createCollectionForm.values.icon
              }
            ></i>
            {createCollectionForm.touched &&
              createCollectionForm.errors.icon ? (
              <small className="text-red-400">
                {createCollectionForm.errors.icon}
              </small>
            ) : null}
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-2" htmlFor="title">
              Title
            </label>
            <InputText
              id="title"
              {...createCollectionForm.getFieldProps("title")}
            />
            {createCollectionForm.touched &&
              createCollectionForm.errors.title ? (
              <small className="text-red-400">
                {createCollectionForm.errors.title}
              </small>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-2" htmlFor="description">
            Description
          </label>
          <InputTextarea
            id="description"
            {...createCollectionForm.getFieldProps("description")}
          ></InputTextarea>
          {createCollectionForm.touched &&
            createCollectionForm.errors.description ? (
            <small className="text-red-400">
              {createCollectionForm.errors.description}
            </small>
          ) : null}
        </div>

        <footer className="flex justify-end gap-3 mt-5">
          <Button
            disabled={!createCollectionForm.isValid}
            loading={createCollectionMutation.isPending}
            type="submit"
          >
            Create
          </Button>
        </footer>
      </form>
      <IconSelector />
    </Dialog>
  );
}
