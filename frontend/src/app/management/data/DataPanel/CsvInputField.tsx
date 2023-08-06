import { isValidCsvString } from '@/lib/checkValid';
import { convertCsvToFile } from '@/lib/toFile';
import { FormControlLabel, FormHelperText, Radio, RadioGroup, TextField } from '@mui/material';
import { useState } from 'react';

type InputType = 'upload' | 'text' | 'url';

interface CsvInputFiledProps {
  onInputChange: (file: File | string | null) => void;
}

export default function CsvInputFiled({ onInputChange }: CsvInputFiledProps) {
  const [inputType, setInputType] = useState<InputType>('upload');
  const [inputValue, setInputValue] = useState<string | File>('');
  const [invalid, setInvalid] = useState(false);
  const urlRegex = /^(?:https?:\/\/)?(?:www\.)?[a-z0-9]+(?:[\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(?::[0-9]{1,5})?(?:\/.*)?$/;

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (!isValidCsvString(event.target.value)) {
      setInvalid(true);
      onInputChange(null);
    } else {
      setInvalid(false);
      const file = convertCsvToFile(event.target.value);
      onInputChange(file);
    }
  };

  const handleUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (!urlRegex.test(event.target.value)) {
      setInvalid(true);
      onInputChange(null);
    } else {
      setInvalid(false);
      onInputChange(event.target.value);
    }
  };

  const handleInputTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputType(event.target.value as InputType);
    setInputValue('');
    setInvalid(false);
    onInputChange(null);
  };

  return (
    <div>
      <RadioGroup
        aria-label="input type"
        name="inputType"
        value={inputType}
        onChange={handleInputTypeChange}
        row
        sx={{ marginTop: 5, width: '100%' }}
      >
        <FormControlLabel value="upload" control={<Radio color="secondary" />} label="CSV File" />
        <FormControlLabel value="text" control={<Radio color="secondary" />} label="CSV Text" />
        <FormControlLabel value="url" control={<Radio color="secondary" />} label="URL" />
      </RadioGroup>
      {inputType === 'upload' && (
        <TextField
          type="file"
          inputProps={{ accept: '.csv' }}
          fullWidth
          onChange={(e) => {
            // const fileName = e.target.value.split(/(\\|\/)/g).pop();
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              // setInputValue(fileName !== undefined ? fileName : '');
              onInputChange(file);
            }
          }}
        />
      )}
      {inputType === 'text' && (
        <TextField
          label="Input csv text"
          error={invalid}
          fullWidth
          multiline
          value={inputValue}
          onChange={handleTextInputChange}
        />
      )}
      {inputType === 'url' && (
        <TextField
          error={invalid}
          label="Input valid csv url"
          fullWidth
          value={inputValue}
          onChange={handleUrlInputChange}
        />
      )}
      {invalid && <FormHelperText error>Invalid format</FormHelperText>}
    </div>
  );
}
