// import React from 'react';
import React from 'react';
import { HStack, Avatar, Text, Box } from "@chakra-ui/react";

const Message = ({ text, uri, user = "other" }) => {
  return (
    <HStack
      spacing={4}
      align="center"
      p={2}
      bg="gray.50"
      borderRadius="md"
      w="50%"
      
      alignSelf={user === "me" ? "flex-end" : "flex-start"}
      justifyContent={user === "me" ? "flex-end" : "flex-start"}
      // align-Self={user!=="me"?"flex-start":"flex-end"}
      // justify-Content={user === "me" ? "flex-start" : "flex-end"}
      
    >
      {/* {user !== "me" && <Avatar src={uri} />}
      <Box bg={user === "me" ? "blue.100" : "white"} p={2} borderRadius="md">
        <Text color="black">{text}</Text>
      </Box>
      {user === "me" && <Avatar src={uri} />} */}
     
      <Text color={"black"}>{text}</Text>
      
      <Avatar src={uri} /> 
    </HStack>
  );
};

export default Message;
