import AllCompleted from '@/app/project/components/AllCompleted';
import ColumnAnalysis from '@/app/project/components/ColumnAnalysis';
import GenerateInfographic from '@/app/project/components/GenerateInfographic';
import PathAnalysis from '@/app/project/components/PathAnalysis';
import SelectData from '@/app/project/components/SelectData';
import StepperComponent from '@/app/project/components/StepperComponent';
import Summary from '@/app/project/components/Summary';

export default function ProjectPage() {
  const steps = [
    'Select data',
    'Column analysis',
    'Path analysis',
    'Generate infographic',
    'Summary analysis',
    'Completed',
  ];
  const components = [
    <SelectData key={0} />,
    <ColumnAnalysis key={1} />,
    <PathAnalysis key={2} />,
    <GenerateInfographic key={3} />,
    <Summary key={4} />,
    <AllCompleted key={5} />,
  ];
  return <StepperComponent steps={steps} components={components}></StepperComponent>;
}
