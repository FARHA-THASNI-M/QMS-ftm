// ModalCounter.jsx
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { hash } from "bcryptjs";

const ModalCounter = ({ isOpen, onClose }) => {
  const [counterName, setCounterName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [service, setService] = useState("");
  const services = [
    "Personal Service (Income, Community, Nativity, etc)",
    "Home related Service",
    "Land Related Service",
    "Education Related Service",
    "Other Services",
  ];

  const handleSubmit = async () => {
    try {
      const id = uuidv4();
      const hashedPassword = await hash(password, 10);

      await addDoc(collection(db, "counter"), {
        id,
        counterName,
        email,
        password: hashedPassword,
        service,
      });

      setCounterName("");
      setEmail("");
      setPassword("");
      setService("");
      onClose();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleServiceChange = (event) => {
    setService(event.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Add Counter</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            label="Counter Name"
            value={counterName}
            onChange={(e) => setCounterName(e.target.value)}
          />
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Select
            label="Select your Reason to be here"
            onChange={handleServiceChange}
            required
          >
            {services.map((item) => (
              <SelectItem className="font-[Outfit]" value={item} key={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalCounter;
