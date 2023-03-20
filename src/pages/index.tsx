import { 
  Alert,
  AlertIcon,
  Box, Button, Card, CardBody, 
  Checkbox, 
  Heading, Modal, ModalBody, 
  ModalContent, ModalFooter, 
  ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Radio, RadioGroup, Stack, useDisclosure 
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const gameModal = useDisclosure();
  const [config, setConfig] = useState({
    players: 2,
    boards: 10,
    cheats: 0,
    timer: 20*1000,
    elapsed: 'board'
  });
  const [gameColor, setGameColor] = useState('orange.400');
  const [gamePreset, setGamePreset] = useState('Standard');
  const router = useRouter();
  return (
    <Box className="container" paddingTop="50px">
      <Stack direction="row">
        <Box flexGrow="1">
          <Heading fontFamily="inherit">Game Play</Heading>
        </Box>
        <Stack justifyContent="center">
          <Button leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5ZM12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5ZM1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8Zm9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5Zm1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Z" />
            </svg>
          } colorScheme="teal" variant="outline"
          onClick={() => {
            setConfig({
              players: 2,
              boards: 10,
              cheats: 0,
              timer: 20,
              elapsed: 'board'
            });
            setGameColor('teal');
            setGamePreset('Customize');
            gameModal.onOpen();
          }}>Customize</Button>
        </Stack>
      </Stack>
      <Stack direction="row" gap="10px" marginTop="15px">
        <Card
          borderRadius="5px"
          bg="orange.400"
          color="white"
          width="25%"
          cursor="pointer"
          onClick={() => {
            setConfig({
              players: 2,
              boards: 10,
              cheats: 0,
              timer: 20,
              elapsed: 'board'
            });
            setGameColor('orange');
            setGamePreset('Standard');
            gameModal.onOpen();
          }}>
          <CardBody>
            <Heading size="md" fontFamily="inherit">Standard</Heading>
            <small>
              <p>Players: 2</p>
              <p>Boards: 10</p>
              <p>Cheating: Off</p>
            </small>
          </CardBody>
        </Card>
        <Card
          borderRadius="5px"
          bg="blue.400"
          color="white"
          width="25%"
          cursor="pointer"
          onClick={() => {
            setConfig({
              players: 2,
              boards: 10,
              cheats: 1,
              timer: 20,
              elapsed: 'cheat'
            });
            setGameColor('blue');
            setGamePreset('Cheatable');
            gameModal.onOpen();
          }}>
          <CardBody>
            <Heading size="md" fontFamily="inherit">Cheatable</Heading>
            <small>
              <p>Players: 2</p>
              <p>Boards: 10</p>
              <p>Cheating: On</p>
            </small>
          </CardBody>
        </Card>
        <Card
          borderRadius="5px"
          bg="red.400"
          color="white"
          width="25%"
          cursor="pointer"
          onClick={() => {
            setConfig({
              players: 2,
              boards: -1,
              cheats: 0,
              timer: 20,
              elapsed: 'lose'
            });
            setGameColor('red');
            setGamePreset('Unlimited Boards');
            gameModal.onOpen();
          }}>
          <CardBody>
            <Heading size="md" fontFamily="inherit">Unlimited Boards</Heading>
            <small>
              <p>Players: 2</p>
              <p>Boards: infinite</p>
              <p>Cheating: Off</p>
            </small>
          </CardBody>
        </Card>
        <Card
          borderRadius="5px"
          bg="green.400"
          color="white"
          width="25%"
          cursor="pointer"
          onClick={() => {
            setConfig({
              players: 4,
              boards: 7,
              cheats: 0,
              timer: 20,
              elapsed: 'lose'
            });
            setGameColor('green');
            setGamePreset('Game with 4');
            gameModal.onOpen();
          }}>
          <CardBody>
            <Heading size="md" fontFamily="inherit">Game with 4</Heading>
            <small>
              <p>Players: 4</p>
              <p>Boards: 7</p>
              <p>Cheating: Off</p>
            </small>
          </CardBody>
        </Card>
      </Stack>
      <Heading fontFamily="inherit" marginTop="30px">Replays</Heading>
      <Alert status='info' variant='left-accent' marginTop='15px'>
        <AlertIcon />
        Replays are currently under construction.
      </Alert>
      <Modal isCentered isOpen={gameModal.isOpen} onClose={gameModal.onClose}>
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px)'/>
        <ModalContent>
          <Box 
            bg={`${gameColor}.400`}
            borderTopLeftRadius='5px' borderTopRightRadius='5px'
            padding='20px 24px'>
            <Heading size='md' fontFamily='inherit' color='white'>New Game - {gamePreset}</Heading>
          </Box>
          <ModalBody paddingTop='20px'>
            { gamePreset === 'Customize' ? 
            <>
            <p>
              <strong>Players</strong>
            </p>
            <RadioGroup defaultValue='2' onChange={e => {
              config.players = parseInt(e);
              if (config.players === 4 && config.elapsed !== 'lose') {
                config.elapsed = 'lose';
              }
              setConfig({ ...config });
            }}>
              <Stack spacing={5} direction='row'>
                <Radio value='2'>
                  2
                </Radio>
                <Radio value='4'>
                  4
                </Radio>
              </Stack>
            </RadioGroup>
            <p style={{ marginTop: '5px' }}>
              <strong>Boards</strong>
            </p>
            {config.boards >= 0 ? <NumberInput value={config.boards} min={1} isDisabled={config.boards < 0} onChange={(_, n) => {
              config.boards = n;
              setConfig({ ...config });
            }}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            : undefined}
            <Checkbox marginTop='3px' onChange={e => {
              config.boards = e.target.checked ? -1 : 10;
              if (config.boards < 0 && config.elapsed === 'board') {
                config.elapsed = 'lose';
              }
              setConfig({ ...config });
            }}>
              Infinite Boards
            </Checkbox>
            <p style={{ marginTop: '5px' }}>
              <strong>Cheats</strong>
            </p>
            <Checkbox onChange={e => {
              config.cheats = e.target.checked ? 1 : 0;
              if (!config.cheats && config.elapsed === 'cheat') {
                config.elapsed = 'lose';
              }
              setConfig({ ...config });
            }} isChecked={config.cheats > 0}>
              Enable Cheating
            </Checkbox>
            { config.cheats > 0 ?
            <NumberInput value={config.cheats} min={1} 
            onChange={(_, n) => {
              config.cheats = n;
              setConfig({ ...config });
            }}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            : undefined}
            <p style={{ marginTop: '5px' }}>
              <strong>Timer</strong>
            </p>
            <Checkbox defaultChecked onChange={e => {
              config.timer = e.target.checked ? 20 : 0;
              setConfig({ ...config });
            }} isChecked={config.timer > 0}>
              Enable Timer
            </Checkbox>
            { config.timer > 0 ? <>
            <NumberInput value={config.timer} min={1} 
            onChange={(_, n) => {
              config.timer = n;
              setConfig({ ...config });
            }}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <p style={{ marginTop: '5px' }}>
              <strong>Timeout Punishment</strong>
            </p>
            <RadioGroup value={config.elapsed} onChange={e => {
              config.elapsed = e;
              setConfig({ ...config });
            }}>
              <Stack direction='column'>
                <Radio value='lose'>
                  Surrender
                </Radio>
                <Radio value='board' isDisabled={config.players !== 2 || config.boards < 0}>
                  +1 Board (opponent)
                </Radio>
                <Radio value='cheat' isDisabled={config.players !== 2 || config.cheats <= 0}>
                  +1 Cheat (opponent)
                </Radio>
              </Stack>
            </RadioGroup>
            </>: undefined }
            </> : 
            <>
            <p>
              <strong>Players</strong>: {config.players}
            </p>
            <p>
              <strong>Boards</strong>: {config.boards < 0 ? 'infinite' : config.boards}
            </p>
            <p>
              <strong>Cheats</strong>: {config.cheats}
            </p>
            <p>
              <strong>Timer</strong>: {config.timer}secs
            </p>
            <p>
              <strong>Timeout Punishment</strong>: {{
                'lose': 'Surrender',
                'board': '+1 Board (opponent)',
                'cheat': '+1 Cheat (opponent)'
              }[config.elapsed]}
            </p>
            </>
            }
          </ModalBody>
          <ModalFooter>
            <Stack direction='row' justifyContent='end'>
              <Button onClick={gameModal.onClose} variant='ghost'>Close</Button>
              <Button colorScheme={gameColor} onClick={() => {
                const json = JSON.stringify(config);
                router.push('/game?config=' + encodeURIComponent(json));
              }}>Go!</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
