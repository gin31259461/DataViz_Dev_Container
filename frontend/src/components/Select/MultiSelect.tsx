import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

// interface Option {
//   value: string;
//   label: string;
// }

interface MultiSelectProps {
  options: string[];
  onChange: (selectedValues: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, onChange }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(options);

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const selected = event.target.value as string[];
    setSelectedValues(selected);
    onChange(selected);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Select options</InputLabel>
      <Select
        multiple
        value={selectedValues}
        onChange={handleSelectChange}
        renderValue={(selected) => (selected as string[]).join(', ')}
        label="Select options"
      >
        {options
          .sort((a, b) => Number(a) - Number(b))
          .map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox color="info" checked={selectedValues.includes(option)} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
