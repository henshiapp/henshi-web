import {
  Reducer,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useAppBreadcrumb } from "../../../shared/hooks/useAppBreadcrumb";
import { Button } from "primereact/button";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { useFinishRecall } from "../hooks/useFinishRecall";
import { useToast } from "../../../shared/hooks/useToast";
import { useCounter } from "primereact/hooks";
import { Timer } from "../../../shared/components/Timer";
import { RecallCard } from "../components/RecallCard";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";
import { useRecall } from "../hooks/useRecall";
import { Message } from "primereact/message";

export type RecallResult = {
  flashcardId: string;
  correct: boolean;
};

enum States {
  LOADING,
  COUNTING,
  RUNNING,
  FINISHED,
}

enum Events {
  FINISHED_LOADING,
  FINISHED_COUNTING,
  ANSWERED_ALL_CARDS,
}

const reducer: Reducer<States, Events> = (state, event) => {
  switch (state) {
    case States.LOADING:
      if (event === Events.FINISHED_LOADING) return States.COUNTING;
      break;
    case States.COUNTING:
      if (event === Events.FINISHED_COUNTING) return States.RUNNING;
      break;
    case States.RUNNING:
      if (event === Events.ANSWERED_ALL_CARDS) return States.FINISHED;
      break;
  }
  return state;
};

export function Recall() {
  const params = useParams();
  const collectionId = params.collectionId;

  const { setBreadcrumb } = useAppBreadcrumb();
  const { setPageTitle } = usePageTitle();
  const currentLocation = useLocation();
  const { showErrorToast } = useToast();

  useEffect(() => {
    setBreadcrumb([
      { label: "Collections", path: "/app/card-collections" },
      {
        label: "Flashcards",
        path: `/app/card-collections/${collectionId}/flashcards`,
      },
      { label: "Recall", path: currentLocation.pathname },
    ]);
    setPageTitle("Recall");
  }, [collectionId, currentLocation.pathname, setBreadcrumb, setPageTitle]);

  // Queries & Mutations
  const flashcardsQuery = useRecall(collectionId);
  const finishRecallMutation = useFinishRecall();

  // Logic
  const [state, dispatch] = useReducer(reducer, States.LOADING);
  const [isSessionTimerRunning, setIsSessionTimerRunning] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);
  const [cardIsFlipped, setCardIsFlipped] = useState<boolean>(false);
  const [cardIsLoading, setCardIsLoading] = useState<boolean>(false);
  const [recallResults, setRecallResults] = useState<RecallResult[]>([]);
  const hasSaved = useRef(false);
  const counter = useCounter(5, {
    min: 0,
    max: 5,
    step: 1,
  });

  const flashcards = flashcardsQuery.data?.data ?? [];
  const currentFlashcard = flashcards[currentFlashcardIndex];
  const cardBackIsShown = cardIsFlipped;
  const score = recallResults.filter((r) => r.correct).length;
  const total = recallResults.length;

  console.log(state, flashcards);

  function startSessionTimer() {
    setIsSessionTimerRunning(true);
  }

  function stopSessionTimer() {
    setIsSessionTimerRunning(false);
  }

  const saveSessionResults = useCallback(() => {
    if (!collectionId) return;

    finishRecallMutation.mutate(
      {
        collectionId,
        answers: recallResults,
      },
      {
        onSuccess: () => {
          flashcardsQuery.refetch();
        },
        onError: (e) => {
          showErrorToast("Error while trying to save the session", e.message);
        },
      }
    );
  }, [
    collectionId,
    finishRecallMutation,
    flashcardsQuery,
    recallResults,
    showErrorToast,
  ]);

  function flipCard(): void {
    setCardIsFlipped((f) => !f);
  }

  function onCorrectAnswer(): void {
    setRecallResults((results) => [
      ...results,
      { flashcardId: currentFlashcard.id, correct: true },
    ]);
    moveToNextCard();
  }

  function onWrongAnswer(): void {
    setRecallResults((results) => [
      ...results,
      { flashcardId: currentFlashcard.id, correct: false },
    ]);
    moveToNextCard();
  }

  function moveToNextCard() {
    if (currentFlashcardIndex < flashcards.length - 1) {
      setCardIsFlipped(false);
      setCardIsLoading(true);
      setTimeout(() => {
        setCurrentFlashcardIndex((i) => i + 1);
        setCardIsLoading(false);
      }, 500);
    } else {
      dispatch(Events.ANSWERED_ALL_CARDS);
    }
  }

  // State management
  useEffect(() => {
    if (
      state === States.LOADING &&
      !flashcardsQuery.isLoading &&
      !flashcardsQuery.error &&
      flashcards.length > 0
    ) {
      dispatch(Events.FINISHED_LOADING);
    }
  }, [
    flashcards.length,
    flashcardsQuery.error,
    flashcardsQuery.isLoading,
    state,
  ]);

  useEffect(() => {
    if (state === States.COUNTING) {
      if (counter.count > 0) {
        setTimeout(() => {
          counter.decrement();
        }, 1000);
      } else {
        dispatch(Events.FINISHED_COUNTING);
        startSessionTimer();
      }
    }
  }, [counter, state]);

  useEffect(() => {
    if (state === States.FINISHED && !hasSaved.current) {
      stopSessionTimer();
      saveSessionResults();
      hasSaved.current = true;
    }
  }, [saveSessionResults, state]);

  if (!collectionId) return <>Invalid collection</>;

  return (
    <div className="h-8/10">
      <div className="flex justify-end items-center mb-5">
        <Timer isRunning={isSessionTimerRunning} />
      </div>

      <div className="flex h-full justify-center items-center">
        {state === States.LOADING && (
          <>
            {flashcardsQuery.isLoading && <LoadingSpinner />}
            {flashcardsQuery.error && (
              <Message severity="error" text={flashcardsQuery.error.message} />
            )}
            {!flashcardsQuery.isLoading &&
              !flashcardsQuery.error &&
              flashcards.length === 0 && (
                <div className="flex flex-col items-center gap-5 text-xl">
                  No flashcards available for recall at this moment.
                  <NavLink to="/app/card-collections">
                    <Button label="Go back" />
                  </NavLink>
                </div>
              )}
          </>
        )}

        {state === States.COUNTING && (
          <div className="flex flex-col justify-center items-center font-bold">
            <span className="text-3xl">Starting in</span>
            <span className="text-6xl">{counter.count}</span>
          </div>
        )}

        {state === States.RUNNING && (
          <div className="flex flex-col">
            <div className="group h-96 w-96 [perspective:1000px]">
              <div
                className={
                  (cardIsFlipped ? "[transform:rotateY(180deg)] " : "") +
                  "relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d]"
                }
              >
                <RecallCard
                  text={currentFlashcard.question}
                  side="FRONT"
                  isLoading={cardIsLoading}
                />
                <RecallCard
                  text={currentFlashcard.answer}
                  side="BACK"
                  isLoading={cardIsLoading}
                />
              </div>
            </div>
            <div className="flex justify-center mt-10">
              {cardBackIsShown ? (
                <div className="flex gap-2">
                  <Button
                    label="Correct"
                    severity="success"
                    onClick={onCorrectAnswer}
                  />
                  <Button
                    label="Wrong"
                    severity="danger"
                    onClick={onWrongAnswer}
                  />
                </div>
              ) : (
                <Button label="Flip" onClick={flipCard} />
              )}
            </div>
          </div>
        )}

        {state === States.FINISHED && (
          <div className="flex flex-col">
            <div className="flex gap-3 font-bold text-4xl mb-5">
              <i
                className="ph ph-confetti text-amber-300"
                style={{ fontSize: 48 }}
              ></i>{" "}
              Session completed!
            </div>
            <div className="text-2xl">
              <span className="font-semibold">Score:</span> {score}/{total}
            </div>
            <div className="flex justify-center mt-20">
              {finishRecallMutation.isPending ? (
                <span>
                  <LoadingSpinner /> Saving session...
                </span>
              ) : (
                <NavLink to="/app/card-collections">
                  <Button label="Go back" />
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
