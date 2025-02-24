import { ButtonGroup, Button } from '../../styles/MainStyles';

export function StepControls({ currentStep, onPreviousStep, onNextStep }) {
    return (
        <ButtonGroup>
          <Button onClick={onPreviousStep} disabled={currentStep === 1}>
            Go to the previous step
          </Button>
          <Button onClick={onNextStep}>
            Validate and go to the next step
          </Button>
        </ButtonGroup>
    );
}
