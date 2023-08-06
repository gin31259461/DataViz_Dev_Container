'use client';

import { useProjectStore } from '@/hooks/store/useProjectStore';
import { useSplitLineStyle } from '@/hooks/useStyles';
import { tokens } from '@/utils/theme';
import { Box, Button, Grid, Step, StepLabel, Stepper, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface StepperComponentProps {
  steps: string[];
  components: React.ReactNode[];
}

const StepperComponent: React.FC<StepperComponentProps> = ({ steps, components }) => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const target = useProjectStore((state) => state.target);
  const features = useProjectStore((state) => state.features);
  const selectedPathID = useProjectStore((state) => state.selectedPathID);
  const router = useRouter();
  const borderStyle = useSplitLineStyle();

  const backButtonDisabled = () => {
    if (activeStep !== 0) return false;
    return true;
  };

  const nextButtonDisabled = () => {
    if (activeStep == 0 && selectedDataOID) return false;
    if (activeStep == 1 && target && features) return false;
    if (activeStep == 2 && selectedPathID) return false;
    if (activeStep == 3) return false;
    if (activeStep == 4) return false;
    if (activeStep == 5) return false;
    return true;
  };

  const stepStyle = {
    '& .Mui-active': {
      '& .MuiStepIcon-root': {
        color: theme.palette.info.main,
      },
    },
    '& .Mui-completed': {
      '& .MuiStepIcon-root': {
        color: colors.greenAccent[500],
      },
    },
    '& .Mui-disabled': {
      '& .MuiStepIcon-root': {
        color: theme.palette.action.disabled,
      },
    },
  };

  return (
    <Grid container>
      <Grid
        container
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: 2,
          height: 140,
          borderBottom: borderStyle,
        }}
      >
        <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
          <Stepper activeStep={activeStep} orientation="horizontal" sx={{ ...stepStyle, width: '100%' }}>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid container>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              disabled={backButtonDisabled()}
              color="info"
              sx={{ position: 'absolute', fontSize: 15, left: 20 }}
              onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : prev))}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              disabled={nextButtonDisabled()}
              color="info"
              sx={{ position: 'absolute', fontSize: 15, right: 20 }}
              onClick={() => {
                if (activeStep === steps.length - 1) router.push('/management/infographic');
                setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
              }}
              variant={activeStep !== steps.length - 1 ? 'outlined' : 'contained'}
            >
              {activeStep !== steps.length - 1 ? 'Next' : 'Confirm'}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          display: 'flex',
          padding: 2,
          height: 'calc(100vh - 140px - 80px)',
          overflowX: 'auto',
        }}
      >
        {components[activeStep]}
      </Grid>
    </Grid>
  );
};

export default StepperComponent;
