import { ButtonGroup, Button } from '../../styles/MainStyles';

/**
 * Step navigation controls component
 *
 * @param {Object} props - Component props
 * @param {number} props.currentStep - Current simulation step
 * @param {Function} props.onPreviousStep - Handler for moving to previous step
 * @param {Function} props.onNextStep - Handler for moving to next step
 * @param {boolean} [props.disableNext=false] - Whether next step button should be disabled
 * @param {boolean} [props.disablePrevious=false] - Whether previous step button should be disabled
 * @returns {JSX.Element} - Rendered step controls
 */
export function StepControls({
    currentStep,
    onPreviousStep,
    onNextStep,
    disableNext = false,
    disablePrevious = false
}) {
    return (
        <ButtonGroup>
          <Button
            onClick={onPreviousStep}
            disabled={disablePrevious || currentStep === 1}
            aria-label="Go to previous step"
          >
            ← Previous Step
          </Button>
          <Button
            onClick={onNextStep}
            disabled={disableNext}
            aria-label="Validate and go to next step"
          >
            Next Step →
          </Button>
        </ButtonGroup>
    );
}
