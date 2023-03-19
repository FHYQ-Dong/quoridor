import { Direction, pointEquals } from "@/shared/common";
import { GameDisplay } from "@/shared/display";
import { Game as GameLogic } from "@/shared/game";
import timer from "@/shared/timer";
import { parseQuery } from "@/shared/utils";
import { Box, Button, Card, CardBody, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";

const PREPARE = 0;
const GAME = 1;
const FINISH = 2;

export default function Game() {
  const router = useRouter();
  const [config, setConfig] = useState(
    {
      players: 2,
      boards: 10,
      timer: 200,
      cheats: 0,
      elapsed: 'board'
    }
  );
  const [phase, setPhase] = useState(PREPARE);
  const [prepared, setPrepared] = useState([false, false, false, false])
  const [game, setGame] = useState<GameLogic>();
  const [gameDisplay, setGameDisplay] = useState<GameDisplay>();
  const [gameTurn, setGameTurn] = useState(config.players-1);
  const [extendedRound, setExtendedRound] = useState(false);
  const [nextBoardLength, setNextBoardLength] = useState(2);
  const [winners, setWinners] = useState<number[]>([]);
  const [losers, setLosers] = useState<number[]>([]);
  const [timerElapsed, setTimerElapsed] = useState(false);
  const [timerCounter, setTimerCounter] = useState(200);
  const prepareModal = useDisclosure({
    defaultIsOpen: true
  });
  const cheatModal = useDisclosure();
  const finishModal = useDisclosure();
  useEffect(() => {
    const config = JSON.parse(decodeURIComponent(parseQuery().config));
    setConfig(config);
    if (config.players === 2)
      setPrepared([false, false])
  }, []);
  useEffect(() => {
    if (prepared.every(x => x)) {
      setPhase(GAME);
      prepareModal.onClose();
    }
  }, [prepared]);
  useEffect(() => {
    if (phase === GAME) {
      setGame(new GameLogic({
        players: config.players,
        boards: config.boards,
        cheats: config.cheats
      }));
      const display = new GameDisplay(
        (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d')!,
        600
      );
      setGameDisplay(display);
    }
  }, [phase]);
  useEffect(() => {
    gameDisplay?.render(game!.state);
    const handler = (ev: any) => {
      const unit = gameDisplay!.getUnit(config.players);
      let baseX = Math.floor(ev.offsetX / unit);
      let baseY = Math.floor(ev.offsetY / unit);
      const modX = ev.offsetX % unit;
      const modY = ev.offsetY % unit;
      let point = false;
      if (modX < unit / 4 && modY < unit / 4) {
        point = true;
      }
      else if (modX < unit / 4 && modY > unit * 3 / 4) {
        point = true;
        baseY += 1;
      }
      else if (modX > unit * 3 / 4 && modY < unit / 4) {
        point = true;
        baseX += 1;
      }
      else if (modX > unit * 3 / 4 && modY > unit * 3 / 4) {
        point = true;
        baseX += 1;
        baseY += 1;
      }
      handleClick(point, baseX, baseY);
    };
    if (gameDisplay)
      document.getElementById('canvas')!.addEventListener('click', handler);
    let current = '';
    let choices: any[] | undefined;
    const handleClick = (point: boolean, x: number, y: number) => {
      if (current === 'move') {
        if (point || !choices!.some(choice => pointEquals(choice.to, [x, y]))) {
          current = '';
          choices = undefined;
          gameDisplay?.render(game!.state);
        }
        else {
          game!.state.players[gameTurn].position = [x, y];
          if (game!.isWinner(gameTurn)) {
            setWinners([...winners, gameTurn]);
            return;
          }
          if (extendedRound) setExtendedRound(false);
          else nextTurn();
        }
      }
      else if (current === 'board') {
        let choice;
        if (!point || !(choice = choices!.find(choice => pointEquals(choice.hint, [x, y])))) {
          current = '';
          choices = undefined;
          gameDisplay?.render(game!.state);
        }
        else {
          game!.state.boards.push({
            position: choice.position,
            orientation: choice.orientation,
            destroyed: false,
            length: nextBoardLength
          })
          game!.state.players[gameTurn].boards -= 1;
          setNextBoardLength(2);
          if (extendedRound) setExtendedRound(false);
          else nextTurn();
        }
      }
      else {
        if (point) {
          if (game!.state.players[gameTurn].boards === 0) {
            return;
          }
          gameDisplay?.renderBoardChoices(
            game!.state,
            [x, y],
            choices = game!.boardChoices([x, y], nextBoardLength)
          )
          current = 'board';
        }
        else if (nextBoardLength === 2 && pointEquals([x, y], game!.state.players[gameTurn].position)) {
          gameDisplay?.renderMoveChoices(
            game!.state,
            choices = game!.moveChoices([x, y])
          );
          current = 'move';
        }
      }
    }
    return () => {
      document.getElementById('canvas')?.removeEventListener('click', handler);
    }
  }, [game, gameDisplay, gameTurn, extendedRound, nextBoardLength]);
  useEffect(() => {
    let cancel: any = undefined;
    if (phase === GAME) {
      setTimerElapsed(false);
      cancel = timer(config.timer, () => {
        switch (config.elapsed) {
          case 'lose': {
            surrender();
            break;
          }
          case 'board': {
            game!.state.players[(gameTurn + 1) % config.players].boards += 1;
            break;
          }
          case 'cheat': {
            game!.state.players[(gameTurn + 1) % config.players].cheats += 1;
            break;
          }
        }
        setTimerElapsed(true);
      }, counter => {
        setTimerCounter(counter);
      })
    }
    return () => {
      cancel && cancel();
    }
  }, [gameTurn, game])
  useEffect(() => {
    nextTurn();
  }, [winners, losers]);
  function nextTurn() {
    if (winners.length + losers.length >= config.players - 1) {
      setPhase(FINISH);
      finishModal.onOpen();
      gameDisplay?.render(game!.state);
    }
    let nextTurn = gameTurn;
    do {
      nextTurn = (nextTurn + 1) % config.players;
    } while (winners.includes(nextTurn) || losers.includes(nextTurn))
    setGameTurn(nextTurn);
  }
  function surrender() {
    setLosers([...losers, gameTurn]);
  }
  function ranking() {
    return [...winners, gameTurn, ...[...losers].reverse()];
  }
  return (
    <>
      <Stack className='fill' direction='column' justifyContent='center'>
        <Stack justifyContent='space-evenly' direction='row'>
          <Box>
            <canvas width='600' height='600' style={{ border: '1px solid rgba(0, 0, 0, .2)'}} id='canvas'></canvas>
          </Box>
          <Stack direction='column' justifyContent='center'>
            <Box textAlign='center'>
              <Heading size='2xl' color={ timerElapsed ? 'red.400' : 'black' }>
                <span style={{ fontSize: '70px' }}>{Math.floor(timerCounter / 10)}</span>
                .{timerCounter % 10}
              </Heading>
              <Stack direction='row' marginTop='50px' gap='10px'>
                { game && game.state.players.map((player, index) => 
                <Box 
                  key={index} 
                  border='3px solid' borderColor={gameTurn === index ? 'pink.400' : 'white'} borderRadius='10px' 
                  padding='10px'
                  opacity={ winners.includes(index) || losers.includes(index) ? 0.5 : 1 }>
                  <Box 
                  bg={['red.400', 'blue.400', 'green.400', 'yellow.400'][index]} width='50px' height='50px' borderRadius='50%'
                  marginLeft='auto' marginRight='auto'></Box>
                  <p>
                    <strong>
                      Player{index+1}
                    </strong>
                  </p>
                  <p>
                    <strong>
                      Boards: {player.boards < 0 ? 'infinite' : player.boards}
                    </strong>
                  </p>
                  <p>
                    <strong>
                      Cheats: {player.cheats}
                    </strong>
                  </p>
                  <p>
                    <strong>
                      Cheated: {player.cheated ? 'yes': 'no'}
                    </strong>
                  </p>
                  { winners.includes(index)? <Text color='green.400'><strong>WINNER</strong></Text>: undefined }
                  { losers.includes(index)? <Text color='red.400'><strong>LOSER</strong></Text>: undefined }
                </Box>)
                }
              </Stack>
              <Stack marginTop='40px' direction='row' gap='10px' justifyContent='center'>
                <Button colorScheme='red' variant='outline'
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21.294 21.294 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21.317 21.317 0 0 0 14 7.655V1.222z"/>
                  </svg>
                } onClick={surrender}>
                  Surrender
                </Button>
                <Button colorScheme='cyan' variant='outline'
                leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4H6v-4ZM7 1v1h1V1H7Zm2 0v1h1V1H9ZM5.5 5a.5.5 0 0 0-.5.5V15a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V5.5a.5.5 0 0 0-.5-.5h-6Z"/>
                </svg>}
                onClick={cheatModal.onOpen}
                isDisabled={game && game.state.players[gameTurn].cheats <= 0}>
                  Cheat
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Stack>
      <Modal
        isCentered 
        isOpen={prepareModal.isOpen} 
        onClose={prepareModal.onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}>
          <ModalOverlay backdropFilter='blur(10px)'/>
          <ModalContent>
            <ModalBody textAlign='center'>
              <Heading size='lg'>Prepare!</Heading>
              <Stack direction='row' justifyContent='center' marginTop='30px'>
                {Array(config.players).fill(0).map((_, index) =>
                <Box>
                  <Box key={index}
                  bg={['red.400', 'blue.400', 'green.400', 'yellow.400'][index]} width='50px' height='50px' borderRadius='50%'
                  marginLeft='auto' marginRight='auto'></Box>
                  <p>
                    <strong>
                      Player{index+1}
                    </strong>
                  </p>
                  <Button variant='ghost' colorScheme={
                    prepared[index] ? 'green' : 'red'
                  }
                  isDisabled = {prepared[index]}
                  onClick={() => {
                    prepared[index] = true;
                    setPrepared([...prepared]);
                  }}>{ prepared[index] ? "Ready": "Prepare" }</Button>
                </Box>
                )}
              </Stack>
            </ModalBody>
          </ModalContent>
      </Modal>
      <Modal isOpen={cheatModal.isOpen} isCentered onClose={cheatModal.onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Cheatsheet</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Stack direction='column' marginBottom='10px'>
              <Card>
                <CardBody display='flex' flexDirection='row' justifyContent='space-between'>
                  <Box>
                    <Heading size='sm'>+1 Round</Heading>
                    <p>Additional round.</p>
                  </Box>
                  <Stack direction='column' justifyContent='center'>
                    <Button variant='ghost' colorScheme='cyan' onClick={() => {
                      cheatModal.onClose();
                      setExtendedRound(true);
                      game!.state.players[gameTurn].cheated = true;
                      game!.state.players[gameTurn].cheats -= 1;
                    }}>Use!</Button>
                  </Stack>
                </CardBody>
              </Card>
              <Card>
                <CardBody display='flex' flexDirection='row' justifyContent='space-between'>
                  <Box>
                    <Heading size='sm'>+1 Board</Heading>
                    <p>Additional board.</p>
                  </Box>
                  <Stack direction='column' justifyContent='center'>
                    <Button variant='ghost' colorScheme='cyan'
                    isDisabled={config.boards < 0} 
                    onClick={() => {
                      cheatModal.onClose();
                      game!.state.players[gameTurn].boards += 1;
                      game!.state.players[gameTurn].cheated = true;
                      game!.state.players[gameTurn].cheats -= 1;
                    }}>Use!</Button>
                  </Stack>
                </CardBody>
              </Card>
              <Card>
                <CardBody display='flex' flexDirection='row' justifyContent='space-between'>
                  <Box>
                    <Heading size='sm'>Short Board</Heading>
                    <p>Places a 1xblock board.</p>
                  </Box>
                  <Stack direction='column' justifyContent='center'>
                    <Button variant='ghost' colorScheme='cyan' onClick={() => {
                      cheatModal.onClose();
                      setNextBoardLength(1);
                      game!.state.players[gameTurn].cheated = true;
                      game!.state.players[gameTurn].cheats -= 1;
                    }}>Use!</Button>
                  </Stack>
                </CardBody>
              </Card>
              <Card>
                <CardBody display='flex' flexDirection='row' justifyContent='space-between'>
                  <Box>
                    <Heading size='sm'>Long Board</Heading>
                    <p>Places a 3xblock board.</p>
                  </Box>
                  <Stack direction='column' justifyContent='center'>
                    <Button variant='ghost' colorScheme='cyan' onClick={() => {
                      cheatModal.onClose();
                      setNextBoardLength(3);
                      game!.state.players[gameTurn].cheated = true;
                      game!.state.players[gameTurn].cheats -= 1;
                    }}>Use!</Button>
                  </Stack>
                </CardBody>
              </Card>
              <Card>
                <CardBody display='flex' flexDirection='row' justifyContent='space-between'>
                  <Box>
                    <Heading size='sm'>Destroyer</Heading>
                    <p>Invalidates a nearby board.</p>
                  </Box>
                  <Stack direction='column' justifyContent='center'>
                    <Button variant='ghost' colorScheme='cyan'
                    isDisabled={
                      game &&
                      !game.validBoardAt(game!.state.players[gameTurn].position, Direction.LEFT) &&
                      !game.validBoardAt(game!.state.players[gameTurn].position, Direction.TOP) &&
                      !game.validBoardAt(game!.state.players[gameTurn].position, Direction.RIGHT) &&
                      !game.validBoardAt(game!.state.players[gameTurn].position, Direction.BOTTOM)
                    }>Use!</Button>
                  </Stack>
                </CardBody>
              </Card>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={finishModal.isOpen} onClose={finishModal.onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered>
        <ModalOverlay backdropFilter='blur(10px)'/>
        <ModalContent textAlign='center'>
          <ModalBody>
            <Box transform='translateY(-60px)'>
              <Box key={ranking()[0]}
              bg={['red.400', 'blue.400', 'green.400', 'yellow.400'][ranking()[0]]} width='110px' height='110px' borderRadius='50%'
              border='5px solid white'
              marginLeft='auto' marginRight='auto'></Box>
              <Heading>1st</Heading>
              <Text fontStyle='italic'>
                {game?.state.players[ranking()[0]].cheated ? 'Cheater, though.' : 'True victory.'}
              </Text>
            </Box>
            <Stack direction='row' justifyContent='center' gap='30px' transform='translateY(-20px)'>
              {ranking().slice(1).map((index, rank) =>
                <Box>
                  <Box key={rank}
                  bg={['red.400', 'blue.400', 'green.400', 'yellow.400'][index]} width='60px' height='60px' borderRadius='50%'
                  marginLeft='auto' marginRight='auto'></Box>
                  <p>
                    <strong>
                      {rank === 0 ? '2nd' : (rank === 1 ? '3rd' : '4th')}
                    </strong>
                  </p>
                </Box>
                )}
            </Stack>
          </ModalBody>
          <ModalFooter display='flex' flexDirection='row' justifyContent='space-between'>
            <Button colorScheme='green' isDisabled>Save Replay</Button>
            <Button onClick={() => {
              router.push('/');
            }}>Back</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}