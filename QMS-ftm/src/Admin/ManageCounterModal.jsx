// ManageCounterModal.jsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure
} from "@nextui-org/react";
import { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const ManageCounterModal = ({ onClose, selectedUser, counters, handleEditCounter }) => {
  const { isOpen, onClose: closeInner } = useDisclosure();
  
  const [editingCounter, setEditingCounter] = useState(null);
  const [counterName, setCounterName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");

  const handleEditCounterLocal = (counter) => {
    setEditingCounter(counter);
    setCounterName(counter.counterName);
    setEmail(counter.email);
    setService(counter.service);
  };

  const handleSubmit = async () => {
    try {
      // Update the counter data in Firestore
      await updateDoc(doc(db, "counter", editingCounter.id), {
        counterName,
        email,
        service
      });

      // Clear form fields after submission
      setCounterName("");
      setEmail("");
      setService("");

      // Close the modal
      closeInner();
      onClose();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleServiceChange = (event) => {
    setService(event.target.value);
  };

  return (
    <>
      {counters.map((counter) => (
        <div key={counter.id}>
          <Button onPress={() => handleEditCounterLocal(counter)} className="bg-[#6236F5] text-white">
            Edit {counter.counterName}
          </Button>
        </div>
      ))}
      <Modal isOpen={isOpen} onClose={closeInner}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Edit Counter</ModalHeader>
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
            <Select
              label="Select your Reason to be here"
              value={service}
              onChange={handleServiceChange}
              required
            >
              <SelectItem className="font-[Outfit]" value="Personal Service (Income, Community, Nativity, etc)">
                Personal Service (Income, Community, Nativity, etc)
              </SelectItem>
              <SelectItem className="font-[Outfit]" value="Home related Service">
                Home related Service
              </SelectItem>
              <SelectItem className="font-[Outfit]" value="Land Related Service">
                Land Related Service
              </SelectItem>
              <SelectItem className="font-[Outfit]" value="Education Related Service">
                Education Related Service
              </SelectItem>
              <SelectItem className="font-[Outfit]" value="Other Services">
                Other Services
              </SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeInner}>
              Close
            </Button>
            <Button color="primary" onPress={handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ManageCounterModal;
