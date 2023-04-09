import CodeBox from "@/components/CodeBox";
import { Stack, Button, Heading, Box, Text, Image, UnorderedList, ListItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Rules() {
  const router = useRouter();
  const [chinese, setChinese] = useState(false);
  return (
    <Box className='fill'>
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
          Quoridor Game Rules
        </Heading>
      </Stack>
      <Box marginLeft='auto' marginRight='auto' maxWidth='80%'>
        <Button leftIcon={
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z"/>
            <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 0 1-.415-.492 1.988 1.988 0 0 1-.94.31z"/>
          </svg>
        } variant='link' onClick={() => setChinese(!chinese)}>
          Switch Language
        </Button>
        { chinese ? <ChineseVersion/> : <EnglishVersion/> }
        <Text textAlign='center' marginTop='30px' paddingBottom='20px'
        color='gray.500' fontSize='12px'>
          Copyright 2023 origamizyt.
          All rights reserved.
        </Text>
      </Box>
    </Box>
  )
}

function EnglishVersion() {
  return <>
    <Heading textAlign='center' size='lg'>
      Quoridor Handbook
    </Heading>
    <Heading textAlign='center' size='sm' color='gray.500'>
      Version v1
    </Heading>
    <Heading textAlign='center' size='md' marginTop='20px'>
      1. Basic Rules
    </Heading>
    <Text textIndent="50px" marginTop='20px'>
      Quoridor is a strategy game with 2 players.
      The goal of the game is to move your <b>avatar</b> (represented by a colored square in the game play) to the <b>baseline</b> (represented by a colored line identical with his color) of your opponent.
      During this process, your opponent can place <b>boards</b> (represented by a purple line with both sides marked) to hinder you from doing this, and you can also place boards to hinder him.
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      You cannot, however, completely <b>block</b> your opponent from reaching your baseline.
      Instead, you must leave him at least one possible route, but the length of that route is arbitrary.
    </Text>
    <Heading textAlign='center' size='md' marginTop='20px'>
      2. Game Grid
    </Heading>
    <Text textIndent="50px" marginTop='10px'>
      The valid area of this game is a 9&times;9 plate.
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      Avatars must stay <b>in the grid boxes</b>, that is, surrounded by lines inside the grid.
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      Boards must be placed <b>on the grid lines</b> to behave like a wall. Both ends of the board must fall on grid points.
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      The most top-left point of the grid is given the coordinates of (0,0).
      X-axis is horizontal, Y-axis is vertical, assigning all points coordinates from (0,0) to (9,9).
      The coordinates of a grid box is the coordinates of its top-left point.
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      For example, in Figure 1 shown below, the red avatar is in box (4,3), the blue avatar (4,5).
      The board is from grid point (4,5) to (6,5).
    </Text>
    <Text fontSize='12px' marginTop='10px' color='gray.500' textAlign='center'>
      Figure 1: Coordinates System
      <Image src='/handbook-figure-1.png' alt='Figure 1' maxWidth='500px' margin='auto'/>
    </Text>
    <Heading textAlign='center' size='md' marginTop='20px'>
      3. Game Process
    </Heading>
    <Text textIndent="50px" marginTop='20px'>
      When a game begins, the red avatar (of player1) is at box (4,0), while the blue avatar (of player2) is at box (4,8).
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      In each player's turn, the player has to take exactly one of the following actions:
    </Text>
    <UnorderedList marginLeft='50px' marginTop='10px'>
      <ListItem><b>Move</b>. You can move your avatar from its current box to a box next to it if no boards prevent you from doing this, e.g. from (5,6) to (5,7).</ListItem>
      <ListItem>
        <b>Jump</b>. Jumping is a special kind of moving. If your opponent is next to you with no boards in between, you can jump over your opponent.
        In normal cases, you can only jump straight over, but if there is a board over your opponent or the box you are jumping to is outside the grid,
        you can jump to either sides of your opponent (if no boards are blocking you).
      </ListItem>
    </UnorderedList>
    <Text fontSize='12px' marginTop='10px' color='gray.500' textAlign='center'>
      Figure 2: Normal Jump (player2 from (4,5) to (4,3))
      <Image src='/handbook-figure-2.png' alt='Figure 2' maxWidth='500px' margin='auto'/>
    </Text>
    <Text fontSize='12px' marginTop='10px' color='gray.500' textAlign='center'>
      Figure 3: Alternative Jump (player1 from (4,4) to (5,3) / (5,5))
      <Image src='/handbook-figure-3.png' alt='Figure 3' maxWidth='500px' margin='auto'/>
    </Text>
    <Text fontSize='12px' marginTop='10px' color='gray.500' textAlign='center'>
      Figure 4: Alternative Jump (Blocked) (player1 from (4,4) to (5,3))
      <Image src='/handbook-figure-4.png' alt='Figure 4' maxWidth='500px' margin='auto'/>
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      As shown in the above image, move and jump choices are displayed in green circles. 
      Click on the avatar to display these choices, and click on the circles to make the move.
      Clicking elsewhere will cancel the move.
    </Text>
    <UnorderedList marginLeft='50px' marginTop='10px'>
      <ListItem>
        <b>Place a board</b>. Places a board of length 2.
        Boards must not intersect with each other, but crossing another board's end is allowed.
        As described in Section 1, you cannot completely block your opponent from reaching your baseline (unless they've surrendered).
      </ListItem>
    </UnorderedList>
    <Text fontSize='12px' marginTop='10px' color='gray.500' textAlign='center'>
      Figure 5: Board Choices
      <Image src='/handbook-figure-5.png' alt='Figure 5' maxWidth='500px' margin='auto'/>
    </Text>
    <Text fontSize='12px' marginTop='10px' color='gray.500' textAlign='center'>
      Figure 6: Board Choices (cannot place board from (4,5) to (4,7) as this board seals player2)
      <Image src='/handbook-figure-6.png' alt='Figure 6' maxWidth='500px' margin='auto'/>
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      To display board choices, click on a grid point. To place a board, click on the green circles.
      Clicking elsewhere will cancel the board placement.
      You cannot place boards on the grid borders (e.g. from (0,0) to (0,2)).
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      By default, every player has 10 boards, but this is configurable.
      After you run out of boards, you cannot place any boards.
    </Text>
    <UnorderedList marginLeft='50px' marginTop='10px'>
      <ListItem>
        <b>Surrender</b>. If you see no hope in winning, you can claim your opponent as winner.
        Click the "Surrender" button to declare your failure.
      </ListItem>
    </UnorderedList>
    <Text textIndent="50px" marginTop='10px'>
      The above actions are repeated in turn, until one of the players reaches its destination or surrenders.
    </Text>
    <Heading textAlign='center' size='md' marginTop='20px'>
      4. Extension Rules
    </Heading>
    <Heading textAlign='center' size='sm' marginTop='20px'>
      4.1 Four Player Mode
    </Heading>
    <Text textIndent="50px" marginTop='20px'>
      Quoridor can also be played with 4 participants.
      Similar to standard mode, players must move to their opposite baselines.
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      Changed rules in 4 player mode:
    </Text>
    <UnorderedList marginLeft='50px' marginTop='10px'>
      <ListItem>
        The grid is extended to 11&times;11.
        When the game begins, all players are located in the middle of their baselines.
      </ListItem>
      <ListItem>
        Everyone has 7 boards by default. Still, board count is configurable.
      </ListItem>
      <ListItem>
        The game won't end until 3 players have finished their game (that is, winned or surrendered).
        When a player finished his game, his avatar will be frozen to its current box and excluded from route judgment (you don't have to leave him a route).
        Other avatars can jump over him.
      </ListItem>
      <ListItem>
        If a player blocks you from jumping, than you can jump over him, too.
        e.g. If you are in (5,1), and other players (5,2), (5,3), (5,4), than you can directly jump to (5,5) in one step.
      </ListItem>
    </UnorderedList>
    <Heading textAlign='center' size='sm' marginTop='20px'>
      4.2 Timer
    </Heading>
    <Text textIndent="50px" marginTop='20px'>
      Timers are globally enabled in provided game presets and are set to 20 seconds.
      Timer availablility and value is configurable.
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      If the timer elapsed and you still haven't finished your current step, one of three punishments below will be executed:
    </Text>
    <UnorderedList marginLeft='50px' marginTop='10px'>
      <ListItem>
        <b>+1 Board for your opponent (2 player mode only)</b>. Your opponent will receive an additional board.
      </ListItem>
      <ListItem>
        <b>+1 Cheat for your opponent (2 player &amp; cheatable mode only)</b>. Your opponent will receive an additional cheat.
      </ListItem>
      <ListItem>
        <b>Surrender</b>. Lose the game.
      </ListItem>
    </UnorderedList>
    <Text textIndent="50px" marginTop='10px'>
      The timer will not reset until next step, which means the punishment can only be executed once per step.
    </Text>
    <Heading textAlign='center' size='sm' marginTop='20px'>
      4.3 Cheatable Mode
    </Heading>
    <Text textIndent="50px" marginTop='20px'>
      The quoridor game itself is rather boring, so we (I) developed this mode to increase playablility.
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      By default, each player has 1 opportunity to cheat, but this is configurable.
      In one player's turn, he can choose to cheat by clicking the "Cheat" button.
      In the cheat list, he can select one of the following actions:
    </Text>
    <UnorderedList marginLeft='50px' marginTop='10px'>
      <ListItem>
        <b>Additional round</b>. You can play 2 rounds (moving or placing boards) subsequently.
      </ListItem>
      <ListItem>
        <b>Additional board</b>. Receive an extra board.
      </ListItem>
      <ListItem>
        <b>Short board</b>. The next board you place will be of length 1.
        If you use this cheat, you can only place board in this round.
      </ListItem>
      <ListItem>
        <b>Long board</b>. The next board you place will be of length 3.
        If you use this cheat, you can only place board in this round.
      </ListItem>
      <ListItem>
        <b>Destroyer</b>. You can invalidate a nearby board.
        The board will hold its place (prevent board placement) as any normal boards, but you (and other players) can move through it.
        The destroying process consumes one step, so you cannot go through the board in the current round.
      </ListItem>
    </UnorderedList>
    <Text textIndent="50px" marginTop='10px'>
      If you wins without cheating, you will get a "True Victory" sign in the results dialog.
      If you wins by cheating, you will get a "Cheater, though".
    </Text>
    <Heading textAlign='center' size='md' marginTop='20px'>
      5. Additional Features
    </Heading>
    <Heading textAlign='center' size='sm' marginTop='20px'>
      5.1 Replays
    </Heading>
    <Text textIndent="50px" marginTop='20px'>
      You can save your game replay by clicking the "Save Replay" button in the results dialog and specifying a name.
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      In the lobby, you can find your replay in the "Replays" section.
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      In the replay, every step is represented using the QRA (Quoridor Replay Actions) format, that is:
    </Text>
    <CodeBox 
      style={{ marginLeft: '50px', marginRight: '50px', marginTop: '10px' }}
      tag='QRA'>
      !&lt;action&gt; [&lt;parameter&gt; ...]
    </CodeBox>
    <Text textIndent="50px" marginTop='10px'>
      For example,
    </Text>
    <CodeBox 
      style={{ marginLeft: '50px', marginRight: '50px', marginTop: '10px' }}
      tag='QRA'>
      !board (3,4) V 2
    </CodeBox>
    <Text textIndent="50px" marginTop='10px'>
      Means placing a vertical board starting from (3,4) of length 2 ((3,4) to (3,6)). And,
    </Text>
    <CodeBox 
      style={{ marginLeft: '50px', marginRight: '50px', marginTop: '10px' }}
      tag='QRA'>
      !cheat:destroyer (5,6) H
    </CodeBox>
    <Text textIndent="50px" marginTop='10px'>
      Means destroying a horizontal board starting from (5,6).
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      You can also directly read the replay data located in the&nbsp;
      <span className='mono'>[app-folder]/.quoridor/replays</span>&nbsp;
      folder. Each replay's file name is identical to its id shown in the lobby, with a .cbor extension.
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      Replay data is serialized using the CBOR (Concise Binary Object Representation) format as defined in RFC 8949.
      Before serialization, each replay action is encoded into an array of numbers or points, as:
    </Text>
    <CodeBox 
      style={{ marginLeft: '50px', marginRight: '50px', marginTop: '10px' }}
      tag='Encoded Action'>
      [2, [4, 5], 0, 2]
    </CodeBox>
    <Text textIndent="50px" marginTop='10px'>
      Means board placement (2), at (4,5), horizontal (0), length 2.
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      Find out more by reading the source code at gitee (https://gitee.com/origamizyt/quoridor).
    </Text>
  </>;
}

function ChineseVersion() {
  return <>
    <Heading textAlign='center' size='lg'>
      步步为营 游戏手册
    </Heading>
    <Heading textAlign='center' size='sm' color='gray.500'>
      版本 v1
    </Heading>
    <Heading textAlign='center' size='md' marginTop='20px'>
      1. 基础规则
    </Heading>
    <Text textIndent="50px" marginTop='20px'>
      步步为营是一个2人策略游戏。
      游戏的目标是将您的<b>棋子</b>（以一个有颜色的正方形表示）移动至对方的<b>底线</b>（以一条与对方棋子颜色相同的直线表示）。
      在这个过程当中，您的对手可以放置<b>隔板</b>（以一条紫色的线段表示）来阻止您赢得游戏，您也可以放置隔板来阻挡您的对手。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      然而，您不可以完全封死您的对手到您底线的路。
      您必须给您的对手留下至少一条路径，但是这条路径的长度是任意的。
    </Text>
    <Heading textAlign='center' size='md' marginTop='20px'>
      2. 坐标系统
    </Heading>
    <Text textIndent="50px" marginTop='10px'>
      游戏的有效区域是一个 9&times;9 的棋盘。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      您的棋子必须待在<b>棋盘格</b>当中。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      隔板必须被放置在<b>棋盘线</b>上。隔板的端点必须与棋盘格节点重合。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      棋盘最左上角的点为坐标 (0,0) 的点。
      水平方向为X轴，竖直方向为Y轴，因此棋盘上的点的坐标为 (0,0) 到 (9,9)。
      每个棋盘格的坐标为其左上角节点的坐标。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      以下图为例，红色棋子在坐标 (4,3) 的格中，蓝色棋子在坐标 (4,5) 的格中。
      隔板从 (4,5) 格点到 (6,5) 格点。
    </Text>
    <Text fontSize='12px' marginTop='10px' color='gray.500' textAlign='center'>
      图1：坐标系统
      <Image src='/handbook-figure-1.png' alt='Figure 1' maxWidth='500px' margin='auto'/>
    </Text>
    <Heading textAlign='center' size='md' marginTop='20px'>
      3. 游戏进程
    </Heading>
    <Text textIndent="50px" marginTop='20px'>
      游戏开始时，红色棋子（玩家1）在 (4,0) 处，蓝色棋子（玩家2）在 (4,8) 处。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      在每个玩家的回合中，必须采取以下行动的其中一项：
    </Text>
    <UnorderedList marginLeft='50px' marginTop='10px'>
      <ListItem><b>移动</b>。如果没有隔板阻挡，将棋子从当前位置移动至临近的格子中。</ListItem>
      <ListItem>
        <b>跳跃</b>。
        跳跃是一种特殊的移动。如果您的对手紧挨着您又没有隔板在您和您的对手之间，您可以跳过您的对手。
        正常情况下，您必须沿直线跳过对手。但是如果对手的对侧有隔板阻挡或是棋盘边界，
        您可以沿斜线跳到您对手的一侧（如果该侧没有隔板阻挡）。
      </ListItem>
    </UnorderedList>
    <Text fontSize='12px' marginTop='10px' color='gray.500' textAlign='center'>
      图2：正常跳跃（玩家2从 (4,5) 到 (4,3)）
      <Image src='/handbook-figure-2.png' alt='Figure 2' maxWidth='500px' margin='auto'/>
    </Text>
    <Text fontSize='12px' marginTop='10px' color='gray.500' textAlign='center'>
      图3：斜跳（玩家1从 (4,4) 到 (5,3) 或 (5,5)）
      <Image src='/handbook-figure-3.png' alt='Figure 3' maxWidth='500px' margin='auto'/>
    </Text>
    <Text fontSize='12px' marginTop='10px' color='gray.500' textAlign='center'>
      图4：斜跳（有一侧被阻挡）（玩家1从 (4,4) 到 (5,3)）
      <Image src='/handbook-figure-4.png' alt='Figure 4' maxWidth='500px' margin='auto'/>
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      如上图所示，移动与跳跃选项用绿色的圆圈显示。
      单击您的棋子以显示移动与跳跃选项，单击圆圈来执行移动或跳跃。
      单击其他地方将取消移动与跳跃。
    </Text>
    <UnorderedList marginLeft='50px' marginTop='10px'>
      <ListItem>
        <b>放置隔板</b>。放置长度为2的隔板。
        隔板不能与其他隔板重叠，除非是穿过其他隔板的端点。
        像第1部分提到的一样，放置隔板时不能完全堵死您或您的对手（除非他们已经投降）。
      </ListItem>
    </UnorderedList>
    <Text fontSize='12px' marginTop='10px' color='gray.500' textAlign='center'>
      图5：隔板选项
      <Image src='/handbook-figure-5.png' alt='Figure 5' maxWidth='500px' margin='auto'/>
    </Text>
    <Text fontSize='12px' marginTop='10px' color='gray.500' textAlign='center'>
      图6：隔板选项（不能由 (4,5) 到 (4,7) 放置隔板因为这个隔板将封死玩家2）
      <Image src='/handbook-figure-6.png' alt='Figure 6' maxWidth='500px' margin='auto'/>
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      要显示隔板选项，您需要单击棋盘节点。要放置隔板，您需要点击绿色的圆圈。
      单击其他地方将取消隔板放置。
      您不可以在棋盘边界放置隔板（比如从 (0,0) 到 (0,2)）。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      每个玩家默认拥有10块隔板，但这是可配置的。
      当您用完您的隔板后，您不能放置任何隔板。
    </Text>
    <UnorderedList marginLeft='50px' marginTop='10px'>
      <ListItem>
        <b>投降</b>。如果您看不到胜利的希望，您可以向您的对手投降（单击“Surrender”按钮）。
      </ListItem>
    </UnorderedList>
    <Text textIndent="50px" marginTop='10px'>
      以上行动轮流进行，直到一方到达对方底线或投降。
    </Text>
    <Heading textAlign='center' size='md' marginTop='20px'>
      4. 拓展规则
    </Heading>
    <Heading textAlign='center' size='sm' marginTop='20px'>
      4.1 四人模式
    </Heading>
    <Text textIndent="50px" marginTop='20px'>
      步步为营可以由四人游玩。
      与标准模式类似，玩家必须移动到他们对面的底线。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      四人模式中改变的规则：
    </Text>
    <UnorderedList marginLeft='50px' marginTop='10px'>
      <ListItem>
        棋盘格大小为 11&times;11。
        当游戏开始时，每位玩家位于他们底线的中央。
      </ListItem>
      <ListItem>
        每个人拥有7块隔板，但这仍然可以修改。
      </ListItem>
      <ListItem>
        在有三人胜利或投降之前，游戏不会结束。
        当一人胜利时，他的棋子会被锁定在当前位置，且<b>不再参与</b>路径判定。
        其他玩家可以跳过他。
      </ListItem>
      <ListItem>
        可以连续跳跃多个棋子。
        比如您在 (5,1)，其他人分别在 (5,2) (5,3) (5,4) 则您可以直接跳跃至 (5,5)。
      </ListItem>
    </UnorderedList>
    <Heading textAlign='center' size='sm' marginTop='20px'>
      4.2 计时器
    </Heading>
    <Text textIndent="50px" marginTop='20px'>
      在提供的游戏预设中，计时器是全局启用的，且被设置为20秒。
      计时器启用与否与时间都是可设置的。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      如果倒计时结束而您仍未完成当前步，则会收到下列三项惩罚之一：
    </Text>
    <UnorderedList marginLeft='50px' marginTop='10px'>
      <ListItem>
        <b>为您的对手增加一块隔板（仅限双人模式）</b>。您的对手将获得一块隔板。
      </ListItem>
      <ListItem>
        <b>为您的对手增加一次作弊机会（仅限双人作弊模式）</b>。您的对手将获得一次作弊机会。
      </ListItem>
      <ListItem>
        <b>投降</b>。您将输掉本局游戏。
      </ListItem>
    </UnorderedList>
    <Text textIndent="50px" marginTop='10px'>
      在下一步之前计时器都不会重置，因此您一步之中只会收到一次惩罚。
    </Text>
    <Heading textAlign='center' size='sm' marginTop='20px'>
      4.3 作弊模式
    </Heading>
    <Text textIndent="50px" marginTop='20px'>
      步步为营原始规则是非常无聊的，于是我们开发了这个特殊规则来增加趣味。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      每个玩家默认拥有一次作弊机会，但这是可配置的。
      在每个玩家的回合中，可以选择按下“Cheat”按钮来作弊。
      在作弊列表中，他可以选择如下选项之一：
    </Text>
    <UnorderedList marginLeft='50px' marginTop='10px'>
      <ListItem>
        <b>Additional round</b>。您可以连续进行两个回合。
      </ListItem>
      <ListItem>
        <b>Additional board</b>。您可以获得一块额外的隔板。
      </ListItem>
      <ListItem>
        <b>Short board</b>。您放置的下一块板长度为1。
        如果您使用这个选项，那么这步中您只能放置隔板。
      </ListItem>
      <ListItem>
        <b>Long board</b>。您放置的下一块板长度为3。
        如果您使用这个选项，那么这步中您只能放置隔板。
      </ListItem>
      <ListItem>
        <b>Destroyer</b>。您可以摧毁一个您棋子周围的隔板。
        被摧毁的隔板仍会占有其原有的位置（不能放重叠的隔板），但您可以穿过它。
        摧毁的操作算作一步，因此您不能在这回合中穿过摧毁的隔板。
      </ListItem>
    </UnorderedList>
    <Text textIndent="50px" marginTop='10px'>
      如果您未用作弊即取得胜利，您将会获得一个“True Victory”的称号。
      如果您通过作弊取得胜利，您将会获得一个“Cheater, though“的称号。
    </Text>
    <Heading textAlign='center' size='md' marginTop='20px'>
      5. 附加功能
    </Heading>
    <Heading textAlign='center' size='sm' marginTop='20px'>
      5.1 游戏回放
    </Heading>
    <Text textIndent="50px" marginTop='20px'>
      您可以通过点击”Save Replay“按钮并指定回放名称来保存游戏回放。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      在主页，您可以在”Replays“板块找到您的回放。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      回放当中，每一步将会用 QRA 格式表示：
    </Text>
    <CodeBox 
      style={{ marginLeft: '50px', marginRight: '50px', marginTop: '10px' }}
      tag='QRA'>
      !&lt;action&gt; [&lt;parameter&gt; ...]
    </CodeBox>
    <Text textIndent="50px" marginTop='10px'>
      例如，
    </Text>
    <CodeBox 
      style={{ marginLeft: '50px', marginRight: '50px', marginTop: '10px' }}
      tag='QRA'>
      !board (3,4) V 2
    </CodeBox>
    <Text textIndent="50px" marginTop='10px'>
      意味着放置一个由 (3,4) 起始的竖直的长度为2的隔板。
    </Text>
    <CodeBox 
      style={{ marginLeft: '50px', marginRight: '50px', marginTop: '10px' }}
      tag='QRA'>
      !cheat:destroyer (5,6) H
    </CodeBox>
    <Text textIndent="50px" marginTop='10px'>
      意味着摧毁一个由 (5,6) 起始的水平方向的隔板。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      您也可以直接读取位于
      <span className='mono'>[app-folder]/.quoridor/replays</span>
      文件夹的回放文件。
      每个回放文件的文件名为主页上显示的回放ID加上.cbor扩展名。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      回放数据使用 CBOR 格式（RFC 8949）序列化。
      在序列化之前，每步将会被转化为一个包含数字与坐标的数组，如：
    </Text>
    <CodeBox 
      style={{ marginLeft: '50px', marginRight: '50px', marginTop: '10px' }}
      tag='Encoded Action'>
      [2, [4, 5], 0, 2]
    </CodeBox>
    <Text textIndent="50px" marginTop='10px'>
      意味着放置隔板操作 (2)，于坐标 (4,5)，水平方向 (0)，长度2。
    </Text>
    <Text textIndent="50px" marginTop='10px'>
      请阅读源代码 (https://gitee.com/origamizyt/quoridor) 以获取更多编码方式。
    </Text>
  </>;
}