import { 
  NumberDecrementStepper, NumberIncrementStepper, 
  NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export interface CNumberInputProps {
  defaultValue?: number,
  onBlur?(value: number): void,
  id: string
  [key: string]: any,
}

export default function CNumberInput(props: CNumberInputProps) {
  const [value, setValue] = useState(props.defaultValue);
  useEffect(() => {
    if (props.defaultValue) {
      setValue(props.defaultValue);
      const input = document.getElementById(props.id) as HTMLInputElement;
      try {
        input.value = props.defaultValue.toString();
      } catch (e) { }
    }
  }, [props.defaultValue]);
  return (
    <NumberInput {...props} value={value} 
    onChange={(_, n) => {
      setValue(isNaN(n) ? 0 : n);
    }}
    onBlur={() => {
      let clampedValue = value!;
      if (props.min && clampedValue < props.min) {
        clampedValue = props.min;
      }
      if (props.max && clampedValue > props.max) {
        clampedValue = props.max;
      }
      props.onBlur && props.onBlur(clampedValue);
    }} defaultValue={props.defaultValue}>
      <NumberInputField/>
      <NumberInputStepper>
        <NumberIncrementStepper/>
        <NumberDecrementStepper/>
      </NumberInputStepper>
    </NumberInput>
  );
}