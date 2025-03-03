import { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useAppBreadcrumb } from "../../../shared/hooks/useAppBreadcrumb";
import { Button } from "primereact/button";
import { CreateFlashcardForm } from "../components/CreateFlashcardForm";
import { useFlashcards } from "../hooks/useFlashcards";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { Tag } from "primereact/tag";
import { useDeleteFlashcard } from "../hooks/useDeleteFlashcard";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { useToast } from "../../../shared/hooks/useToast";
import { ScrollPanel } from "primereact/scrollpanel";
import { Flashcard } from "../types/Flashcard";
import { usePageParam } from "../../../shared/hooks/usePageParam";
import { usePageSizeParam } from "../../../shared/hooks/usePageSizeParam";
import { useSearchParam } from "../../../shared/hooks/useSearchParam";
import { Pagination } from "../../../shared/components/Pagination";

export function Flashcards() {
  const params = useParams();
  const collectionId = params.collectionId ?? "";

  const { setBreadcrumb } = useAppBreadcrumb();
  const currentLocation = useLocation();
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    setBreadcrumb([
      { label: "Collections", path: "/app/card-collections" },
      { label: "Flashcards", path: currentLocation.pathname },
    ]);
  }, [currentLocation.pathname, setBreadcrumb]);

  const page = usePageParam();
  const pageSize = usePageSizeParam(5);
  const search = useSearchParam();

  const flashcardsQuery = useFlashcards(collectionId, page, pageSize, search);
  const [isCreateFlashcardDialogOpen, setIsCreateFlashcardDialogOpen] =
    useState(false);

  const deleteFlashcardMutation = useDeleteFlashcard();

  if (!collectionId) return <>Invalid collection</>;

  const flashcards = flashcardsQuery.data?.data;
  const paginationMetadata = flashcardsQuery.data?.metadata;

  function onDeleteFlashcardClick(id: string) {
    confirmDialog({
      header: `Do you really want to delete this flashcard?`,
      message: "This action is irreversible",
      icon: "ph ph-warning",
      acceptClassName: "p-button-danger",
      modal: true,
      draggable: false,
      resizable: false,
      accept: () => {
        deleteFlashcardMutation.mutate(
          { collectionId, id },
          {
            onSuccess: async () => {
              showSuccessToast("Flashcard deleted successfully");
              await flashcardsQuery.refetch();
            },
            onError: (e) => {
              showErrorToast(
                "Error while trying to delete flashcard",
                e.message
              );
            },
          }
        );
      },
    });
  }

  const getGrade = (grade: Flashcard["grade"]) => {
    switch (grade) {
      case "VERY_EASY":
        return "Very easy";
      case "EASY":
        return "Easy";
      case "MEDIUM":
        return "Medium";
      case "HARD":
        return "Hard";
      case "VERY_HARD":
        return "Very hard";
    }
  };

  return (
    <>
      <div className="flex justify-end items-center mb-5">
        <div className="flex gap-2">
          <NavLink to={currentLocation.pathname + "/recall"}>
            <Button icon="ph ph-play" size="small" label="Recall" />
          </NavLink>
          <Button
            size="small"
            icon="ph ph-plus"
            label="New"
            onClick={() => setIsCreateFlashcardDialogOpen(true)}
          />
        </div>
      </div>
      {flashcards && flashcards.length > 0 && (
        <>
          <ScrollPanel className="h-4/5">
            {flashcards?.map((flashcard, i) => (
              <div
                key={flashcard.id}
                className="bg-slate-700 p-3 rounded-lg mb-3"
              >
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <span className="bg-slate-500 py-2 px-4 rounded-lg text-lg font-semibold">
                      {i + 1}
                    </span>
                    <Tag severity="info" value={getGrade(flashcard.grade)} />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="small"
                      icon="ph ph-trash"
                      severity="secondary"
                      tooltip="Delete"
                      tooltipOptions={{ position: "top" }}
                      onClick={() => onDeleteFlashcardClick(flashcard.id)}
                    />
                  </div>
                </div>
                <div
                  key={flashcard.id}
                  className="grid grid-cols-2 gap-2 mt-3 overflow-auto overflow-x-hidden"
                >
                  <ScrollPanel className="bg-slate-800 p-2 rounded-lg h-48">
                    {flashcard.question}
                  </ScrollPanel>
                  <ScrollPanel className="bg-slate-800 p-2 rounded-lg h-48">
                    {flashcard.answer}
                  </ScrollPanel>
                </div>
              </div>
            ))}
          </ScrollPanel>
          <Pagination
            paginationMetadata={paginationMetadata!}
            defaultPageSize={5}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </>
      )}
      {flashcardsQuery.isLoading && (
        <div className="flex flex-col justify-center items-center h-3/4">
          <LoadingSpinner />
        </div>
      )}
      {(flashcards?.length === 0 || flashcardsQuery.error) && (
        <div className="flex flex-col justify-center items-center h-3/4">
          <i className="ph ph-empty" style={{ fontSize: 32 }}></i>
          <span className="font-semibold">No flashcards found.</span>
          <span>
            Start by creating a <span className="text-yellow-300">New</span> one
          </span>
        </div>
      )}
      <CreateFlashcardForm
        isCreateFlashcardDialogOpen={isCreateFlashcardDialogOpen}
        setIsCreateFlashcardDialogOpen={setIsCreateFlashcardDialogOpen}
        collectionId={collectionId}
        flashcardsQuery={flashcardsQuery}
      />
      <ConfirmDialog />
    </>
  );
}
