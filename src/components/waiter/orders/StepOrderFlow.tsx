
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { OrderStep } from '@/types/order';
import { ArrowLeft, ArrowRight, Store, Users, Utensils, ClipboardList, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface StepOrderFlowProps {
  currentStep: OrderStep;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isSubmitting: boolean;
  canProceed?: boolean;
  isLastStep?: boolean;
  onSubmit?: () => void;
}

export const StepOrderFlow: React.FC<StepOrderFlowProps> = ({
  currentStep,
  goToNextStep,
  goToPreviousStep,
  isSubmitting,
  canProceed = true,
  isLastStep = false,
  onSubmit
}) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  const steps: { id: OrderStep; label: string; icon: React.ReactNode }[] = [
    { id: 'order-type', label: t('Order Type'), icon: <Store className="h-4 w-4" /> },
    { id: 'table-selection', label: t('Table'), icon: <Utensils className="h-4 w-4" /> },
    { id: 'customer-info', label: t('Customer'), icon: <Users className="h-4 w-4" /> },
    { id: 'menu-selection', label: t('Menu Items'), icon: <Utensils className="h-4 w-4" /> },
    { id: 'order-review', label: t('Review'), icon: <ClipboardList className="h-4 w-4" /> },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  // Only show the steps that make sense for the current flow
  const filteredSteps = steps.filter(step => {
    // Hide table-selection step if not dine-in
    if (step.id === 'table-selection' && !(currentStep === 'table-selection' || currentStepIndex > steps.findIndex(s => s.id === 'table-selection'))) {
      return false;
    }
    return true;
  });
  
  // Hide navigation buttons on the review step since it has its own buttons
  const showNavButtons = currentStep !== 'order-review';

  return (
    <div className="w-full">
      {/* Progress Steps - Only show on desktop */}
      {!isMobile && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {filteredSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={cn(
                  "flex flex-col items-center relative",
                  currentStepIndex >= index ? "text-primary" : "text-muted-foreground"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-1 border-2",
                    currentStepIndex >= index ? "border-primary bg-primary text-white" : "border-muted-foreground"
                  )}>
                    {step.icon}
                  </div>
                  <span className="text-xs font-medium">{step.label}</span>
                </div>
                {index < filteredSteps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-2",
                    currentStepIndex > index ? "bg-primary" : "bg-muted-foreground/30"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Mobile progress indicator */}
      {isMobile && (
        <div className="mb-4 text-sm text-muted-foreground">
          <p className="flex items-center">
            <span className="font-medium text-foreground">{filteredSteps[currentStepIndex]?.label}</span>
            <span className="mx-2">•</span>
            <span>Step {currentStepIndex + 1} of {filteredSteps.length}</span>
          </p>
        </div>
      )}

      {/* Navigation Buttons - only show when not in review step */}
      {showNavButtons && (
        <div className="flex justify-between mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 'order-type' || isSubmitting}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <T text="Back" />
          </Button>

          {isLastStep ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={!canProceed || isSubmitting}
              className="flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              <T text="Place Order" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goToNextStep}
              disabled={!canProceed || isSubmitting}
              className="flex items-center"
            >
              <T text="Next" />
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
