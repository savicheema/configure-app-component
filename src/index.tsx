import React, { ReactElement, ReactNode, SetStateAction } from "react";
import { JSX } from "react/jsx-runtime";
import { STYLE_CLASS_PREFIX } from "./constants";

const configureLog = (...args: any[]) => {
  console.log("[Configure App]", ...args);
};
type ConfigureRefType = {
  maxSteps?: number;
};
type ConfigureContextType = {
  isComplete: boolean;
  setIsComplete: React.Dispatch<SetStateAction<boolean>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<SetStateAction<number>>;
  configureStepsRef: React.RefObject<ConfigureRefType>;
};
const ConfigureStepsContext = React.createContext<ConfigureContextType>({
  isComplete: false,
  setIsComplete: () => null,
  currentStep: 1,
  setCurrentStep: () => null,
  configureStepsRef: { current: {} },
});

const useConfigureStepsHook = () => {
  const configureState = React.useContext<ConfigureContextType>(
    ConfigureStepsContext,
  );

  React.useEffect(() => {
    // set isComplete on final step onNext
  }, [configureState.currentStep]);

  function unloadEvenHandler(e: BeforeUnloadEvent) {
    e.preventDefault();

    e.returnValue = true;
  }

  function voidUnloadEventHandler() {}

  React.useEffect(() => {
    window.onbeforeunload = unloadEvenHandler;

    return () => {
      window.removeEventListener("beforeunload", unloadEvenHandler);
    };
  }, []);

  React.useEffect(() => {
    if (configureState.isComplete) {
      window.removeEventListener("beforeunload", unloadEvenHandler);
      window.onbeforeunload = voidUnloadEventHandler;
    }

    return () => {
      window.removeEventListener("beforeunload", voidUnloadEventHandler);
    };
  }, [configureState.isComplete]);
  return {
    ...configureState,
  };
};

export type ConfigStepType = {
  frame: JSX.Element;
  heading: string;
  onNext?: () => boolean;
  onPrev?: () => boolean;
  isSkip?: boolean;
  serial?: number;
};

const Frame = ({ frame }: { frame: JSX.Element }) => {
  return (
    <>
      <div className={`${STYLE_CLASS_PREFIX}_frame-container`}>{frame}</div>
    </>
  );
};

const StepNumber = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <>
      <style>{`.${STYLE_CLASS_PREFIX}_step-number {
        background-color: hsla(125,50%,20%, 0.8);
        color: white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1px 8px;
      }`}</style>
      <div className={`${STYLE_CLASS_PREFIX}_step-number`}>
        <span
          style={{
            fontSize: "14px",
            position: "relative",
            bottom: "4px",
            left: "4px",
          }}
        >
          <b>{currentStep}</b>
        </span>
        <span style={{ position: "relative", left: "4px" }}>&nbsp;/&nbsp;</span>
        <span
          style={{
            fontSize: "9px",
            position: "relative",
            top: "4px",
            left: "4px",
          }}
        >
          {totalSteps}
        </span>
      </div>
    </>
  );
};

const StepHeading = ({ heading }: { heading: string }) => {
  const configState = React.useContext(ConfigureStepsContext);

  return (
    <>
      <div className={`${STYLE_CLASS_PREFIX}_heading-container`}>
        <StepNumber
          currentStep={configState.currentStep}
          totalSteps={configState.configureStepsRef.current.maxSteps!}
        />
        <h3 className={`${STYLE_CLASS_PREFIX}_step-heading`}>{heading}</h3>
      </div>
    </>
  );
};

const nextState = (configureStepsRef: React.RefObject<ConfigureRefType>) => {
  if (!configureStepsRef.current.maxSteps) throw Error("Max steps are not set");

  return (currentStep: number) => {
    if (configureStepsRef.current.maxSteps! <= currentStep) return currentStep;

    return currentStep + 1;
  };
};

const prevState = (ConfigureStep?: React.RefObject<ConfigureRefType>) => {
  return (currentStep: number) => {
    if (currentStep <= 1) return currentStep;

    return currentStep - 1;
  };
};

const ActionBar = ({
  onNext,
  onPrev,
  isSkip,
}: {
  onNext?: () => boolean | Promise<boolean>;
  onPrev?: () => boolean;
  isSkip?: boolean;
}) => {
  const configureState = React.useContext(ConfigureStepsContext);
  return (
    <>
      <div className={`${STYLE_CLASS_PREFIX}_action-bar`}>
        {isSkip && (
          <button
            type="button"
            className={`${STYLE_CLASS_PREFIX}_action-button`}
          >
            skip
          </button>
        )}
        {configureState.currentStep !== 1 && (
          <button
            type="button"
            className={`${STYLE_CLASS_PREFIX}_action-button`}
            onClick={() => {
              const isComplete = !!onPrev ? onPrev() : true;
              if (isComplete) {
                configureState.setCurrentStep(
                  prevState(configureState.configureStepsRef),
                );
              }
            }}
          >
            back
          </button>
        )}
        <button
          type="button"
          className={`${STYLE_CLASS_PREFIX}_action-button ${STYLE_CLASS_PREFIX}_next-button`}
          onClick={async () => {
            const isNext = !!onNext ? await onNext() : true;
            if (isNext) {
              if (
                configureState.currentStep ===
                configureState.configureStepsRef.current.maxSteps
              ) {
                configureState.setIsComplete(true);
              } else {
                configureState.setCurrentStep(
                  nextState(configureState.configureStepsRef),
                );
              }
            }
          }}
        >
          {configureState.currentStep ===
          configureState.configureStepsRef.current.maxSteps
            ? "Finish"
            : "Next"}
        </button>
      </div>
    </>
  );
};

const ConfigureStyleComponent = () => (
  <>
    <style>{`.${STYLE_CLASS_PREFIX}_config-component {
        height: 60vh;
        width: 100vw;
        background-color: white;
        color: black;
        margin: 4px 0;
        display: flex;
      }`}</style>
    <style>{`
        .${STYLE_CLASS_PREFIX}_step-container {
          display: flex;
          flex-direction: column;
          border: 1px solid #ddd;
          padding: 8px;
          flex: 1 0 100%;
          animation-duration: 300ms;
          animation-name: slide-in;
          animation-iteration-count: 1;
          animation-timing-function: ease-in;
        }

        @keyframes slide-in {
          0% {
            transform: translate(100vw);
          }

          100% {
            transform: translate(0);
          }
        }
        `}</style>
    <style>{`.${STYLE_CLASS_PREFIX}_frame-container {
        padding: 8px 12px;
        margin: 4px 0;
        flex: 1 0 auto;
      }`}</style>

    <style>{`.${STYLE_CLASS_PREFIX}_heading-container {
    display: flex;
      margin: 4px 0;
  }`}</style>
    <style>{`.${STYLE_CLASS_PREFIX}_step-heading {
      padding: 4px 12px;
      font-weight: 500;
      font-size: 24px;
  }`}</style>
    <style>
      {`
  .${STYLE_CLASS_PREFIX}_action-bar {
    display: flex;
    justify-content: flex-end;
  }
  .${STYLE_CLASS_PREFIX}_action-button {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin: 0 4px;
    font-size: 1.1rem;
  }
  .${STYLE_CLASS_PREFIX}_next-button {
    background-color: hsl(125, 50%, 50%);
    color: white;
    font-weight: bold;
  }
  `}
    </style>
  </>
);

const ConfigureStep = ({
  children,
  stepId,
}: {
  children: ReactNode;
  stepId: number;
}) => {
  const configureState = useConfigureStepsHook();

  return (
    <>
      {stepId === configureState.currentStep ? (
        <div className={`${STYLE_CLASS_PREFIX}_step-container`}>{children}</div>
      ) : null}
    </>
  );
};

const ConfigComponent = ({ steps }: { steps: ConfigStepType[] }) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isComplete, setIsComplete] = React.useState(false);
  const configureStepsRef = React.useRef<ConfigureRefType>({});

  configureStepsRef.current.maxSteps = steps?.length;

  const stepSort = (step1: ConfigStepType, step2: ConfigStepType) => {
    if (!step1.serial || !step2.serial) return 0;

    return step1.serial - step2.serial;
  };

  const sortedSteps = [...steps].sort(stepSort);

  return (
    <>
      <ConfigureStyleComponent />
      <ConfigureStepsContext.Provider
        value={{
          currentStep,
          setCurrentStep,
          configureStepsRef,
          isComplete,
          setIsComplete,
        }}
      >
        <div
          data-testid="config-component"
          className={`${STYLE_CLASS_PREFIX}_config-component`}
        >
          {![...sortedSteps]?.length
            ? "no steps"
            : [...sortedSteps].map((step, index) => {
                return (
                  <ConfigureStep key={index} stepId={index + 1}>
                    <StepHeading heading={step.heading} />
                    <Frame frame={step.frame} />
                    <ActionBar {...step} />
                  </ConfigureStep>
                );
              })}
        </div>
      </ConfigureStepsContext.Provider>
    </>
  );
};

export const useConfigureStepClientHook = () => {
  const { currentStep, isComplete } = React.useContext(ConfigureStepsContext);

  return { currentStep, isComplete };
};

export default ConfigComponent;
