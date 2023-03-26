import { 
  Alert,
  AlertIcon,
  Box, Button, Card, CardBody, 
  Checkbox, 
  Heading, Modal, ModalBody, 
  ModalContent, ModalFooter, 
  ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Radio, RadioGroup, Stack, Text, useDisclosure, useToast 
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { SerializedGameReplay, TimerElapsed } from "@/shared/game";
import { formatDate } from "@/shared/utils";

export default function Home() {
  const gameModal = useDisclosure();
  const [config, setConfig] = useState({
    players: 2,
    boards: 10,
    cheats: 0,
    timer: 20*1000,
    elapsed: TimerElapsed.BOARD
  });
  const [gameColor, setGameColor] = useState('orange.400');
  const [gamePreset, setGamePreset] = useState('Standard');
  const [replays, setReplays] = useState<[string, SerializedGameReplay][]>([]);
  const router = useRouter();
  const toast = useToast();
  function loadReplays() {
    invoke('list_replays').then(value => {
      setReplays(value as [string, SerializedGameReplay][]);
    })
  }
  useEffect(() => {
    loadReplays();
  }, []);
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
              elapsed: TimerElapsed.BOARD
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
          bgGradient="linear(to-r, orange.400 80%, orange.500 100%)"
          color="white"
          width="25%"
          cursor="pointer"
          onClick={() => {
            setConfig({
              players: 2,
              boards: 10,
              cheats: 0,
              timer: 20,
              elapsed: TimerElapsed.BOARD
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
          bgGradient="linear(to-r, blue.400 80%, blue.500 100%)"
          color="white"
          width="25%"
          cursor="pointer"
          onClick={() => {
            setConfig({
              players: 2,
              boards: 10,
              cheats: 1,
              timer: 20,
              elapsed: TimerElapsed.CHEAT
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
          bgGradient="linear(to-r, red.400 80%, red.500 100%)"
          color="white"
          width="25%"
          cursor="pointer"
          onClick={() => {
            setConfig({
              players: 2,
              boards: -1,
              cheats: 0,
              timer: 20,
              elapsed: TimerElapsed.LOSE
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
          bgGradient="linear(to-r, green.400 80%, green.500 100%)"
          color="white"
          width="25%"
          cursor="pointer"
          onClick={() => {
            setConfig({
              players: 4,
              boards: 7,
              cheats: 0,
              timer: 20,
              elapsed: TimerElapsed.LOSE
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
      { replays.length ? 
      <Stack marginTop='15px' direction='column' gap='10px'>
        {
          replays.sort((a, b) => b[1].time - a[1].time).map(([id, replay]) => 
          <Card bgGradient='linear(to-r, teal.500 40%, teal.50 70%)' color='white' 
            paddingTop='15px' paddingBottom='15px'
            paddingLeft='20px' paddingRight='20px'
            key={id}>
            <Stack direction='row'>
              <Box flexGrow='1'>
                <Text fontSize='12px' color='whiteAlpha.700'>
                  Replay ID: {id}
                </Text>
                <Heading size='md'>{replay.name} ({formatDate(replay.time)})</Heading>
              </Box>
              <Stack direction='column' justifyContent='center'>
                <Button variant='ghost' colorScheme='blue' leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
                  </svg>
                } onClick={() => {
                  router.push(`/replay?id=${id}`);
                }}>
                  View
                </Button>
              </Stack>
              <Stack direction='column' justifyContent='center'>
                <Popover>
                  <PopoverTrigger>
                    <Button variant='ghost' colorScheme='red' leftIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                      </svg>
                    }>
                      Delete
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent color='black'>
                    <PopoverArrow/>
                    <PopoverHeader>
                      <strong>
                        Confirmation
                      </strong>
                    </PopoverHeader>
                    <PopoverCloseButton/>
                    <PopoverBody>
                      Are you sure you want to delete this replay?
                    </PopoverBody>
                    <PopoverFooter>
                      <Button colorScheme='red' size='sm' float='right' onClick={() => {
                        invoke('delete_replay', { id }).then(() => {
                          loadReplays();
                          toast({
                            status: 'success',
                            position: 'top',
                            duration: 3000,
                            title: 'Successfully deleted replay.',
                            description: `Replay "${replay.name}" has been deleted.`
                          })
                        });
                      }}>Yes</Button>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
              </Stack>
            </Stack>
          </Card>)
        }
      </Stack> :
      <Alert status='info' variant='left-accent' marginTop='15px'>
        <AlertIcon />
        No replays available. Save your game via the "Save Replay" button.
      </Alert>
      }
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
              if (config.players === 4 && config.elapsed !== TimerElapsed.LOSE) {
                config.elapsed = TimerElapsed.LOSE;
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
              if (config.boards < 0 && config.elapsed === TimerElapsed.BOARD) {
                config.elapsed = TimerElapsed.LOSE;
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
              if (!config.cheats && config.elapsed === TimerElapsed.CHEAT) {
                config.elapsed = TimerElapsed.LOSE;
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
            <RadioGroup value={config.elapsed.toString()} onChange={e => {
              config.elapsed = parseInt(e);
              setConfig({ ...config });
            }}>
              <Stack direction='column'>
                <Radio value='0'>
                  Surrender
                </Radio>
                <Radio value='1' isDisabled={config.players !== 2 || config.boards < 0}>
                  +1 Board (opponent)
                </Radio>
                <Radio value='2' isDisabled={config.players !== 2 || config.cheats <= 0}>
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
                [TimerElapsed.LOSE]: 'Surrender',
                [TimerElapsed.BOARD]: '+1 Board (opponent)',
                [TimerElapsed.CHEAT]: '+1 Cheat (opponent)'
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
