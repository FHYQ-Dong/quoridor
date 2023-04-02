import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export interface CodeBoxProps {
  style?: Record<string, any>,
  tag?: string
}

export default function CodeBox(props: PropsWithChildren<CodeBoxProps>) {
  return (
    <Box {...props.style}>
      { props.tag ? 
      <Box fontSize='10px' padding='5px' 
        border='1.5px solid' 
        borderColor='teal.600'
        borderTopLeftRadius='5px'
        borderTopRightRadius='5px'>
        {props.tag}
      </Box>
      : undefined }
      <Box className='mono' 
      borderBottomLeftRadius='5px'
      borderBottomRightRadius='5px'
      bg='teal.600'
      padding='5px' color='white'>
        {props.children}
      </Box>
    </Box>
  );
}