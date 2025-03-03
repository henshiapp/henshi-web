import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";
import { useCardCollections } from "../hooks/useCardCollections";
import { useAppBreadcrumb } from "../../../shared/hooks/useAppBreadcrumb";
import { CreateCardCollectionForm } from "../components/CreateCollectionForm";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { CardCollectionCard } from "../components/CardCollectionCard";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Pagination } from "../../../shared/components/Pagination";
import { usePageParam } from "../../../shared/hooks/usePageParam";
import { usePageSizeParam } from "../../../shared/hooks/usePageSizeParam";
import { useSearchParam } from "../../../shared/hooks/useSearchParam";
import { Message } from "primereact/message";

export function CardCollections() {
  const { setPageTitle } = usePageTitle();
  const { setBreadcrumb } = useAppBreadcrumb();

  useEffect(() => {
    setPageTitle("Card collections");
    setBreadcrumb([{ label: "Collections", path: "/app/card-collections" }]);
  }, [setBreadcrumb, setPageTitle]);

  const [isCreateCollectionDialogOpen, setIsCreateCollectionDialogOpen] =
    useState(false);
  const page = usePageParam();
  const pageSize = usePageSizeParam();
  const search = useSearchParam();

  const collectionsQuery = useCardCollections(page, pageSize, search);
  const collections = collectionsQuery?.data?.data;
  const paginationMetadata = collectionsQuery?.data?.metadata;

  return (
    <>
      <section id="catalogs" className="flex flex-col h-full">
        <div className="flex justify-end items-center mb-5">
          <Button
            size="small"
            icon="ph ph-plus"
            label="New"
            onClick={() => setIsCreateCollectionDialogOpen(true)}
          />
        </div>

        {collections?.length && (
          <>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {collections?.map((collection) => (
                <CardCollectionCard
                  collection={collection}
                  collectionsQuery={collectionsQuery}
                />
              ))}
            </div>
            <Pagination paginationMetadata={paginationMetadata!} />
          </>
        )}

        {collectionsQuery.isLoading && (
          <div className="flex flex-col justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        )}
        {collectionsQuery.error && (
          <div className="flex flex-col justify-center items-center h-full">
            <Message severity="error" text={collectionsQuery.error.message} />
          </div>
        )}

        {collections?.length === 0 && (
          <div className="flex flex-col justify-center items-center h-full">
            <i className="ph ph-empty" style={{ fontSize: 32 }}></i>
            <span className="font-semibold">No collections found.</span>
            <span>
              Start by creating a <span className="text-yellow-300">New</span>{" "}
              one
            </span>
          </div>
        )}
      </section>
      <CreateCardCollectionForm
        isCreateCollectionDialogOpen={isCreateCollectionDialogOpen}
        setIsCreateCollectionDialogOpen={setIsCreateCollectionDialogOpen}
        collectionsQuery={collectionsQuery}
      />
      <ConfirmDialog />
    </>
  );
}
