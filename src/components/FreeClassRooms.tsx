import styles from '~/styles/freeclassroom.module.css';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { ROUTING } from '~/lib/constant';
import BackBtn from './design/BackBtn';
import {
   Alert,
   Box,
   Card,
   Center,
   Flex,
   Heading,
   Icon,
   Input,
   Textarea,
   useMediaQuery
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import React from 'react';
import { WarningTwoIcon } from '@chakra-ui/icons';

interface IRoomsType {
   room: Array<string>;
   lab: Array<string>;
   seminar: Array<string>;
}

export default function FreeClassRooms({ freeRooms, currTime }: { freeRooms: Array<string>, currTime: Date }) {
   const [isUnder500] = useMediaQuery('(max-width: 500px)');

   const [rooms, setRooms] = useState<IRoomsType>({
      room: [],
      lab: [],
      seminar: []
   });

   const [input, setInput] = useState<string>('');

   useEffect(() => {
      let state: IRoomsType = {
         room: [],
         lab: [],
         seminar: []
      };

      freeRooms
         .filter((room) => room.toLocaleLowerCase().includes(input))
         .forEach((room) => {
            if (
               room.toLocaleLowerCase().includes('room') &&
               !room.toLocaleLowerCase().includes('seminar')
            )
               state.room.push(room);
            else if (room.toLocaleLowerCase().includes('lab')) state.lab.push(room);
            else if (room.toLocaleLowerCase().includes('seminar')) state.seminar.push(room);
         });

      setRooms(state);
   }, [freeRooms, input]);

   return (
      <div>
         <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
         >
            <Box maxWidth={'10rem'}>
               <Link href={ROUTING.home}>
                  <BackBtn />
               </Link>
            </Box>

            <Box marginY={'2rem'}>
               <Alert background={'blue.400'}
               borderRadius={'lg'}
               marginY={'1rem'}
               >
                  {`Queried at ${currTime.toString()} - Refresh the page to again calculate free classrooms`} 
               </Alert>
               <Center>
                  <Input
                     placeholder="Search Room"
                     width={'40rem'}
                     htmlSize={4}
                     _placeholder={{ color: 'inherit' }}
                     value={input}
                     onChange={(e) => setInput(e.target.value.toLocaleLowerCase())}
                  />
               </Center>
            </Box>
            
            {Object.entries(rooms).map(([key, val], idx) => {
               return (
                  <React.Fragment key={idx}>
                     <Center>
                        <Heading className="roboto">{`${key}s`.toUpperCase()}</Heading>
                     </Center>
                     {val.length == 0 && (
                        <Center marginY={'0.5rem'}>
                           <Alert status="error" justifyContent={'center'}>
                              {`No free ${key.toLocaleLowerCase()} Found`}
                           </Alert>
                        </Center>
                     )}
                     <RoomsRenderer isUnder500={isUnder500} freeRooms={val} />
                  </React.Fragment>
               );
            })}
         </motion.div>
         <Center marginTop={'1rem'} >
                  <Alert status='warning' background={'yellow.600'} justifyContent={'center'}>
                     <Icon paddingRight={'0.2rem'} fontSize={'1.5rem'}>
                        <WarningTwoIcon />
                     </Icon>
                     Free classrooms are still in preview. The information generated by Algorithm may not be 100% accurate.
                  </Alert>
         </Center>
      </div>
   );
}

const RoomsRenderer = ({
   isUnder500,
   freeRooms
}: {
   isUnder500: boolean;
   freeRooms: Array<string>;
}) => {
   return (
      <>
         <Flex
            gap={'0.5rem'}
            flexWrap={'wrap'}
            justifyContent={'center'}
            alignItems={'center'}
            marginY={'1rem'}
            padding={'0.1rem'}
         >
            {freeRooms
               .sort((a, b) => a.length - b.length)
               .map((room, key) => {
                  return (
                     <Card
                        background={'var(--card-color)'}
                        padding={'1rem'}
                        paddingX={isUnder500 ? '1rem' : '1.5rem'}
                        key={key}
                        border={'1px solid var(--border-color)'}
                        fontWeight={'light'}
                        _hover={{ cursor: 'pointer' }}
                     >
                        {room}
                     </Card>
                  );
               })}
         </Flex>
      </>
   );
};
