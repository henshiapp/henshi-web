import { UseQueryResult } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useRef, useState, SyntheticEvent } from "react";
import { NavLink } from "react-router-dom";
import { ListCardCollectionsResponse } from "../hooks/useCardCollections";
import { ROUTES } from "../../../shared/consts/routes";
import { useToast } from "../../../shared/hooks/useToast";
import { useDeleteCardCollection } from "../hooks/useDeleteCardCollection";
import { CardCollection } from "../types/CardCollection";
import { confirmDialog } from "primereact/confirmdialog";

type CollectionCardProps = {
  collection: CardCollection;
  collectionsQuery: UseQueryResult<ListCardCollectionsResponse, Error>;
};

export function CardCollectionCard({
  collection,
  collectionsQuery,
}: CollectionCardProps) {
  const deleteCardCollectionMutation = useDeleteCardCollection();
  const { showSuccessToast, showErrorToast } = useToast();

  const cardMenu = useRef<Menu>(null);
  const [currentSelectedCollectionId, setCurrentSelectedCollectionId] =
    useState<string>();
  const cardMenuItems: MenuItem[] = [
    {
      label: "Delete",
      icon: "ph ph-trash",
      command: async function () {
        confirmDialog({
          header: `Do you really want to delete "${collection.title}"?`,
          message:
            "This action is irreversible and will delete all the flashcards assigned to it.",
          icon: "ph ph-warning",
          acceptClassName: "p-button-danger",
          modal: true,
          draggable: false,
          resizable: false,
          accept: () => {
            if (currentSelectedCollectionId) {
              deleteCardCollectionMutation.mutate(currentSelectedCollectionId, {
                onSuccess: async () => {
                  showSuccessToast("Collection deleted successfully");
                  await collectionsQuery.refetch();
                },
                onError: (e) => {
                  showErrorToast(
                    "Error while trying to delete collection",
                    e.message
                  );
                },
              });
            }
          },
        });
      },
    },
  ];

  function onCollectionOptionsButtonClick(
    e: SyntheticEvent,
    collectionId: string
  ) {
    e.preventDefault();
    setCurrentSelectedCollectionId(collectionId);
    cardMenu.current?.toggle(e);
  }

  return (
    <NavLink
      to={`${ROUTES.cardCollections}/${collection.id}/flashcards`}
      onClick={(e) =>
        deleteCardCollectionMutation.isPending && e.preventDefault()
      }
      className="flex flex-col min-h-38 bg-slate-800 border-1 border-slate-600 hover:bg-slate-700 disabled transition rounded-lg p-2 cursor-pointer"
    >
      <div className="flex justify-between mt-1">
        <div className="flex items-center">
          <div className="flex items-center bg-slate-600 rounded-lg p-2 me-2">
            <i className={"ph " + collection.icon}></i>
          </div>
          <span className="font-semibold text-lg">{collection.title}</span>
        </div>
        <div>
          <Button
            onClick={(e) => onCollectionOptionsButtonClick(e, collection.id)}
            severity="secondary"
            disabled={deleteCardCollectionMutation.isPending}
            text
            icon="ph ph-dots-three-vertical"
          />
          <Menu popup ref={cardMenu} model={cardMenuItems}></Menu>
        </div>
      </div>
      <span className="my-2">
        {collection.description ?? (
          <span className="text-slate-400">No description</span>
        )}
      </span>
    </NavLink>
  );
}
