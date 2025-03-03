import { useFormik } from "formik";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dispatch, SetStateAction } from "react";
import * as Yup from "yup";
import { ListFlashcardsResponse } from "../../../auth/hooks/useApi";
import { UseQueryResult } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import { useToast } from "../../../shared/hooks/useToast";
import { useCreateFlashcard } from "../hooks/useCreateFlashcard";

type CreateFlashcardFormProps = {
  isCreateFlashcardDialogOpen: boolean;
  setIsCreateFlashcardDialogOpen: Dispatch<SetStateAction<boolean>>;
  flashcardsQuery: UseQueryResult<ListFlashcardsResponse, Error>;
  collectionId: string;
};

export function CreateFlashcardForm({
  isCreateFlashcardDialogOpen,
  setIsCreateFlashcardDialogOpen,
  flashcardsQuery,
  collectionId,
}: CreateFlashcardFormProps) {
  const { showSuccessToast, showErrorToast } = useToast();

  const createFlashcardMutation = useCreateFlashcard();

  const createFlashcardForm = useFormik({
    initialValues: {
      question: "",
      answer: "",
    },
    validationSchema: Yup.object({
      question: Yup.string()
        .min(1, "Must have more than 1 character")
        .max(3000, "Must have 3000 characters or less")
        .required("Required"),
      answer: Yup.string()
        .min(1, "Must have more than 1 character")
        .max(3000, "Must have 3000 characters or less")
        .required("Required"),
    }),
    onSubmit: (values) => {
      createFlashcardMutation.mutate(
        { ...values, collectionId },
        {
          onSuccess: async () => {
            showSuccessToast("Flashcard created successfully");
            await flashcardsQuery.refetch();
            createFlashcardForm.resetForm();
            setIsCreateFlashcardDialogOpen(false);
          },
          onError: (e) => {
            showErrorToast("Error while trying to create flashcard", e.message);
            setIsCreateFlashcardDialogOpen(false);
          },
        }
      );
    },
  });

  function onDialogHide() {
    if (!isCreateFlashcardDialogOpen) return;

    setIsCreateFlashcardDialogOpen(false);
    createFlashcardForm.resetForm();
  }

  return (
    <Dialog
      header="Create flashcard"
      visible={isCreateFlashcardDialogOpen}
      style={{ width: "50vw" }}
      draggable={false}
      onHide={onDialogHide}
    >
      <form
        className="flex flex-col gap-2"
        onSubmit={createFlashcardForm.handleSubmit}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="w-full">
            <div className="flex flex-col">
              <label className="mb-2" htmlFor="question">
                Question
              </label>
              <InputTextarea
                id="question"
                className="min-h-48"
                {...createFlashcardForm.getFieldProps("question")}
              ></InputTextarea>
              {createFlashcardForm.touched &&
              createFlashcardForm.errors.question ? (
                <small className="text-red-400">
                  {createFlashcardForm.errors.question}
                </small>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2" htmlFor="answer">
              Answer
            </label>
            <InputTextarea
              id="answer"
              className="min-h-48"
              {...createFlashcardForm.getFieldProps("answer")}
            ></InputTextarea>
            {createFlashcardForm.touched &&
            createFlashcardForm.errors.answer ? (
              <small className="text-red-400">
                {createFlashcardForm.errors.answer}
              </small>
            ) : null}
          </div>
        </div>

        <footer className="flex justify-end gap-3 mt-5">
          <Button
            disabled={!createFlashcardForm.isValid}
            loading={createFlashcardMutation.isPending}
            type="submit"
          >
            Create
          </Button>
        </footer>
      </form>
    </Dialog>
  );
}
