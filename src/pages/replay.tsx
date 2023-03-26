import { formatAction } from "@/shared/common";
import { GameDisplay } from "@/shared/display";
import { ReplayManager, SerializedGameReplay, TimerElapsed } from "@/shared/game";
import { parseQuery } from "@/shared/utils";
import { Box, Button, Heading, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Portal, Stack, Text } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Replay() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [manager, setManager] = useState<ReplayManager>();
  const [display, setDisplay] = useState<GameDisplay>();
  const [current, setCurrent] = useState(-1);
  useEffect(() => {
    const extractedId = parseQuery().id;
    setId(extractedId);
    invoke('get_replay', { id: extractedId }).then(replay => {
      const manager = new ReplayManager(ReplayManager.deserialize(replay as SerializedGameReplay));
      setManager(manager);
      setDisplay(new GameDisplay((document.getElementById('canvas') as HTMLCanvasElement).getContext('2d')!, 550, true));
    })
  }, []);
  useEffect(() => {
    display?.render(manager!.state);
  }, [manager, current]);
  return (
    <Stack direction='column' className='fill'>
      <Stack direction='row' padding='20px' gap='20px'>
        <Stack direction='column' justifyContent='center'>
          <Button leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
            </svg>
          } variant='link' color='black' onClick={() => {
            router.back();
          }}>
            Back
          </Button>
        </Stack>
        <Heading size='md'>
          Viewing Replay ID: {id}
          <Popover trigger='hover'>
            <PopoverTrigger>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ display: 'inline-block', marginLeft: '10px' }}>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow/>
                <PopoverBody>
                <p>
                  <strong>Players</strong>: {manager?.replay.config.players}
                </p>
                <p>
                  <strong>Boards</strong>: {manager && (manager.replay.config.boards < 0 ? 'infinite' : manager.replay.config.boards)}
                </p>
                <p>
                  <strong>Cheats</strong>: {manager?.replay.config.cheats}
                </p>
                <p>
                  <strong>Timeout Punishment</strong>: {manager && {
                    [TimerElapsed.LOSE]: 'Surrender',
                    [TimerElapsed.BOARD]: '+1 Board (opponent)',
                    [TimerElapsed.CHEAT]: '+1 Cheat (opponent)'
                  }[manager.replay.config.elapsed]}
                </p>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </Heading>
      </Stack>
      <Stack direction='column' justifyContent='center' flexGrow='1'>
        <Stack direction='row' justifyContent='space-evenly'>
          <Box>
            <canvas id='canvas' width='550' height='550' style={{ border: '1px solid rgba(0, 0, 0, .2)'}}></canvas>
          </Box>
          <Stack textAlign='center' justifyContent='center' direction='column'>
            <Box>
              <Heading size='md' marginBottom='10px'>
                Current Step:
              </Heading>
              <Heading size='lg' fontWeight={400} marginBottom='10px' className="mono">
                {current === -1 ? 'prepare' : formatAction(manager!.replay.actions[current])}
              </Heading>
              <p><small>{current+1} of {manager?.steps} steps</small></p>
              <Stack direction='row' gap='5px' justifyContent='center' marginTop='10px'>
                <Button isDisabled={current <= -1} onClick={() => {
                  setCurrent(current-1);
                  const newManager = new ReplayManager(manager!.replay);
                  for (let i = 0; i < current; i++) {
                    newManager.nextAction();
                  }
                  setManager(newManager);
                }}>&lt; Previous</Button>
                <Button isDisabled={manager && current >= manager.steps - 1} onClick={() => {
                  setCurrent(current+1);
                  manager!.nextAction();
                }}>Next &gt;</Button>
              </Stack>
              <Stack direction='row' marginTop='50px' gap='10px' justifyContent='center'>
                { manager && manager.state.players.map((player, index) => 
                  <Box 
                    key={index} 
                    border='3px solid' borderColor={current >= 0 && manager.turn === index ? 'pink.400' : 'white'} borderRadius='10px' 
                    padding='10px'>
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
                    { manager.winners.includes(index)? <Text color='green.400'><strong>WINNER</strong></Text>: undefined }
                    { manager.losers.includes(index)? <Text color='red.400'><strong>LOSER</strong></Text>: undefined }
                  </Box>)
                  }
                </Stack>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}